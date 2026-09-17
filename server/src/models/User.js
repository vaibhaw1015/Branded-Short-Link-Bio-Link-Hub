import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  icon: { type: String, default: 'link' }
}, { _id: false });

const bioProfileSchema = new mongoose.Schema({
  displayName: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  avatarPublicId: { type: String, default: '' },
  bio: { type: String, default: '', maxLength: 500 },
  theme: {
    type: String,
    enum: ['minimal-light', 'dark-slate', 'gradient'],
    default: 'minimal-light'
  },
  socialLinks: [socialLinkSchema]
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  passwordHash: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  verificationTokenExpires: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  refreshTokenVersion: { type: Number, default: 0 },
  bioProfile: {
    type: bioProfileSchema,
    default: () => ({
      displayName: '',
      avatarUrl: '',
      avatarPublicId: '',
      bio: '',
      theme: 'minimal-light',
      socialLinks: []
    })
  }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
