const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Checking Database...\n')
    
    // Check Users
    const users = await prisma.user.findMany()
    console.log('👥 USERS TABLE:')
    console.log(`Total users: ${users.length}`)
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Email: ${user.email}, Name: ${user.name}, Role: ${user.role}`)
    })
    
    // Check Posts
    const posts = await prisma.post.findMany()
    console.log(`\n📝 POSTS TABLE:`)
    console.log(`Total posts: ${posts.length}`)
    posts.forEach(post => {
      console.log(`  - ID: ${post.id}, Title: ${post.title}, Author: ${post.authorId}`)
    })
    
    // Check Comments
    const comments = await prisma.comment.findMany()
    console.log(`\n💬 COMMENTS TABLE:`)
    console.log(`Total comments: ${comments.length}`)
    comments.forEach(comment => {
      console.log(`  - ID: ${comment.id}, Content: ${comment.content.substring(0, 50)}...`)
    })
    
    // Check Security Logs
    const logs = await prisma.securityLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20
    })
    console.log(`\n🔒 SECURITY LOGS:`)
    console.log(`Total logs: ${logs.length}`)
    logs.forEach(log => {
      console.log(`  - [${log.timestamp.toISOString()}] ${log.attackType} - Severity: ${log.severity}`)
      console.log(`    IP: ${log.ipAddress}, Blocked: ${log.blocked}`)
    })
    
    console.log('\n✅ Database check complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
