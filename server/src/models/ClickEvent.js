import mongoose from 'mongoose';

const clickEventSchema = new mongoose.Schema({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  referrer: {
    type: String,
    default: 'Direct'
  },
  deviceType: {
    type: String,
    enum: ['mobile', 'desktop', 'tablet', 'unknown'],
    default: 'unknown'
  },
  ipHash: {
    type: String,
    required: true
  }
});

// Compound index for link + timestamp to accelerate time-series aggregation queries
clickEventSchema.index({ link: 1, timestamp: -1 });

export const ClickEvent = mongoose.model('ClickEvent', clickEventSchema);
