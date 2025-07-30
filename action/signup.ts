'use server';

import  prisma  from '@/db';
import { redirect } from 'next/navigation';

export async function registerUser(
  prevState: any, // optional state if needed
  formData: FormData
) {
  const Email = formData.get('email')?.toString().trim().toLowerCase();
  const Password = formData.get('password')?.toString();

  if (!Email || !Password) {
    return { message: 'Missing credentials' };
  }

  const userExists = await prisma.users.findUnique({ where: { Email } });
  if (userExists) {
    return { message: 'User already exists' };
  }

  await prisma.users.create({ data: { Email, Password } }); 
  redirect('/signup'); 
}
