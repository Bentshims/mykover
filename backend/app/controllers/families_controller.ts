import type { HttpContext } from '@adonisjs/core/http'
import Family from '#models/family'
import FamilyMember from '#models/family_member'
import { createFamilyValidator, getFamilyValidator } from '#validators/family'
import db from '@adonisjs/lucid/services/db'

export default class FamiliesController {
  /**
   * Créer une famille avec ses membres
   */
  async create({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createFamilyValidator)

    // Validation du nombre de membres selon le plan
    const limits = Family.PLAN_LIMITS[data.planType]
    const memberCount = data.members.length

    if (memberCount < limits.min || memberCount > limits.max) {
      return response.badRequest({
        success: false,
        message: `Le plan ${data.planType} nécessite entre ${limits.min} et ${limits.max} membre(s)`,
      })
    }

    // Transaction pour créer famille + membres
    const trx = await db.transaction()

    try {
      // Génération du code unique
      let familyCode: string
      let codeExists = true

      while (codeExists) {
        familyCode = Family.generateCode()
        const existing = await Family.query({ client: trx }).where('code', familyCode).first()
        codeExists = !!existing
      }

      // Création famille
      const family = await Family.create({
        ownerId: user.id,
        code: familyCode!,
        planType: data.planType,
        paymentStatus: 'pending',
      }, { client: trx })

      // Création membres
      const members = await Promise.all(
        data.members.map((member) =>
          FamilyMember.create({
            familyId: family.id,
            firstName: member.firstName,
            lastName: member.lastName,
            birthDate: member.birthDate,
            isSick: member.isSick,
            photoUrl: member.photoUrl,
            photoPublicId: member.photoPublicId || null,
          }, { client: trx })
        )
      )

      await trx.commit()

      return response.created({
        success: true,
        message: 'Famille créée avec succès',
        data: {
          family: {
            id: family.id,
            code: family.code,
            planType: family.planType,
            paymentStatus: family.paymentStatus,
          },
          members: members.map((m) => ({
            id: m.id,
            firstName: m.firstName,
            lastName: m.lastName,
            birthDate: m.birthDate.toISODate(),
            isSick: m.isSick,
            photoUrl: m.photoUrl,
          })),
        },
      })
    } catch (error) {
      await trx.rollback()
      console.error('[FamiliesController] Erreur création:', error)
      return response.internalServerError({
        success: false,
        message: 'Erreur lors de la création de la famille',
      })
    }
  }

  /**
   * Récupérer une famille par son code
   */
  async show({ request, response }: HttpContext) {
    const { code } = await request.validateUsing(getFamilyValidator)

    const family = await Family.query()
      .where('code', code)
      .preload('members')
      .first()

    if (!family) {
      return response.notFound({
        success: false,
        message: 'Famille introuvable',
      })
    }

    return response.ok({
      success: true,
      data: {
        id: family.id,
        code: family.code,
        planType: family.planType,
        paymentStatus: family.paymentStatus,
        members: family.members.map((m) => ({
          id: m.id,
          firstName: m.firstName,
          lastName: m.lastName,
          birthDate: m.birthDate.toISODate(),
          isSick: m.isSick,
          photoUrl: m.photoUrl,
        })),
      },
    })
  }

  /**
   * Récupérer les familles de l'utilisateur connecté
   */
  async index({ response, auth }: HttpContext) {
    const user = auth.user!

    const families = await Family.query()
      .where('ownerId', user.id)
      .preload('members')
      .orderBy('createdAt', 'desc')

    return response.ok({
      success: true,
      data: families.map((f) => ({
        id: f.id,
        code: f.code,
        planType: f.planType,
        paymentStatus: f.paymentStatus,
        membersCount: f.members.length,
        createdAt: f.createdAt.toISO(),
      })),
    })
  }
}

