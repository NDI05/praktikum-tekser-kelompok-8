const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.options(/.*/, cors()); // Enable pre-flight for all routes

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('SIKP Oyako Backend is running!');
});

const authRoutes = require('./src/routes/authRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const menuRoutes = require('./src/routes/menuRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/employees', require('./src/routes/employeeRoutes'));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
