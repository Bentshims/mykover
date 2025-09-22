import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import env from '#start/env'
import Otp from '#models/otp'
import User from '#models/user'
import { v4 as uuidv4 } from 'uuid'

export default class OtpService {
  private static generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  static async createOtp(
    userId: string,
    channel: 'email' | 'sms'
  ): Promise<{ otp: Otp; code: string }> {
    // Invalider les anciens OTPs non utilisés pour ce canal
    await Otp.query()
      .where('user_id', userId)
      .where('channel', channel)
      .where('used', false)
      .update({ used: true })

    const code = this.generateOtpCode()
    const otpHash = await hash.make(code)
    const expiresMinutes = env.get('OTP_EXPIRES_MINUTES', 10)

    const otp = await Otp.create({
      id: uuidv4(),
      user_id: userId,
      otp_hash: otpHash,
      channel,
      used: false,
      expires_at: DateTime.now().plus({ minutes: expiresMinutes })
    })

    return { otp, code }
  }

  static async verifyOtp(
    identifier: string,
    code: string,
    channel: 'email' | 'sms'
  ): Promise<{ valid: boolean; user?: User; otp?: Otp }> {
    // Trouver l'utilisateur par email ou phone
    const user = await User.query()
      .where((query) => {
        if (identifier.includes('@')) {
          query.where('email', identifier)
        } else {
          query.where('phone', identifier)
        }
      })
      .first()

    if (!user) {
      return { valid: false }
    }

    // Trouver l'OTP le plus récent valide
    const otp = await Otp.query()
      .where('user_id', user.id)
      .where('channel', channel)
      .where('used', false)
      .where('expires_at', '>', DateTime.now().toSQL())
      .orderBy('created_at', 'desc')
      .first()

    if (!otp) {
      return { valid: false, user }
    }

    const isValid = await hash.verify(otp.otp_hash, code)
    if (!isValid) {
      return { valid: false, user, otp }
    }

    // Marquer l'OTP comme utilisé
    otp.used = true
    await otp.save()

    return { valid: true, user, otp }
  }
}
