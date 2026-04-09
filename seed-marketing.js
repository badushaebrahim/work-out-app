const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const BannerAdSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  redirectUrl: String,
  active: Boolean,
});
const BannerAd = mongoose.models.BannerAd || mongoose.model('BannerAd', BannerAdSchema);

const PostSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  content: String,
  imageUrl: String,
  category: String,
  author: String,
  active: Boolean,
});
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

const dummyBanners = [
  {
    title: 'Optimum Nutrition Gold Standard 100% Whey',
    imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80',
    redirectUrl: 'https://optimumnutrition.com',
    active: true,
  },
  {
    title: 'Gymshark Black Friday Sale',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    redirectUrl: 'https://gymshark.com',
    active: true,
  }
];

const dummyPosts = [
  {
    title: '5 Ways to Optimize Muscle Recovery',
    excerpt: 'Discover the elite tactics for accelerating hypertrophy through high-quality sleep protocols and nutrition timings.',
    content: 'Full article content here...',
    category: 'RECOVERY',
    author: 'Coach Marcus',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    active: true,
  },
  {
    title: 'Hypertrophy Deep Dive: The Obsidian Method',
    excerpt: 'We breakdown exactly why the Kinetic Elite programming yields better results in half the time.',
    content: 'Full article content here...',
    category: 'TRAINING',
    author: 'Admin',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    active: true,
  }
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB!");
  if (process.env.USER_ENV !== 'DEV') {
    console.error("Please add USER_ENV=DEV to .env.local before running seed.");
    process.exit(1);
  }

  await BannerAd.deleteMany({});
  await Post.deleteMany({});

  await BannerAd.insertMany(dummyBanners);
  await Post.insertMany(dummyPosts);

  console.log("Inserted Marketing dummy data successfully!");
  process.exit(0);
}

run();
