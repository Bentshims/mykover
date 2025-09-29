import { test } from '@japa/runner'
import AuthService from '#services/auth_service'
import jwt from 'jsonwebtoken'
import env from '#start/env'

test.group('AuthService unit tests', () => {
  test('should generate valid JWT token', async ({ assert }) => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      telephone: '+2438123456789'
    } as any

    const token = AuthService.generateJwtToken(mockUser)
    
    assert.isString(token)
    assert.isTrue(token.length > 0)

    // Vérifier que le token peut être décodé
    const secret = env.get('JWT_SECRET')
    const decoded = jwt.verify(token, secret) as any
    
    assert.equal(decoded.userId, 'user-123')
    assert.equal(decoded.email, 'test@example.com')
  })

  test('should verify valid JWT token', async ({ assert }) => {
    const payload = {
      userId: 'user-123',
      email: 'test@example.com',
      telephone: '+2438123456789'
    }

    const secret = env.get('JWT_SECRET')
    const token = jwt.sign(payload, secret, { expiresIn: '1h' })

    const result = AuthService.verifyJwtToken(token)
    
    assert.isNotNull(result)
    assert.equal(result!.userId, 'user-123')
    assert.equal(result!.email, 'test@example.com')
  })

  test('should return null for invalid JWT token', async ({ assert }) => {
    const invalidToken = 'invalid.jwt.token'
    
    const result = AuthService.verifyJwtToken(invalidToken)
    
    assert.isNull(result)
  })

  test('should return null for expired JWT token', async ({ assert }) => {
    const payload = {
      userId: 'user-123',
      email: 'test@example.com',
      telephone: '+2438123456789'
    }

    const secret = env.get('JWT_SECRET')
    const expiredToken = jwt.sign(payload, secret, { expiresIn: '-1h' }) // Déjà expiré

    const result = AuthService.verifyJwtToken(expiredToken)
    
    assert.isNull(result)
  })
})
