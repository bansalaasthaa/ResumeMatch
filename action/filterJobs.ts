'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function filterJobs(skills: string[], experience: string) {
  console.log(skills)
  const matchedJobs = await prisma.jobs.findMany({
    where: {
      skills: {
        some: {
          name: {
            in: skills.map(skill => skill.toLowerCase()),
            mode: 'insensitive' // case-insensitive matching
          }
        }
      },
      ...(experience && {
        Experience: {
          lte: parseInt(experience), 
        }
      })
    },
    include: {
      skills: true
    }
  });

  return matchedJobs;
}
