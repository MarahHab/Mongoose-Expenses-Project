const mongoose = require('mongoose')

// const moment = require('moment'); 
const Schema = mongoose.Schema
const expenses = require('../../expenses')

mongoose.connect("mongodb://127.0.0.1:27017/expensesDB", {
  useNewUrlParser: true,
}).catch((err) => console.log(err)).catch((err) => console.log(err))


const expenseSchema = new Schema({
    item: String,
    amount: Number,
    date: Date,
    group: String,
})

const Expense = mongoose.model("expense", expenseSchema)

expenses.forEach(element => {
  const expense = new Expense(element)
  expense.save()
  
});

module.exports = Expense