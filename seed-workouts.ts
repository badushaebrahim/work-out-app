import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Workout from './src/models/Workout';

dotenv.config({ path: '.env.local' });

const seedDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('No MONGODB_URI found.');
            return;
        }

        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Emptying old workouts...");
        await Workout.deleteMany({});

        console.log("Seeding new workouts with more categories...");

        const dummyWorkouts = [
            {
                title: 'Training Vault | Core Series',
                description: 'A focused intense series for building core stability and strength.',
                tier: 'basic',
                categories: ['CORE'],
                mediaUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070',
                mediaType: 'image',
                exercises: [
                    {
                        name: 'PLANK HOLD',
                        type: 'Core • Stability',
                        sets: 3,
                        reps: '1 min',
                        rest: '45s',
                        executionSteps: [
                            'Maintain a straight line from heels to head.',
                            'Keep core braced and squeeze glutes.'
                        ],
                        trainerInsight: 'Don\'t let your lower back sag.'
                    }
                ]
            },
            {
                title: 'Training Vault | Elite Power Chest',
                description: 'The ultimate power building series for advanced Buddy athletes.',
                tier: 'premium',
                categories: ['CHEST'],
                mediaUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069',
                mediaType: 'image',
                exercises: [
                    {
                        name: 'FLAT BENCH PRESS',
                        type: 'Compound • Pushing',
                        sets: 4,
                        reps: '8-12',
                        rest: '90s',
                        executionSteps: [
                            'Set bench to a 30-45 degree incline. Retract scapula and maintain a slight arch in lower back.',
                            'Lower weights slowly until they are level with your upper chest, feeling a deep stretch in the pecs.',
                            'Drive the weights upward in a slight arc, focusing on squeezing the chest at the peak.'
                        ],
                        trainerInsight: "Avoid clinking the dumbbells at the top. Stopping just short of vertical keeps the tension strictly on the pectoral fibers rather than the triceps."
                    },
                    {
                        name: 'INCLINE DUMBBELL PRESS',
                        type: 'Upper Pectorals • Hypertrophy',
                        sets: 4,
                        reps: '8-12',
                        rest: '90s',
                        executionSteps: [
                            'Set bench to a 30-45 degree incline.',
                            'Lower weights slowly.',
                            'Drive the weights upward in a slight arc.'
                        ],
                        trainerInsight: "Keep tension strictly on the pectoral fibers."
                    },
                    {
                        name: 'CABLE CROSSOVER',
                        type: 'Isolation • Squeeze',
                        sets: 3,
                        reps: '15',
                        rest: '60s',
                        executionSteps: [
                            'Stand in the middle of the cable machine, grasp handles and step forward.',
                            'With a slight bend in your arms, bring your hands together in a wide arc.'
                        ],
                        trainerInsight: "Keep your chest puffed up exactly like you are hugging a barrel."
                    },
                    {
                        name: 'DIPS (CHEST VERSION)',
                        type: 'Bodyweight • Power',
                        sets: 3,
                        reps: 'Failure',
                        rest: '120s',
                        executionSteps: [
                            'Hop onto dip bars.',
                            'Lean forward to engage chest.',
                            'Lower body until elbows are roughly 90 degrees and press back up.'
                        ],
                        trainerInsight: "Don't lock out elbows at the top."
                    }
                ]
            },
            {
                title: 'Back Annihilation',
                description: 'V-Taper builder.',
                tier: 'basic',
                categories: ['BACK'],
                mediaUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069',
                mediaType: 'image',
                exercises: [
                    {
                        name: 'PULL UPS',
                        type: 'Bodyweight • Vertical Pull',
                        sets: 4,
                        reps: 'Failure',
                        rest: '90s',
                        executionSteps: ['Pull chin over bar', 'Control descent'],
                        trainerInsight: 'Squeeze the lats at the top.'
                    }
                ]
            },
            {
                title: 'Triceps Torch',
                description: 'Horseshoe builder.',
                tier: 'premium',
                categories: ['TRICEPS'],
                mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070',
                mediaType: 'image',
                exercises: [
                    {
                        name: 'TRICEP PUSHDOWN',
                        type: 'Isolation • Push',
                        sets: 4,
                        reps: '12',
                        rest: '60s',
                        executionSteps: ['Keep elbows tucked', 'Extend fully'],
                        trainerInsight: 'Flare outwards at the bottom for peak contraction.'
                    }
                ]
            },
            {
                title: 'Biceps Peak',
                description: 'Arm builder.',
                tier: 'basic',
                categories: ['BICEPS'],
                mediaUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070',
                mediaType: 'image',
                exercises: [
                    {
                        name: 'BARBELL CURL',
                        type: 'Isolation • Pull',
                        sets: 4,
                        reps: '10',
                        rest: '90s',
                        executionSteps: ['Curl weight up', 'Slow eccentric'],
                        trainerInsight: 'Do not swing your back.'
                    }
                ]
            },
            {
                title: 'Quad Father',
                description: 'Tear drop development.',
                tier: 'premium',
                categories: ['LEGS'],
                mediaUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=2074',
                mediaType: 'image',
                exercises: [
                    {
                        name: 'SQUAT',
                        type: 'Compound • Push',
                        sets: 5,
                        reps: '5',
                        rest: '180s',
                        executionSteps: ['Descend below parallel', 'Explode up'],
                        trainerInsight: 'Drive through your heels.'
                    }
                ]
            },
            {
                title: 'Boulder Shoulders',
                description: 'Deltoid development.',
                tier: 'basic',
                categories: ['SHOULDERS'],
                mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070',
                mediaType: 'image',
                exercises: [
                    {
                        name: 'OVERHEAD PRESS',
                        type: 'Compound • Push',
                        sets: 4,
                        reps: '8',
                        rest: '120s',
                        executionSteps: ['Press bar overhead', 'Lockout'],
                        trainerInsight: 'Push head through at the top.'
                    }
                ]
            }
        ];

        await Workout.insertMany(dummyWorkouts);

        console.log("Successfully seeded database with varied workouts.");
        process.exit(0);
    } catch (e) {
        console.error("Error during seeding:", e);
        process.exit(1);
    }
};

seedDB();
