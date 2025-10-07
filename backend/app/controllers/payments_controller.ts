import type { HttpContext } from '@adonisjs/core/http'
import Family from '#models/family'
import Payment from '#models/payment'
import CinetPayService from '#services/cinetpay_service'
import { initiatePaymentValidator } from '#validators/payment'
import env from '#start/env'

export default class PaymentsController {
  /**
   * Initie un paiement CinetPay
   */
  async initiate({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const { familyId } = await request.validateUsing(initiatePaymentValidator)

    // Vérifier que la famille existe et appartient à l'utilisateur
    const family = await Family.query()
      .where('id', familyId)
      .where('ownerId', user.id)
      .preload('members')
      .first()

    if (!family) {
      return response.notFound({
        success: false,
        message: 'Famille introuvable',
      })
    }

    // Vérifier qu'aucun paiement n'est déjà en cours ou réussi
    if (family.paymentStatus === 'paid') {
      return response.badRequest({
        success: false,
        message: 'Cette famille a déjà un paiement validé',
      })
    }

    // Calculer le montant selon le plan
    const amount = Family.PLAN_PRICES[family.planType]
    const transactionId = `MYK-${Date.now()}-${family.id.slice(0, 8)}`

    // Créer l'enregistrement de paiement
    const payment = await Payment.create({
      familyId: family.id,
      amount,
      transactionRef: transactionId,
      method: 'mobile_money',
      status: 'pending',
    })

    // URLs de retour
    const appUrl = env.get('APP_URL', 'http://localhost:3333')
    const returnUrl = `${appUrl}/api/payments/return?transaction_id=${transactionId}`
    const notifyUrl = `${appUrl}/api/payments/callback`

    // Initiation CinetPay
    const result = await CinetPayService.initiatePayment({
      amount,
      transactionId,
      description: `Mykover - Plan ${family.planType} (${family.code})`,
      customerName: user.fullname.split(' ')[0] || 'Client',
      customerSurname: user.fullname.split(' ')[1] || 'Mykover',
      customerEmail: user.email,
      customerPhone: user.phone,
      returnUrl,
      notifyUrl,
    })

    if (!result.success) {
      payment.status = 'failed'
      await payment.save()

      return response.badRequest({
        success: false,
        message: result.message || 'Échec initiation paiement',
      })
    }

    // Mise à jour du paiement avec les infos CinetPay
    payment.rawResponse = JSON.stringify(result)
    await payment.save()

    return response.ok({
      success: true,
      message: 'Paiement initié avec succès',
      data: {
        transactionId,
        paymentUrl: result.paymentUrl,
        amount,
        currency: 'USD',
      },
    })
  }

  /**
   * Callback CinetPay (webhook)
   */
  async callback({ request, response }: HttpContext) {
    const data = request.all()

    console.log('[PaymentCallback] Données reçues:', data)

    // Validation de la signature
    if (!CinetPayService.validateSignature(data)) {
      console.error('[PaymentCallback] Signature invalide')
      return response.badRequest({ message: 'Signature invalide' })
    }

    const transactionId = data.cpm_trans_id
    const status = data.cpm_result === '00' ? 'success' : 'failed'

    // Recherche du paiement
    const payment = await Payment.query()
      .where('transactionRef', transactionId)
      .preload('family')
      .first()

    if (!payment) {
      console.error('[PaymentCallback] Paiement introuvable:', transactionId)
      return response.notFound({ message: 'Paiement introuvable' })
    }

    // Mise à jour du statut
    payment.status = status
    payment.rawResponse = JSON.stringify(data)
    await payment.save()

    // Mise à jour de la famille
    payment.family.paymentStatus = status === 'success' ? 'paid' : 'failed'
    await payment.family.save()

    console.log(`[PaymentCallback] Paiement ${transactionId} -> ${status}`)

    return response.ok({ message: 'Callback traité' })
  }

  /**
   * Vérification du statut d'un paiement (polling)
   */
  async verify({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const transactionId = request.input('transaction_id')

    if (!transactionId) {
      return response.badRequest({
        success: false,
        message: 'transaction_id manquant',
      })
    }

    const payment = await Payment.query()
      .where('transactionRef', transactionId)
      .preload('family', (q) => q.where('ownerId', user.id))
      .first()

    if (!payment || !payment.family) {
      return response.notFound({
        success: false,
        message: 'Paiement introuvable',
      })
    }

    // Si déjà validé, retourner le statut
    if (payment.status !== 'pending') {
      return response.ok({
        success: true,
        data: {
          status: payment.status,
          transactionId: payment.transactionRef,
          familyCode: payment.family.code,
        },
      })
    }

    // Sinon, vérifier auprès de CinetPay
    const result = await CinetPayService.verifyPayment(transactionId)

    if (result.success && result.status === 'ACCEPTED') {
      payment.status = 'success'
      payment.family.paymentStatus = 'paid'
      await payment.save()
      await payment.family.save()
    } else if (result.status === 'REFUSED' || result.status === 'CANCELLED') {
      payment.status = 'failed'
      payment.family.paymentStatus = 'failed'
      await payment.save()
      await payment.family.save()
    }

    return response.ok({
      success: true,
      data: {
        status: payment.status,
        transactionId: payment.transactionRef,
        familyCode: payment.family.code,
      },
    })
  }
}

