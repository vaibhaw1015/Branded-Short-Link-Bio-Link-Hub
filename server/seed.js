import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';
import { Link } from './src/models/Link.js';
import { ClickEvent } from './src/models/ClickEvent.js';
import { hashIp } from './src/utils/hashIp.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is missing from server/.env');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected successfully.');

    // Clear existing data
    console.log('[Seed] Cleaning old records...');
    await Promise.all([
      User.deleteMany({}),
      Link.deleteMany({}),
      ClickEvent.deleteMany({})
    ]);

    // 1. Create Verified Demo Users
    console.log('[Seed] Creating demo users...');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('Password123!', saltRounds);

    const demoUser = await User.create({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      username: 'alexrivera',
      passwordHash,
      isVerified: true,
      bioProfile: {
        displayName: 'Alex Rivera 🚀',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
        avatarPublicId: 'seed_avatar_alex',
        bio: 'Product Designer & Tech Creator. Sharing deep dives on software architecture, design systems, and frontend performance.',
        theme: 'gradient',
        socialLinks: [
          { label: 'GitHub', url: 'https://github.com', icon: 'github' },
          { label: 'Twitter / X', url: 'https://twitter.com', icon: 'twitter' },
          { label: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
          { label: 'YouTube Channel', url: 'https://youtube.com', icon: 'youtube' }
        ]
      }
    });

    const secondUser = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      username: 'sarahdesigns',
      passwordHash,
      isVerified: true,
      bioProfile: {
        displayName: 'Sarah Chen ✨',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80',
        avatarPublicId: 'seed_avatar_sarah',
        bio: 'Minimalist UI/UX designer crafting clean web experiences and open-source icons.',
        theme: 'dark-slate',
        socialLinks: [
          { label: 'Portfolio', url: 'https://dribbble.com', icon: 'globe' },
          { label: 'Substack', url: 'https://substack.com', icon: 'mail' }
        ]
      }
    });

    // 2. Create Sample Short Links
    console.log('[Seed] Creating sample links...');
    const linkDefinitions = [
      {
        owner: demoUser._id,
        destinationUrl: 'https://github.com/trending',
        shortCode: 'gh-trend',
        title: 'GitHub Trending Repositories',
        isCustomAlias: true
      },
      {
        owner: demoUser._id,
        destinationUrl: 'https://react.dev/blog',
        shortCode: 'react-19',
        title: 'React 19 Official Release Notes',
        isCustomAlias: true
      },
      {
        owner: demoUser._id,
        destinationUrl: 'https://tailwindcss.com/docs',
        shortCode: 'tw-docs',
        title: 'Tailwind CSS Documentation Hub',
        isCustomAlias: true
      },
      {
        owner: demoUser._id,
        destinationUrl: 'https://news.ycombinator.com',
        shortCode: 'k9p2x4',
        title: 'Hacker News Front Page',
        isCustomAlias: false
      },
      {
        owner: demoUser._id,
        destinationUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        shortCode: '7mQ8vR',
        title: 'MDN Web Docs — JavaScript',
        isCustomAlias: false
      }
    ];

    const createdLinks = await Link.insertMany(linkDefinitions);

    // 3. Populate Realistic Click Telemetry across Days, Devices, Referrers
    console.log('[Seed] Generating realistic click telemetry events...');
    const referrers = [
      'twitter.com',
      'linkedin.com',
      'github.com',
      'news.ycombinator.com',
      'reddit.com',
      'Direct',
      'google.com'
    ];
    const devices = ['desktop', 'mobile', 'tablet'];
    const now = Date.now();
    const clickEventsToInsert = [];

    // Spread clicks across the last 14 days
    for (const link of createdLinks) {
      const totalEventsForThisLink = Math.floor(Math.random() * 60) + 40; // 40-100 clicks each
      let recordedCount = 0;

      for (let i = 0; i < totalEventsForThisLink; i++) {
        // Random days ago (0 to 13)
        const daysAgo = Math.floor(Math.random() * 14);
        const hoursOffset = Math.floor(Math.random() * 24);
        const minutesOffset = Math.floor(Math.random() * 60);
        const eventTimestamp = new Date(now - (daysAgo * 86400000 + hoursOffset * 3600000 + minutesOffset * 60000));

        const referrer = referrers[Math.floor(Math.random() * referrers.length)];
        const deviceType = devices[Math.floor(Math.random() * devices.length)];
        const fakeIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

        clickEventsToInsert.push({
          link: link._id,
          timestamp: eventTimestamp,
          referrer,
          deviceType,
          ipHash: hashIp(fakeIp)
        });

        recordedCount++;
      }

      // Update link's denormalized clickCount
      await Link.updateOne({ _id: link._id }, { clickCount: recordedCount });
    }

    await ClickEvent.insertMany(clickEventsToInsert);

    console.log('\n=============================================================');
    console.log('🌱 [DATABASE SEED COMPLETED SUCCESSFULLY]');
    console.log(`Users created: 2`);
    console.log(`  - Login Email: alex@example.com | Password: Password123!`);
    console.log(`  - Username: alexrivera -> Public Bio: http://localhost:5173/bio/alexrivera`);
    console.log(`  - Login Email: sarah@example.com | Password: Password123!`);
    console.log(`  - Username: sarahdesigns -> Public Bio: http://localhost:5173/bio/sarahdesigns`);
    console.log(`Links created: ${createdLinks.length}`);
    console.log(`Click Telemetry Events inserted: ${clickEventsToInsert.length}`);
    console.log('=============================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
