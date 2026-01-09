const express = require('express');
const { getSalesReport, getDashboardSummary, downloadTransactions, downloadFeedback } = require('../controllers/reportController');

const router = express.Router();

router.get('/sales', getSalesReport);
router.get('/summary', getDashboardSummary);
router.get('/transactions/download', downloadTransactions);
router.get('/feedback/download', downloadFeedback);

module.exports = router;
