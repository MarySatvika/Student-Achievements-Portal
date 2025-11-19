import Achievement from '../models/Achievement.js';
import User from '../models/User.js';

// @desc    Verify achievement by QR code
// @route   GET /api/verify/:qrCode
// @access  Public
const verifyAchievement = async (req, res) => {
  try {
    const { qrCode } = req.params;
    
    if (!qrCode) {
      return res.status(400).json({ message: 'QR code is required' });
    }
    
    // Find achievement by QR code
    const achievement = await Achievement.findOne({ qrCode })
      .populate('student', 'name studentId department section')
      .populate('adminApprovedBy', 'name');
    
    if (!achievement) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    // Check if achievement is approved
    if (achievement.status !== 'admin_approved') {
      return res.status(400).json({ message: 'Certificate is not approved' });
    }
    
    // Return verification details
    res.json({
      verified: true,
      message: '✅ This certificate is verified by Vignan University',
      achievement: {
        title: achievement.title,
        description: achievement.description,
        date: achievement.date,
        category: achievement.category,
        level: achievement.level,
        student: {
          name: achievement.student.name,
          studentId: achievement.student.studentId,
          department: achievement.student.department,
          section: achievement.student.section
        },
        verifiedBy: achievement.adminApprovedBy ? achievement.adminApprovedBy.name : 'Unknown',
        verifiedAt: achievement.adminApprovedAt,
        qrCode: achievement.qrCode
      }
    });
  } catch (error) {
    console.error('Error verifying achievement:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get QR code for achievement
// @route   GET /api/achievements/:id/qr-code
// @access  Private (Student/Counsellor/Admin)
const getAchievementQRCode = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    
    // Check if user has permission to view this achievement
    if (req.user.role === 'student' && achievement.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this achievement' });
    }
    
    if (!achievement.qrCode) {
      return res.status(404).json({ message: 'QR code not available for this achievement' });
    }
    
    res.json({ qrCode: achievement.qrCode });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    res.status(500).json({ message: error.message });
  }
};

export {
  verifyAchievement,
  getAchievementQRCode
};