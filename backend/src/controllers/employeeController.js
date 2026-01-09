const prisma = require('../utils/prisma');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.karyawan.findMany({
      include: { user: { select: { username: true, role: true } } }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { nama, email, noHp, jabatan, username, password } = req.body;
    
    // Auto-generate idKaryawan
    const lastEmployee = await prisma.karyawan.findFirst({
      orderBy: { id: 'desc' }
    });

    let newIdKaryawan = 'KRY001';
    if (lastEmployee && lastEmployee.idKaryawan) {
      const lastIdNum = parseInt(lastEmployee.idKaryawan.replace('KRY', ''));
      if (!isNaN(lastIdNum)) {
        newIdKaryawan = `KRY${String(lastIdNum + 1).padStart(3, '0')}`;
      }
    }

    // Create User first (since Karyawan needs a User)
    // Note: In a real app, you might want to transaction this or handle it differently
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password || 'password123', 10); // Default password if not provided

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'KARYAWAN',
        karyawan: {
          create: {
            nama,
            email,
            noHp,
            jabatan,
            idKaryawan: newIdKaryawan
          }
        }
      },
      include: { karyawan: true }
    });

    res.status(201).json(user.karyawan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, email, noHp, jabatan, idKaryawan } = req.body;

    const employee = await prisma.karyawan.update({
      where: { id: parseInt(id) },
      data: { nama, email, noHp, jabatan, idKaryawan }
    });

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    // Find associated user to delete both
    const employee = await prisma.karyawan.findUnique({ where: { id: parseInt(id) } });
    
    if (employee) {
      await prisma.user.delete({ where: { id: employee.userId } }); // Cascade delete should handle Karyawan, but explicit is safer or relies on schema
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllEmployees, createEmployee, updateEmployee, deleteEmployee };
