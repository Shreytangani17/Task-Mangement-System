const Courier = require('../models/Courier');

exports.createCourier = async (req, res) => {
  try {
    const courier = new Courier({ ...req.body, receivedBy: req.user.id });
    await courier.save();
    await courier.populate('receivedBy forwardedTo', 'name email');
    res.status(201).json(courier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCouriers = async (req, res) => {
  try {
    const { status, priority, startDate, endDate } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (startDate || endDate) {
      filter.receivedDate = {};
      if (startDate) filter.receivedDate.$gte = new Date(startDate);
      if (endDate) filter.receivedDate.$lte = new Date(endDate);
    }
    const couriers = await Courier.find(filter)
      .populate('receivedBy forwardedTo', 'name email')
      .sort({ receivedDate: -1 });
    res.json(couriers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourierById = async (req, res) => {
  try {
    const courier = await Courier.findById(req.params.id)
      .populate('receivedBy forwardedTo', 'name email');
    if (!courier) return res.status(404).json({ message: 'Courier not found' });
    res.json(courier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCourier = async (req, res) => {
  try {
    const courier = await Courier.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('receivedBy forwardedTo', 'name email');
    if (!courier) return res.status(404).json({ message: 'Courier not found' });
    res.json(courier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCourier = async (req, res) => {
  try {
    const courier = await Courier.findByIdAndDelete(req.params.id);
    if (!courier) return res.status(404).json({ message: 'Courier not found' });
    res.json({ message: 'Courier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourierStats = async (req, res) => {
  try {
    const stats = await Courier.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const total = await Courier.countDocuments();
    res.json({ stats, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
