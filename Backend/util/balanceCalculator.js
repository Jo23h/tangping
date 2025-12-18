
function calculateBalances(expenses) {
    let debts = {};
    let balance = {};

    // part 1
    expenses.forEach(expense => {
        expense.splitBetween.forEach(split => {
            const userId = split.user.toString();

            // who paid
            const amountPaid = (userId === expense.paidBy.toString()) ?expense.amount : 0;
            const share = split.amount;

             // If balance["you123"] exists → use that value
            // If balance["you123"] is undefined → use 0; now key value exists
            balance[userId] = (balance[userId] || 0) + (amountPaid - share)
        })

    });

    // returns array of all keys (userID)
    // part 2
    const allUserIds = Object.keys(balance);

    allUserIds.forEach(userOwes => {

        // who owes money
        if (balance[userOwes] < 0) {

            allUserIds.forEach(toUser => {
                if (balance[toUser] > 0) {

                    const settleAmount = Math.min(
                        Math.abs(balance[userOwes]),
                        Math.abs(balance[toUser])
                    );

                    const debtKey = `${userOwes}-${toUser}`;
                    const oppositeKey = `${toUser}-${userOwes}`;

                    if (debts[oppositeKey]) {
                        debts[oppositeKey] = debts[oppositeKey] - settleAmount;

                        if (debts[oppositeKey] < 0) {
                            debts[debtKey] = Math.abs(debts[oppositeKey]);
                            debts[oppositeKey] = 0;
                        };

                    } else {
                        debts[debtKey] = (debts[debtKey] || 0) + settleAmount;
                    }

                // reset
                    balance[userOwes] = balance[userOwes] + settleAmount;
                    balance[toUser] =  balance[toUser] - settleAmount;
                }
            })
        }
    });

    // part 3
    const outstandingBalance = [];

    for (const key in debts) {
        const [from, to] = key.split('-');
        if (debts[key] > 0) {
            outstandingBalance.push({
                from: from,
                to: to,
                amount: parseFloat(debts[key].toFixed(2))
            })
        }
    }

    return outstandingBalance;


};

module.exports = { calculateBalances };