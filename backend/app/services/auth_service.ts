import jwt from 'jsonwebtoken'
import User from '#models/user'
import type { JwtPayload } from 'jsonwebtoken'

export default class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
  private static readonly JWT_EXPIRES_IN = '7d'

  /**
   * Génère un token JWT pour un utilisateur
   */
  static generateJwtToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000)
    }

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    })
  }

  /**
   * Vérifie et décode un token JWT
   */
  static verifyJwtToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayload
      return decoded
    } catch (error) {
      return null
    }
  }

  /**
   * Récupère un utilisateur à partir d'un token JWT
   */
  static async getUserFromToken(token: string): Promise<User | null> {
    const payload = this.verifyJwtToken(token)
    if (!payload || !payload.userId) {
      return null
    }

    try {
      return await User.find(payload.userId)
    } catch (error) {
      return null
    }
  }

  /**
   * Génère un token de rafraîchissement
   */
  static generateRefreshToken(user: User): string {
    const payload = {
      userId: user.id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000)
    }

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '30d'
    })
  }

  /**
   * Vérifie un token de rafraîchissement
   */
  static verifyRefreshToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayload
      if (decoded.type !== 'refresh') {
        return null
      }
      return decoded
    } catch (error) {
      return null
    }
  }
}
