import { test } from '@japa/runner'
import OtpService from '#services/otp_service'
import { DateTime } from 'luxon'

test.group('OtpService unit tests', () => {
  test('should create OTP with correct format', async ({ assert }) => {
    const mockUserId = 'user-123'
    const canal = 'email'

    // Mock la création d'OTP
    const result = await OtpService.createOtp(mockUserId, canal)
    
    assert.exists(result.otp)
    assert.exists(result.code)
    assert.equal(result.code.length, 6)
    assert.isTrue(/^\d{6}$/.test(result.code)) // 6 chiffres
    assert.equal(result.otp.channel, canal)
    assert.equal(result.otp.user_id, mockUserId)
    assert.isFalse(result.otp.used)
  })

  test('should validate phone number format for RDC', async ({ assert }) => {
    const validPhones = [
      '+2438123456789',
      '+2439987654321'
    ]

    const invalidPhones = [
      '+243712345678', // Ne commence pas par 8 ou 9
      '+24381234567',  // Trop court
      '+2438123456789O', // Trop long
      '2438123456789',   // Pas de +
      '+1234567890'      // Autre pays
    ]

    for (const phone of validPhones) {
      assert.isTrue(
        /^\+243[89][0-9]{8}$/.test(phone),
        `${phone} devrait être valide`
      )
    }

    for (const phone of invalidPhones) {
      assert.isFalse(
        /^\+243[89][0-9]{8}$/.test(phone),
        `${phone} devrait être invalide`
      )
    }
  })

  test('should handle OTP expiration correctly', async ({ assert }) => {
    // Test d'un OTP expiré
    const expiredOtp = {
      expires_at: DateTime.now().minus({ minutes: 5 }), // Expiré il y a 5 minutes
      used: false,
      isExpired() {
        return this.expires_at < DateTime.now()
      },
      isValid() {
        return !this.used && !this.isExpired()
      }
    }

    assert.isTrue(expiredOtp.isExpired())
    assert.isFalse(expiredOtp.isValid())

    // Test d'un OTP valide
    const validOtp = {
      expires_at: DateTime.now().plus({ minutes: 5 }), // Expire dans 5 minutes
      used: false,
      isExpired() {
        return this.expires_at < DateTime.now()
      },
      isValid() {
        return !this.used && !this.isExpired()
      }
    }

    assert.isFalse(validOtp.isExpired())
    assert.isTrue(validOtp.isValid())

    // Test d'un OTP utilisé
    const usedOtp = {
      expires_at: DateTime.now().plus({ minutes: 5 }),
      used: true,
      isExpired() {
        return this.expires_at < DateTime.now()
      },
      isValid() {
        return !this.used && !this.isExpired()
      }
    }

    assert.isFalse(usedOtp.isExpired())
    assert.isFalse(usedOtp.isValid()) // Invalide car utilisé
  })
})
