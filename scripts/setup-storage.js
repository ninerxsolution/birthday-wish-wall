#!/usr/bin/env node

console.log('🎂 Birthday Wish Wall - Storage Setup');
console.log('=====================================\n');

console.log('📋 To enable image uploads, you need to:');
console.log('\n1. Go to your Supabase project dashboard');
console.log('2. Navigate to Storage > Buckets');
console.log('3. Create a new bucket called "avatars"');
console.log('4. Set the bucket to "Public" (or configure RLS policies)');
console.log('5. Set the following bucket settings:');
console.log('   - Name: avatars');
console.log('   - Public bucket: Yes');
console.log('   - File size limit: 2MB');
console.log('   - Allowed MIME types: image/*');
console.log('\n6. Optional: Configure CORS if you encounter issues');
console.log('   - Add origin: * (or your domain)');
console.log('   - Methods: GET, POST, PUT, DELETE');
console.log('   - Headers: *');

console.log('\n🔑 Make sure your .env.local has:');
console.log('NEXT_PUBLIC_SUPABASE_URL=your_project_url');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');

console.log('\n✅ After setup, image uploads will work in both:');
console.log('- Submit form (public users)');
console.log('- Admin friends management');

console.log('\n🎉 Happy uploading!');
