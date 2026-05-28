// ─── Script para migrar imágenes locales a Cloudinary ───
// Uso: node scripts/migrate-images.js
const dns = require('dns');
dns.setServers(['10.239.246.135', '8.8.8.8', '1.1.1.1']);

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const Post = require('../models/Post');
  const posts = await Post.find({ image: /^\/uploads\// });
  console.log(`Found ${posts.length} posts with local images`);

  for (const post of posts) {
    const filename = post.image.replace('/uploads/', '');
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP ${post._id}: file not found (${filename})`);
      continue;
    }

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'ticos/posts',
        public_id: filename.replace(/\.[^.]+$/, ''),
      });
      post.image = result.secure_url;
      await post.save();
      console.log(`  OK ${post._id}: ${result.secure_url}`);
      fs.unlinkSync(filePath);
    } catch (e) {
      console.log(`  FAIL ${post._id}: ${e.message}`);
    }
  }

  await mongoose.disconnect();
  console.log('Done!');
}

migrate().catch(console.error);
