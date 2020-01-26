import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.vars.userId, provider: true },
    });
    if (!checkUserProvider) {
      res.status(401).json({ error: 'User is not a provider.' });
    }

    const notifications = await Notification.find({
      user: req.vars.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
      },
      {
        new: true, // Returns the new updated record
      }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
