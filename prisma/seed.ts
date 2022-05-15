import { prisma } from "../lib/prisma";

const JOBS = [
  "Back-end Developer",
  "Front-end Developer",
  "Full-stack Developer",
  "DevOps",
];

const SALARY_RANGE_BY_SENIORITY = {
  Junior: [30000_00, 50000_00],
  Intermediate: [45000_00, 75000_00],
  Senior: [70000_00, 100000_00],
}

async function main() {
  console.info("Creating jobs...");
  const jobs = await Promise.all(
    JOBS.map((name) => {
      return prisma.job.create({
        data: {
          name,
        },
      });
    })
  );

  console.info("Creating employees...");
  const seniorityLevels = Object.keys(SALARY_RANGE_BY_SENIORITY);
  await Promise.all(
    jobs.map((job) => {
      const employeesCount = Math.round(2000 + Math.random() * 10000);

      return prisma.employee.createMany({
        data: new Array(employeesCount).fill(0).map(() => {
          const seniority = seniorityLevels[Math.floor(Math.random() * seniorityLevels.length)];
          const minSalary = SALARY_RANGE_BY_SENIORITY[seniority][0];
          const gapSalary = SALARY_RANGE_BY_SENIORITY[seniority][1] - minSalary;

          return {
            seniority,
            jobId: job.id,
            salary: Math.round(minSalary + Math.random() * gapSalary),
          };
        }),
      });
    })
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
