const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/finance_tracker', { useNewUrlParser: true, useUnifiedTopology: true });

const Income = mongoose.model('Income', {
  name: String,
  amount: Number,
  type: String,
  date: Date
});

app.post('/api/incomes', async (req, res) => {
  const income = new Income(req.body);
  await income.save();
  res.status(201).send(income);
});

app.get('/api/incomes', async (req, res) => {
  const incomes = await Income.find().sort('-date').limit(10);
  res.send(incomes);
});

app.get('/api/report', async (req, res) => {
  const { type, from, to } = req.query;
  const startDate = new Date(from);
  const endDate = new Date(to);

  let aggregation;
  if (type === 'date') {
    aggregation = [
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, total: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ];
  } else if (type === 'type') {
    aggregation = [
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ];
  } else if (type === 'name') {
    aggregation = [
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$name", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ];
  }

  const report = await Income.aggregate(aggregation);
  res.send(report.map(item => ({ name: item._id, total: item.total })));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));