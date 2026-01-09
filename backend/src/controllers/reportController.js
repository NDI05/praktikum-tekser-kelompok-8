const prisma = require('../utils/prisma');

const getSalesReport = async (req, res) => {
  try {
    const sales = await prisma.transaksi.groupBy({
      by: ['tgl_transaksi'],
      _sum: {
        total_harga: true
      },
      _count: {
        id: true
      },
      orderBy: {
        tgl_transaksi: 'desc'
      }
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    // Get start of day in Asia/Jakarta (GMT+7)
    const now = new Date();
    const jakartaDateString = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }); // YYYY-MM-DD
    const startOfDay = new Date(`${jakartaDateString}T00:00:00+07:00`);

    const todaySales = await prisma.transaksi.aggregate({
      _sum: { total_harga: true },
      _count: { id: true },
      where: {
        tgl_transaksi: {
          gte: startOfDay
        }
      }
    });

    res.json({
      sales: todaySales._sum.total_harga || 0,
      transactions: todaySales._count.id || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaksi.findMany({
      include: { karyawan: true },
      orderBy: { tgl_transaksi: 'desc' }
    });

    const csvRows = [
      ['ID', 'Date', 'Total', 'Employee', 'Payment Method']
    ];

    transactions.forEach(trx => {
      csvRows.push([
        trx.id,
        new Date(trx.tgl_transaksi).toISOString(),
        trx.total_harga,
        trx.karyawan?.nama || 'N/A',
        trx.metode_pembayaran || 'CASH'
      ]);
    });

    const csvString = csvRows.map(row => row.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csvString);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadFeedback = async (req, res) => {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const csvRows = [
      ['ID', 'Date', 'Rating', 'Comment']
    ];

    feedback.forEach(fb => {
      csvRows.push([
        fb.id,
        new Date(fb.createdAt).toISOString(),
        fb.rating,
        `"${fb.komentar?.replace(/"/g, '""') || ''}"` // Escape quotes
      ]);
    });

    const csvString = csvRows.map(row => row.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=feedback.csv');
    res.send(csvString);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSalesReport, getDashboardSummary, downloadTransactions, downloadFeedback };
