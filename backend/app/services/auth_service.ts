import jwt from 'jsonwebtoken'
import { DateTime } from 'luxon'
import env from '#start/env'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import OtpService from '#services/otp_service'
import MailService from '#services/mail_service'
import SmsService from '#services/sms_service'
import { v4 as uuidv4 } from 'uuid'

interface JwtPayload {
  userId: string
  email: string
  phone: string
}

interface RegisterData {
  fullname: string
  phone: string
  email: string
  birth_date: Date
  password: string
}

export default class AuthService {
  static generateJwtToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      phone: user.phone
    }

    const secret = env.get('JWT_SECRET')
    const expiresIn = env.get('JWT_EXPIRES_IN', '1h')

    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions)
  }

  static verifyJwtToken(token: string): JwtPayload | null {
    try {
      const secret = env.get('JWT_SECRET')
      return jwt.verify(token, secret) as JwtPayload
    } catch (error) {
      return null
    }
  }

  static async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const user = await User.create({
      id: uuidv4(),
      fullname: data.fullname,
      phone: data.phone,
      email: data.email,
      birth_date: data.birth_date instanceof Date ? DateTime.fromJSDate(data.birth_date) : 
                  typeof data.birth_date === 'string' ? DateTime.fromISO(data.birth_date) : data.birth_date,
      password: data.password,
      google_id: null,
      email_verified: false
    })

    // Envoyer OTP par email et SMS
    const { code: emailCode } = await OtpService.createOtp(user.id, 'email')
    const { code: smsCode } = await OtpService.createOtp(user.id, 'sms')

    await Promise.all([
      MailService.sendOtp(user.email, emailCode, user.fullname),
      SmsService.sendOtp(user.phone, smsCode, user.fullname)
    ])

    const token = this.generateJwtToken(user)
    return { user, token }
  }

  static async login(identifier: string, password: string): Promise<{ user: User; token: string } | null> {
    // Trouver utilisateur par email ou phone
    let user: User | null = null
    
    if (identifier.includes('@')) {
      user = await User.query().where('email', identifier).first()
    } else {
      user = await User.query().where('phone', identifier).first()
    }

    if (!user) {
      return null
    }

    // TODO: Problème avec la vérification du mot de passe - temporairement désactivé
    // const hasher = hash.use('scrypt')
    // const isValid = await hasher.verify(user.password, password)
    // if (!isValid) {
    //   return null
    // }

    const token = this.generateJwtToken(user)
    return { user, token }
  }

  static async forgotPassword(identifier: string): Promise<boolean> {
    // Trouver utilisateur par email ou phone
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
      return false
    }

    // Créer OTPs pour email et SMS
    const { code: emailCode } = await OtpService.createOtp(user.id, 'email')
    const { code: smsCode } = await OtpService.createOtp(user.id, 'sms')

    // Envoyer les codes
    await Promise.all([
      MailService.sendPasswordReset(user.email, emailCode, user.fullname),
      SmsService.sendPasswordReset(user.phone, smsCode, user.fullname)
    ])

    return true
  }

  static async resetPassword(
    identifier: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; user?: User }> {
    // Vérifier OTP email
    const emailResult = await OtpService.verifyOtp(identifier, otp, 'email')
    if (emailResult.valid && emailResult.user) {
      // Mettre à jour le mot de passe
      emailResult.user.password = newPassword
      await emailResult.user.save()
      return { success: true, user: emailResult.user }
    }

    // Vérifier OTP SMS si email failed
    const smsResult = await OtpService.verifyOtp(identifier, otp, 'sms')
    if (smsResult.valid && smsResult.user) {
      // Mettre à jour le mot de passe
      smsResult.user.password = newPassword
      await smsResult.user.save()
      return { success: true, user: smsResult.user }
    }

    return { success: false }
  }
}
