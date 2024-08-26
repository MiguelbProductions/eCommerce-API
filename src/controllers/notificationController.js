const Notification = require('../models/notificationModel');

const createNotification = async (userId, message) => {
    try {
        const notification = new Notification({
            user: userId,
            message,
        });
        await notification.save();
    } catch (error) {
        console.error('Error creating notification:', error.message);
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notifications', error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to mark this notification as read' });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error marking notification as read', error: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
};