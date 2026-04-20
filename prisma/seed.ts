import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database…')

  const hash = (pw: string) => bcrypt.hash(pw, 12)

  const [admin, pm, shooter, editor, client] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@crewflow.dev' },
      update: {},
      create: { email: 'admin@crewflow.dev', name: 'Alex Admin', passwordHash: await hash('password123'), globalRole: 'AGENCY_ADMIN' },
    }),
    prisma.user.upsert({
      where: { email: 'pm@crewflow.dev' },
      update: {},
      create: { email: 'pm@crewflow.dev', name: 'Priya Manager', passwordHash: await hash('password123'), globalRole: 'USER' },
    }),
    prisma.user.upsert({
      where: { email: 'shooter@crewflow.dev' },
      update: {},
      create: { email: 'shooter@crewflow.dev', name: 'Sam Shooter', passwordHash: await hash('password123'), globalRole: 'USER' },
    }),
    prisma.user.upsert({
      where: { email: 'editor@crewflow.dev' },
      update: {},
      create: { email: 'editor@crewflow.dev', name: 'Eva Editor', passwordHash: await hash('password123'), globalRole: 'USER' },
    }),
    prisma.user.upsert({
      where: { email: 'client@crewflow.dev' },
      update: {},
      create: { email: 'client@crewflow.dev', name: 'Carlos Client', passwordHash: await hash('password123'), globalRole: 'USER' },
    }),
  ])

  // Create a sample project
  const project = await prisma.project.upsert({
    where: { id: 'seed-project-001' },
    update: {},
    create: {
      id: 'seed-project-001',
      title: 'Q2 Brand Campaign — Acme Corp',
      description: 'A 60-second hero video and 3 social cuts for Acme Corp\'s Q2 product launch.',
      clientName: 'Acme Corp',
      status: 'IN_PRODUCTION',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    },
  })

  // Add members with roles
  const memberData = [
    { userId: pm.id,      role: 'PROJECT_MANAGER' as const },
    { userId: shooter.id, role: 'SHOOTER' as const },
    { userId: editor.id,  role: 'EDITOR' as const },
    { userId: client.id,  role: 'CLIENT' as const },
  ]

  for (const m of memberData) {
    await prisma.projectMember.upsert({
      where: { projectId_userId_role: { projectId: project.id, userId: m.userId, role: m.role } },
      update: {},
      create: { projectId: project.id, ...m },
    })
  }

  // Add sample milestones
  const milestones = [
    { title: 'Script approved', status: 'COMPLETED' as const, sortOrder: 0 },
    { title: 'Location scouting done', status: 'COMPLETED' as const, sortOrder: 1 },
    { title: 'Shoot day 1 — Office scenes', status: 'IN_PROGRESS' as const, sortOrder: 2, assigneeId: shooter.id },
    { title: 'Shoot day 2 — Product closeups', status: 'PENDING' as const, sortOrder: 3, assigneeId: shooter.id },
    { title: 'Rough cut delivered', status: 'PENDING' as const, sortOrder: 4, assigneeId: editor.id },
    { title: 'Client review round 1', status: 'PENDING' as const, sortOrder: 5 },
    { title: 'Final delivery', status: 'PENDING' as const, sortOrder: 6 },
  ]

  for (const m of milestones) {
    await prisma.milestone.upsert({
      where: { id: `seed-milestone-${m.sortOrder}` },
      update: {},
      create: { id: `seed-milestone-${m.sortOrder}`, projectId: project.id, ...m },
    })
  }

  console.log('✅ Seed complete!')
  console.log('')
  console.log('Test accounts (password: password123)')
  console.log('  Admin:   admin@crewflow.dev')
  console.log('  PM:      pm@crewflow.dev')
  console.log('  Shooter: shooter@crewflow.dev')
  console.log('  Editor:  editor@crewflow.dev')
  console.log('  Client:  client@crewflow.dev')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
