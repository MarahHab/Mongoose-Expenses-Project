const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');


router.get('/expenses', function (req, res) {
    let query = {};
    const { d1, d2 } = req.query;

    if (d1 && d2) {
        query.date = { $gte: moment(d1, 'YYYY-MM-DD'), $lte: moment(d2, 'YYYY-MM-DD') };
    } else if (d1) {
        query.date = { $gte: moment(d1, 'YYYY-MM-DD'), $lte: moment() };
    }

    Expense.find(query)
        .sort({ date: -1 })
        .then(function (expenses) {
            res.send(expenses);
        })
        .catch(function (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
});

router.post('/expense', async (req, res) => {
    const { item, amount, group, date } = req.body;
    if (date === undefined) {
        date = moment().format('LLLL');
    } else {

        date = moment(date).format('LLLL');
    }
    const ex1 = new Expense({ item, amount, group, date });

    ex1.save()
        .then(function (result) {
            res.send(result);
        })
        .catch(function (error) {
            res.status(500).send({ error: 'An error occurred while saving the expense.' });
        });
});

router.put('/update', function (req, res) {
    const { group1, group2 } = req.body;

    Expense.findOneAndUpdate(
        { group: group1 },
        { group: group2 }).then(() => {
            Expense.findOne({ group: group2 }).then((expense) => {
                res.send(expense)
            })
        })
})

router.get('/expenses/:group/:total', function (req, res) {
    const group  = req.params.group;
    const total  = req.query;

    if (total) {
        Expense.aggregate([
            { $match: { group : group} },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]).then((result) => {
            res.json({ totalAmount: result[0].totalAmount });
        });
    } else {
        Expense.find({ group }).then((expenses) => {
            res.json(expenses);
        });
    }
});

module.exports = router;