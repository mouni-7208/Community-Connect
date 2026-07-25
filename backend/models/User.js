const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['volunteer', 'organizer', 'admin'],
    default: 'volunteer'
  },
  profile: {
    phone: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    skills: [{
      type: String,
      trim: true
    }],
    interests: [{
      type: String,
      trim: true
    }],
    bio: {
      type: String,
      trim: true,
      maxlength: 500
    },
    availability: {
      type: String,
      enum: ['weekdays', 'weekends', 'both', 'flexible'],
      default: 'flexible'
    }
  },
  appliedProjects: [{
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  createdProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
