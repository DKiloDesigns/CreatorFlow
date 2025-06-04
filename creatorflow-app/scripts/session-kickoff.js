const { PrismaClient } = require('@prisma/client');

function checkDb(cb) {
  const prisma = new PrismaClient();
  prisma.$queryRaw`SELECT 1`
    .then(() => {
      console.log('Database connection: OK');
      prisma.$disconnect();
      cb(true);
    })
    .catch((err) => {
      console.log('WARNING: Database connection failed:', err.message);
      prisma.$disconnect();
      cb(false);
    });
}

checkServer(running => {
  if (running) {
    console.log('Dev server is running on http://localhost:3001');
  } else {
    console.log('WARNING: Dev server is NOT running on http://localhost:3001');
  }
  checkDb(() => printState());
}); 