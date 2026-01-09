const prisma = require('../utils/prisma');

const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.pelanggan.findMany({
      orderBy: { nama: 'asc' }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.pelanggan.findUnique({
      where: { id: parseInt(id) },
      include: { transaksi: true }
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { nama, no_hp, alamat } = req.body;
    const customer = await prisma.pelanggan.create({
      data: { nama, no_hp, alamat }
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, no_hp, alamat } = req.body;
    const customer = await prisma.pelanggan.update({
      where: { id: parseInt(id) },
      data: { nama, no_hp, alamat }
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pelanggan.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
