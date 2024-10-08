const express = require('express');
const incomeRoutes = require('./routes/incomeRoutes');

const app = express();

app.use(express.json());
app.use('/api/incomes', incomeRoutes);

// ... resto de tu configuración de Express

module.exports = app;