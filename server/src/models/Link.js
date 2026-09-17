import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  destinationUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  isCustomAlias: {
    type: Boolean,
    default: false
  },
  clickCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const Link = mongoose.model('Link', linkSchema);
