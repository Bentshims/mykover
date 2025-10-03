import hash from '@adonisjs/core/services/hash'

async function testHash() {
  const plainPassword = 'azerty'
  
  console.log('Test de hashing AdonisJS')
  console.log('========================')
  console.log('Mot de passe en clair:', plainPassword)
  
  // Créer un hash
  const hashed = await hash.make(plainPassword)
  console.log('Hash créé:', hashed)
  
  // Vérifier le hash
  const isValid = await hash.verify(hashed, plainPassword)
  console.log('Vérification du hash:', isValid)
  
  // Test avec un mauvais mot de passe
  const isBad = await hash.verify(hashed, 'wrongpassword')
  console.log('Vérification avec mauvais mdp:', isBad)
}

testHash()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Erreur:', err)
    process.exit(1)
  })


