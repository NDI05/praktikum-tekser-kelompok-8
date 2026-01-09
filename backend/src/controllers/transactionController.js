const prisma = require('../utils/prisma');

const createTransaction = async (req, res) => {
  try {
    const { items, pelangganId, karyawanId } = req.body;
    
    // Calculate total
    let total_harga = 0;
    const detailData = [];

    for (const item of items) {
      const menu = await prisma.menu.findUnique({ where: { id: item.menuId } });
      if (!menu) throw new Error(`Menu item ${item.menuId} not found`);
      
      const subtotal = menu.harga * item.qty;
      total_harga += subtotal;
      
      detailData.push({
        menuId: item.menuId,
        qty: item.qty,
        subtotal
      });
    }

    const transaction = await prisma.transaksi.create({
      data: {
        total_harga,
        pelangganId: pelangganId ? parseInt(pelangganId) : null,
        karyawanId: parseInt(karyawanId), // Assuming passed from frontend or middleware
        detail: {
          create: detailData
        }
      },
      include: {
        detail: {
          include: { menu: true }
        },
        pelanggan: true,
        karyawan: true
      }
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaksi.findMany({
      include: {
        detail: {
          include: { menu: true }
        },
        pelanggan: true,
        karyawan: true
      },
      orderBy: {
        tgl_transaksi: 'desc'
      }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaksi.findUnique({
      where: { id: parseInt(id) },
      include: {
        detail: {
          include: { menu: true }
        },
        pelanggan: true,
        karyawan: true
      }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTransaction, getTransactions, getTransactionById };
