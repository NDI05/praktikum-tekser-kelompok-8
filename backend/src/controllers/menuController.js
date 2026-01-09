const prisma = require('../utils/prisma');
const path = require('path');

const getAllMenu = async (req, res) => {
  try {
    const { jenis } = req.query;
    const where = { isAvailable: true };
    
    if (jenis) {
      where.jenis = jenis;
    }

    const menu = await prisma.menu.findMany({
      where
    });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMenu = async (req, res) => {
  try {
    const { nama, jenis, harga, deskripsi } = req.body;
    let gambar = req.body.gambar;

    if (req.file) {
      // Always use local storage - works with Docker volume mount
      gambar = `/uploads/${req.file.filename}`;
    }

    const menu = await prisma.menu.create({
      data: {
        nama,
        jenis,
        harga: parseFloat(harga),
        deskripsi,
        gambar
      }
    });
    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, jenis, harga, deskripsi, isAvailable } = req.body;
    let gambar = req.body.gambar;

    if (req.file) {
      // Always use local storage - works with Docker volume mount
      gambar = `/uploads/${req.file.filename}`;
    }

    const menu = await prisma.menu.update({
      where: { id: parseInt(id) },
      data: {
        nama,
        jenis,
        harga: harga ? parseFloat(harga) : undefined,
        deskripsi,
        gambar,
        isAvailable: isAvailable === 'true' || isAvailable === true ? true : (isAvailable === 'false' || isAvailable === false ? false : undefined)
      }
    });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.menu.update({
      where: { id: parseInt(id) },
      data: { isAvailable: false }
    });
    res.json({ message: 'Menu deleted (soft delete) successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllMenu, createMenu, updateMenu, deleteMenu };
