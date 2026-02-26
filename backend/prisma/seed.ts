import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ── Departments ──────────────────────────────────────────
  const deptCS = await prisma.department.upsert({
    where: { name: 'Computer Science' },
    update: {},
    create: { name: 'Computer Science', description: 'Department of Computer Science & Information Technology' },
  });

  const deptPhysics = await prisma.department.upsert({
    where: { name: 'Physics' },
    update: {},
    create: { name: 'Physics', description: 'Department of Physics' },
  });

  const deptBiology = await prisma.department.upsert({
    where: { name: 'Biology' },
    update: {},
    create: { name: 'Biology', description: 'Department of Biology & Life Sciences' },
  });

  await prisma.department.upsert({
    where: { name: 'Mathematics' },
    update: {},
    create: { name: 'Mathematics', description: 'Department of Mathematics' },
  });

  console.log('✅ Departments created');

  // ── Specialités ──────────────────────────────────────────
  const specISI = await prisma.specialite.create({
    data: { name: 'ISI', description: 'Ingénierie des Systèmes Informatiques', departmentId: deptCS.id },
  }).catch(() => prisma.specialite.findFirst({ where: { name: 'ISI' } }));

  const specSIC = await prisma.specialite.create({
    data: { name: 'SIC', description: 'Systèmes Informatiques et Communication', departmentId: deptCS.id },
  }).catch(() => prisma.specialite.findFirst({ where: { name: 'SIC' } }));

  const specPhysFond = await prisma.specialite.create({
    data: { name: 'Physique Fondamentale', description: 'Physique Fondamentale', departmentId: deptPhysics.id },
  }).catch(() => prisma.specialite.findFirst({ where: { name: 'Physique Fondamentale' } }));

  const specBioMol = await prisma.specialite.create({
    data: { name: 'Biologie Moléculaire', description: 'Biologie Moléculaire', departmentId: deptBiology.id },
  }).catch(() => prisma.specialite.findFirst({ where: { name: 'Biologie Moléculaire' } }));

  console.log('✅ Specialités created');

  // ── Helper: create user ──────────────────────────────────
  const password = await bcrypt.hash('Test@1234', 10);

  async function createUser(data: {
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    emailVerified?: boolean;
    studentData?: { departmentId: string; specialiteId?: string };
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      console.log(`  ⏭️  ${data.email} already exists`);
      return existing;
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        emailVerified: data.emailVerified ?? true,
        ...(data.studentData
          ? {
              student: {
                create: {
                  departmentId: data.studentData.departmentId,
                  specialiteId: data.studentData.specialiteId,
                },
              },
            }
          : {}),
      },
    });
    console.log(`  ✅ ${data.role.padEnd(20)} ${data.email}`);
    return user;
  }

  // ── Users ────────────────────────────────────────────────
  console.log('\n👤 Creating users (password for all: Test@1234)\n');

  // Super Admin
  await createUser({
    email: 'admin@univ-tiaret.dz',
    firstName: 'Admin',
    lastName: 'Super',
    role: 'ADMIN_SUPER',
  });

  // Faculty Admin
  await createUser({
    email: 'faculty@univ-tiaret.dz',
    firstName: 'Karim',
    lastName: 'Bouzid',
    role: 'ADMIN_FACULTY',
  });

  // Department Chief
  await createUser({
    email: 'chef.cs@univ-tiaret.dz',
    firstName: 'Mohamed',
    lastName: 'Hamdani',
    role: 'DEPARTEMENT_CHEF',
  });

  // Speciality Chief
  await createUser({
    email: 'chef.isi@univ-tiaret.dz',
    firstName: 'Amina',
    lastName: 'Berkane',
    role: 'SPECIALITE_CHEF',
  });

  // Teachers
  await createUser({
    email: 'teacher@univ-tiaret.dz',
    firstName: 'Youcef',
    lastName: 'Benali',
    role: 'TEACHER',
  });

  await createUser({
    email: 'teacher2@univ-tiaret.dz',
    firstName: 'Nadia',
    lastName: 'Mebarki',
    role: 'TEACHER',
  });

  // Students
  await createUser({
    email: 'student@univ-tiaret.dz',
    firstName: 'Amira',
    lastName: 'Bensalem',
    role: 'STUDENT',
    studentData: { departmentId: deptCS.id, specialiteId: specISI!.id },
  });

  await createUser({
    email: 'student2@univ-tiaret.dz',
    firstName: 'Yacine',
    lastName: 'Mehdaoui',
    role: 'STUDENT',
    studentData: { departmentId: deptCS.id, specialiteId: specSIC!.id },
  });

  await createUser({
    email: 'student3@univ-tiaret.dz',
    firstName: 'Fatima',
    lastName: 'Zerhouni',
    role: 'STUDENT',
    studentData: { departmentId: deptPhysics.id, specialiteId: specPhysFond!.id },
  });

  // Delegate
  await createUser({
    email: 'delegate@univ-tiaret.dz',
    firstName: 'Sara',
    lastName: 'Djeraba',
    role: 'DELEGATE',
    studentData: { departmentId: deptBiology.id, specialiteId: specBioMol!.id },
  });

  // Committee
  await createUser({
    email: 'committee@univ-tiaret.dz',
    firstName: 'Rachid',
    lastName: 'Touati',
    role: 'COMMITTEE_PRESIDENT',
  });

  console.log('\n🎉 Seeding complete!\n');
  console.log('────────────────────────────────────────────');
  console.log('  📧 Login credentials (all accounts):');
  console.log('  Password: Test@1234');
  console.log('');
  console.log('  admin@univ-tiaret.dz       (Super Admin)');
  console.log('  teacher@univ-tiaret.dz     (Teacher)');
  console.log('  student@univ-tiaret.dz     (Student)');
  console.log('  chef.cs@univ-tiaret.dz     (Dept Chief)');
  console.log('  delegate@univ-tiaret.dz    (Delegate)');
  console.log('────────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
