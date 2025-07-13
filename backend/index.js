require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const Admin = require('./models/Admin');
const User = require('./models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('./config/passport');

const authRoutes = require('./routes/auth');
const placementRoutes = require('./routes/placements.js');

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());

app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
})
.then(() => {
  console.log('✅ MongoDB connected');
})
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback",
},
async (accessToken, refreshToken, profile, done) => {
  const newUser = {
    googleId: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
  };

  try {
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      done(null, user);
    } else {
      user = await User.create(newUser);
      done(null, user);
    }
  } catch (err) {
    console.error(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.use('/api/placements', placementRoutes);

app.get('/auth/google', (req, res, next) => {
  console.log('🔄 /auth/google route hit');
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));


app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failure',
    successRedirect: 'http://localhost:3000/', // or your frontend dashboard
  })
);

app.get('/login-failure', (req, res) => {
  res.send('Login Failed');
});

app.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

app.get('/auth/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('http://localhost:3000');
  });
});


// ✅ Define createDummyAdmin function here, just after the connection block
const createDummyAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@college.com' });

if (!existingAdmin) {
  const newAdmin = new Admin({
    email: 'admin@college.com',
    password: 'admin123',
    role: 'admin',
  });

  await newAdmin.save();
  console.log('🟢 Dummy admin created');
}
  } catch (err) {
    console.error('❌ Error creating dummy admin:', err);
  }
};

// Schema and Model
const experienceSchema = new mongoose.Schema({
  name: String,
  company: String,
  role: String,
  package: String,
  experience: String,
  approved: {
    type: Boolean,
    default: false,
  }
});

const Experience = mongoose.model('Experience', experienceSchema);

// POST route
app.post('/api/experience', async (req, res) => {
  try {
    const newExperience = new Experience({ ...req.body, approved: false });
    await newExperience.save();
    res.status(201).json({ message: 'Experience submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit experience' });
  }
});


// ✅ 👇 Add THIS GET Route after the POST route
app.get("/api/experiences", async (req, res) => {
  try {
    const experiences = await Experience.find({ approved: true }).sort({ _id: -1 }); // newest first
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin login route
app.post('/api/admin/login',async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({ success: true, message: 'Admin login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE experience by ID
app.delete('/api/experience/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Experience.findByIdAndDelete(id);
    res.json({ message: 'Experience deleted successfully' });
  } catch (err) {
    console.error('Error deleting experience:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//Pending request for admin
app.get('/api/admin/pending-experiences', async (req, res) => {
  try {
    const pending = await Experience.find({ approved: false }).sort({ _id: -1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Allow admin to approve
app.patch('/api/admin/approve/:id', async (req, res) => {
 try {
    const updated = await Experience.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Approval failed' });
  }
});


// Start server
app.listen(5000, () => {
  console.log('🚀 Server is running on http://localhost:5000');
});
