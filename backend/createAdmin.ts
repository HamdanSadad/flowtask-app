import prisma from './src/prismaClient';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'adminhamdan07@gmail.com';
  const password = 'myadmin123';
  const name = 'Admin Hamdan';

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log('User already exists. Updating role to ADMIN...');
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log('Role updated to ADMIN.');
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
      provider: 'local',
      role: 'ADMIN',
    },
  });

  console.log(`Admin user created successfully with ID: ${user.id}`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
