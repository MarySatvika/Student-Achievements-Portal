import Achievement from '../models/Achievement.js';
import User from '../models/User.js';

// ✅ Create a new achievement
export const createAchievement = async (req, res) => {
  try {
    const achievement = new Achievement({
      ...req.body,
      user: req.user._id
    });

    const savedAchievement = await achievement.save();
    res.status(201).json(savedAchievement);
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ message: 'Server error while creating achievement' });
  }
};

// ✅ Get achievements for the logged-in user
export const getMyAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.user._id });
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ message: 'Server error while fetching achievements' });
  }
};

// ✅ Get all achievements (admin/faculty)
export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().populate('user', 'name email');
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching all achievements:', error);
    res.status(500).json({ message: 'Server error while fetching all achievements' });
  }
};

// ✅ Update achievement status (faculty/admin only)
export const updateAchievementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAchievement = await Achievement.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAchievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.json(updatedAchievement);
  } catch (error) {
    console.error('Error updating achievement status:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};

// ✅ Get overall achievement stats (faculty/admin)
export const getAchievementStats = async (req, res) => {
  try {
    const totalAchievements = await Achievement.countDocuments();
    const approvedAchievements = await Achievement.countDocuments({ status: 'approved' });
    const pendingAchievements = await Achievement.countDocuments({ status: 'pending' });

    res.json({
      totalAchievements,
      approvedAchievements,
      pendingAchievements
    });
  } catch (error) {
    console.error('Error fetching achievement stats:', error);
    res.status(500).json({ message: 'Server error while fetching stats' });
  }
};

// ✅ Get per-user achievement stats
export const getUserStats = async (req, res) => {
  try {
    const userStats = await Achievement.aggregate([
      { $group: { _id: '$user', total: { $sum: 1 } } }
    ]);

    res.json(userStats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error while fetching user stats' });
  }
};
