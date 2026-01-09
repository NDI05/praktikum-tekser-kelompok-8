const express = require('express');
const router = express.Router();
const { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, authorizeRole(['OWNER']), getAllEmployees);
router.post('/', authenticateToken, authorizeRole(['OWNER']), createEmployee);
router.put('/:id', authenticateToken, authorizeRole(['OWNER']), updateEmployee);
router.delete('/:id', authenticateToken, authorizeRole(['OWNER']), deleteEmployee);

module.exports = router;
