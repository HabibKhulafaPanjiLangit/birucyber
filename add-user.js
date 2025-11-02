const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addUser() {
  try {
    console.log('📧 Menambahkan user dengan email asli...\n')
    
    // Prompt untuk input (atau hardcode untuk testing)
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    readline.question('Masukkan email: ', async (email) => {
      readline.question('Masukkan nama: ', async (name) => {
        readline.question('Pilih role (USER/ADMIN/GUEST): ', async (role) => {
          
          const newUser = await prisma.user.create({
            data: {
              email: email,
              name: name,
              role: role.toUpperCase() || 'USER'
            }
          })
          
          console.log('\n✅ User berhasil ditambahkan!')
          console.log('📋 Detail:')
          console.log(`   ID: ${newUser.id}`)
          console.log(`   Email: ${newUser.email}`)
          console.log(`   Name: ${newUser.name}`)
          console.log(`   Role: ${newUser.role}`)
          console.log(`   Created: ${newUser.createdAt}`)
          
          await prisma.$disconnect()
          readline.close()
          process.exit(0)
        })
      })
    })
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

// Jika ingin langsung tambah tanpa prompt:
async function addUserDirect(email, name, role = 'USER') {
  try {
    const newUser = await prisma.user.create({
      data: { email, name, role }
    })
    
    console.log('✅ User berhasil ditambahkan!')
    console.log(JSON.stringify(newUser, null, 2))
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error:', error.message)
    await prisma.$disconnect()
  }
}

// Uncomment untuk mode direct (ganti dengan email Anda):
// addUserDirect('your-email@gmail.com', 'Your Name', 'USER')

// Mode interactive:
addUser()
