import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Achievement from '../models/Achievement.js';

// @desc    Get notifications for a user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email');
    
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create notification for counsellor when student submits form
// @route   POST /api/notifications/student-submission
// @access  Private (called internally)
const createStudentSubmissionNotification = async (student, achievement, counsellor) => {
  try {
    const message = `Student ${student.name} from Section ${student.studentSection} has submitted a new achievement form: "${achievement.title}"`;
    
    const notification = new Notification({
      recipient: counsellor._id,
      sender: student._id,
      type: 'form_submission',
      message,
      relatedForm: achievement._id
    });
    
    await notification.save();
    console.log('Notification created for counsellor:', notification._id);
    
    // Email notifications removed - no email service
  } catch (error) {
    console.error('Error creating student submission notification:', error);
  }
};

// @desc    Create notification for admin when counsellor approves/rejects form
// @route   POST /api/notifications/counsellor-action
// @access  Private (called internally)
const createCounsellorActionNotification = async (counsellor, achievement, admin, action) => {
  try {
    const actionText = action === 'approve' ? 'approved' : 'rejected';
    const message = `Counsellor ${counsellor.name} has ${actionText} an achievement form: "${achievement.title}"`;
    
    const notification = new Notification({
      recipient: admin._id,
      sender: counsellor._id,
      type: action === 'approve' ? 'form_approved' : 'form_rejected',
      message,
      relatedForm: achievement._id
    });
    
    await notification.save();
    console.log('Notification created for admin:', notification._id);
  } catch (error) {
    console.error('Error creating counsellor action notification:', error);
  }
};

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });
    
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create notification for student when achievement is approved
// @route   POST /api/notifications/student-approval
// @access  Private (called internally)
const createStudentApprovalNotification = async (student, achievement, counsellor) => {
  try {
    const message = `Congratulations! Your achievement "${achievement.title}" has been approved by ${counsellor.name}.`;
    
    const notification = new Notification({
      recipient: student._id,
      sender: counsellor._id,
      type: 'achievement_approved',
      message,
      relatedForm: achievement._id
    });
    
    await notification.save();
    console.log('Notification created for student:', notification._id);
    
    // Email notifications removed - no email service
  } catch (error) {
    console.error('Error creating student approval notification:', error);
  }
};

export {
  getNotifications,
  markAsRead,
  createStudentSubmissionNotification,
  createCounsellorActionNotification,
  createStudentApprovalNotification,
  getUnreadCount
};