#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎂 Birthday Wish Wall - Setup Script');
console.log('=====================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local already exists');
} else {
  console.log('❌ .env.local not found');
  console.log('Please create .env.local with your Supabase credentials');
  console.log('You can copy from .env.example as a template\n');
}

// Check if Prisma client is generated
const prismaClientPath = path.join(process.cwd(), 'node_modules', '@prisma', 'client');
if (fs.existsSync(prismaClientPath)) {
  console.log('✅ Prisma client is generated');
} else {
  console.log('❌ Prisma client not found');
  console.log('Run: npx prisma generate\n');
}

// Check if database is set up
console.log('\n📋 Next Steps:');
console.log('1. Set up your Supabase project at https://supabase.com');
console.log('2. Copy your project URL and keys to .env.local');
console.log('3. Run: npx prisma db push (or npx prisma migrate dev)');
console.log('4. Run: npm run dev');
console.log('5. Open http://localhost:3000');

console.log('\n🎉 Happy coding!');
