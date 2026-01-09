const prisma = require('../utils/prisma');

const submitFeedback = async (req, res) => {
  try {
    const { transactionId, rating, komentar } = req.body;
    
    const feedback = await prisma.feedback.create({
      data: {
        transaksiId: parseInt(transactionId),
        rating: parseInt(rating),
        komentar
      }
    });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedback = await prisma.feedback.findMany({
      include: {
        transaksi: {
          include: {
            pelanggan: true,
            karyawan: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { submitFeedback, getFeedback };
