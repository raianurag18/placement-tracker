#!/usr/bin/env node
/**
 * Idempotent development database bootstrap for Cloud Agents.
 * Creates BIT Mesra tenant, dev users, placements, experiences, and sample jobs.
 */
const path = require('path');

const backendDir = path.join(__dirname, '../backend');
require(path.join(backendDir, 'node_modules/dotenv')).config({ path: path.join(backendDir, '.env') });
const mongoose = require(path.join(backendDir, 'node_modules/mongoose'));
const bcrypt = require(path.join(backendDir, 'node_modules/bcryptjs'));

const Institute = require(path.join(backendDir, 'models/Institute'));
const User = require(path.join(backendDir, 'models/User'));
const Placement = require(path.join(backendDir, 'models/Placement'));
const Experience = require(path.join(backendDir, 'models/Experience'));
const placementsData = require(path.join(backendDir, 'data/placements.json'));
const experiencesData = require(path.join(backendDir, 'data/experiences.json'));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const STUDENT_PASSWORD = process.env.STUDENT_PASSWORD || process.env.SEED_STUDENT_PASSWORD || 'student123';

async function ensureBitMesra() {
  let institute = await Institute.findOne({ slug: 'bitmesra' });
  if (!institute) {
    institute = await Institute.create({
      name: 'BIT Mesra',
      city: 'Ranchi',
      slug: 'bitmesra',
      isActive: true,
    });
    console.log('Created BIT Mesra institute');
  } else {
    console.log('BIT Mesra institute already exists');
  }
  return institute;
}

async function ensureUser({ email, name, role, instituteId, extra = {} }) {
  const password = role === 'admin' ? ADMIN_PASSWORD : STUDENT_PASSWORD;
  let user = await User.findOne({ email, institute: instituteId });
  if (!user) {
    user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      institute: instituteId,
      ...extra,
    });
    console.log(`Created ${role}: ${email}`);
  } else {
    console.log(`${role} already exists: ${email}`);
  }
  return user;
}

async function seedPlacements(instituteId) {
  const count = await Placement.countDocuments({ institute: instituteId });
  if (count > 0) {
    console.log(`Placements already seeded (${count} records)`);
    return;
  }

  const placements = placementsData.map((record) => ({
    ...record,
    institute: instituteId,
  }));
  await Placement.insertMany(placements);
  console.log(`Seeded ${placements.length} placements`);
}

async function seedExperiences(instituteId) {
  const count = await Experience.countDocuments({ institute: instituteId });
  if (count > 0) {
    console.log(`Experiences already seeded (${count} records)`);
    return;
  }

  const experiences = experiencesData.map((record) => ({
    ...record,
    approved: true,
    institute: instituteId,
  }));
  await Experience.insertMany(experiences);
  console.log(`Seeded ${experiences.length} experiences`);
}

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_tracker';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const institute = await ensureBitMesra();

  await ensureUser({
    email: 'admin@bitmesra.edu',
    name: 'BIT Mesra Admin',
    role: 'admin',
    instituteId: institute._id,
  });

  await ensureUser({
    email: 'student@bitmesra.edu',
    name: 'BIT Mesra Student',
    role: 'student',
    instituteId: institute._id,
    extra: { branch: 'Computer Science', cgpa: 8.5 },
  });

  await seedPlacements(institute._id);
  await seedExperiences(institute._id);

  await mongoose.disconnect();
  console.log('Development database bootstrap complete');
}

main().catch((error) => {
  console.error('Bootstrap failed:', error);
  process.exit(1);
});
