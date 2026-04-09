const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please add MONGODB_URI to .env.local before running seed.");
  process.exit(1);
}
if (process.env.USER_ENV !== 'DEV') {
  console.error("Please add USER_ENV=DEV to .env.local before running seed.");
  process.exit(1);
}

const workoutSchema = new mongoose.Schema({
  title: String,
  description: String,
  mediaUrl: String,
  mediaType: String,
  tier: String,
  categories: [String],
}, { timestamps: true });

const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);

const dummyWorkouts = [
  {
    title: 'Core Stability X',
    description: 'High intensity core burner designed for the elite.',
    mediaUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    mediaType: 'image',
    tier: 'basic',
    categories: ['CORE'],
  },
  {
    title: 'Titan Ascend',
    description: 'Full body strength and power session.',
    mediaUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    mediaType: 'image',
    tier: 'premium',
    categories: ['MIX'],
  },
  {
    title: 'Midnight Pulse',
    description: 'Exclusive after-hours recovery cycle.',
    mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    mediaType: 'image',
    tier: 'premium',
    categories: ['MIX'],
  },
  {
    title: 'Arm Sculptor',
    description: 'Targeted bicep and tricep hypertrophy session.',
    mediaUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
    mediaType: 'image',
    tier: 'basic',
    categories: ['ARMS'],
  },
  {
    title: 'Back Builder',
    description: 'Lats and rhomboids development for a V-taper.',
    mediaUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
    mediaType: 'image',
    tier: 'basic',
    categories: ['BACK'],
  },
  {
    title: 'Leg Engine',
    description: 'Quad and hamstring endurance gauntlet.',
    mediaUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80',
    mediaType: 'image',
    tier: 'basic',
    categories: ['LEGS'],
  },
  {
    title: 'Chest Plate',
    description: 'Pectoral dominance through varied push exercises.',
    mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    mediaType: 'image',
    tier: 'basic',
    categories: ['CHEST'],
  },
  {
    title: 'Aesthetic Architecture',
    description: 'Premium precision focus for all-around conditioning.',
    mediaUrl: 'https://images.unsplash.com/photo-1526506114642-544ab08b2615?w=800&q=80',
    mediaType: 'image',
    tier: 'premium',
    categories: ['MIX', 'CORE'],
  }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB!");
    await Workout.deleteMany({});
    console.log("Cleared existing workouts.");

    await Workout.insertMany(dummyWorkouts);
    console.log("Inserted dummy workouts successfully!");

    mongoose.connection.close();
  } catch (e) {
    console.error("Error seeding DB:", e);
  }
}

seedDB();
