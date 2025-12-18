const User = require('../models/user.js')
const Expense = require('../models/expense.js')
const { calculateBalances } = require('../util/balanceCalculator.js')


async function getUserBalanceSummary(userId) {

    // Calculate expenses and debts
    const allExpensesFromDatabase = await Expense.find({
        $or: [
            { paidBy: userId },
            { 'splitBetween.user': userId }
        ]
    })
    const allDebtsCalculated = calculateBalances(allExpensesFromDatabase)

    // Filter receipts of owes and owed for this user
    const debtsThatUserOwes = allDebtsCalculated.filter(debt => debt.from === userId)
    const debtsThatUserIsOwed = allDebtsCalculated.filter(debt => debt.to === userId)

    //Calculate total
    const totalYouOwe = parseFloat(debtsThatUserOwes.reduce((sum, debt) => sum + debt.amount, 0))
    const totalOthersOwesYou = parseFloat(debtsThatUserIsOwed.reduce((sum, debt) => sum + debt.amount, 0))
    const nettBalance = parseFloat(totalOthersOwesYou - totalYouOwe)


    const youOwe = []
    for (let debt of debtsThatUserOwes) {
        const person = await User.findById(debt.to).select('name')
        youOwe.push({
            name: person.name,
            amount: parseFloat(debt.amount.toFixed(2))
        })
    }

    const owesYou = []
    for (let debt of debtsThatUserIsOwed) {
        const person = await User.findById(debt.from).select('name')
        owesYou.push({
            name: person.name,
            amount: parseFloat(debt.amount.toFixed(2))
        })
    }
    return {
        totalYouOwe,
        totalOthersOwesYou,
        nettBalance,
        youOwe,
        owesYou,
    }
}

module.exports = { getUserBalanceSummary }