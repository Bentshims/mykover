import { test } from '@japa/runner'
import { ApiClient } from '@japa/api-client'

test.group('Auth functional tests', (group) => {
  let client: ApiClient

  group.setup(async () => {
    client = new ApiClient('http://localhost:3333')
  })

  test('should register a new user', async ({ assert }) => {
    const userData = {
      fullname: 'Jean Dupont',
      phone: '+2438123456789',
      email: 'jean.dupont@example.com',
      birth_date: '1995-05-15',
      password: 'motdepasse123'
    }

    const response = await client.post('/api/auth/register').json(userData)
    
    response.assertStatus(201)
    assert.isTrue(response.body().success)
    assert.equal(response.body().data.user.fullname, 'Jean Dupont')
    assert.exists(response.body().data.token)
  })

  test('should login with email', async ({ assert }) => {
    const loginData = {
      identifier: 'jean.dupont@example.com',
      password: 'motdepasse123'
    }

    const response = await client.post('/api/auth/login').json(loginData)
    
    response.assertStatus(200)
    assert.isTrue(response.body().success)
    assert.exists(response.body().data.token)
  })

  test('should login with phone', async ({ assert }) => {
    const loginData = {
      identifier: '+2438123456789',
      password: 'motdepasse123'
    }

    const response = await client.post('/api/auth/login').json(loginData)
    
    response.assertStatus(200)
    assert.isTrue(response.body().success)
    assert.exists(response.body().data.token)
  })

  test('should fail login with wrong credentials', async ({ assert }) => {
    const loginData = {
      identifier: 'jean.dupont@example.com',
      password: 'wrongpassword'
    }

    const response = await client.post('/api/auth/login').json(loginData)
    
    response.assertStatus(401)
    assert.isFalse(response.body().success)
  })

  test('should request password reset', async ({ assert }) => {
    const resetData = {
      identifier: 'jean.dupont@example.com'
    }

    const response = await client.post('/api/auth/forgot').json(resetData)
    
    response.assertStatus(200)
    assert.isTrue(response.body().success)
  })

  test('should validate phone number format', async ({ assert }) => {
    const userData = {
      fullname: 'Test User',
      phone: '+1234567890', // Format incorrect pour RDC
      email: 'test@example.com',
      birth_date: '1995-05-15',
      password: 'motdepasse123'
    }

    const response = await client.post('/api/auth/register').json(userData)
    
    response.assertStatus(400)
    assert.isFalse(response.body().success)
  })

  test('should access protected route with token', async ({ assert }) => {
    // D'abord s'inscrire
    const userData = {
      fullname: 'Test Protected',
      phone: '+2439123456789',
      email: 'protected@example.com',
      birth_date: '1995-05-15',
      password: 'motdepasse123'
    }

    const registerResponse = await client.post('/api/auth/register').json(userData)
    const token = registerResponse.body().data.token

    // Accéder à la route protégée
    const response = await client
      .get('/api/auth/me')
      .header('Authorization', `Bearer ${token}`)
    
    response.assertStatus(200)
    assert.isTrue(response.body().success)
    assert.equal(response.body().data.user.email, 'protected@example.com')
  })

  test('should fail to access protected route without token', async ({ assert }) => {
    const response = await client.get('/api/auth/me')
    
    response.assertStatus(401)
    assert.isFalse(response.body().success)
  })
})
