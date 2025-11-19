import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['academic', 'sports', 'technical', 'cultural', 'other'],
    },
    level: {
      type: String,
      required: true,
      enum: ['college', 'university', 'state', 'national', 'international'],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    department: {
      type: String,
      required: true,
      index: true,
    },
    proofDocument: {
      type: String, // URL to the uploaded document
    },
    status: {
      type: String,
      enum: ['pending', 'counsellor_approved', 'counsellor_rejected', 'admin_approved', 'admin_rejected'],
      default: 'pending',
      index: true,
    },
    counsellorApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    counsellorApprovedAt: {
      type: Date,
    },
    counsellorRejectionReason: {
      type: String,
    },
    adminApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    adminApprovedAt: {
      type: Date,
    },
    adminRejectionReason: {
      type: String,
    },
    qrCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      enum: ['Participant', 'Bronze', 'Silver', 'Gold'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
achievementSchema.index({ student: 1, createdAt: -1 });
achievementSchema.index({ department: 1, status: 1 });
achievementSchema.index({ category: 1, status: 1 });
achievementSchema.index({ level: 1, status: 1 });

export default mongoose.model('Achievement', achievementSchema);