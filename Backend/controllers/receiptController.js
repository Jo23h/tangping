//import the expense model
const Expense = require("../models/expense");
const { getUserBalanceSummary } = require("../services/balanceSummary");

//function to create new receipts
exports.createReceipt = async (req, res) => {
  try {
    //get the logged in user ID from the JWT token
    const userId = req.user.userId;

    //create a new expense document in mongoDB, contain expense detail and paidby maually put in userid
    const newReceipt = await Expense.create({
      ...req.body,
      paidBy: userId,
    });

    //newly created receipt object as JSON
    return res.status(201).json(newReceipt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// fetch all the receipts, get the user ID
exports.getAllReceipts = async (req, res) => {
  try {
    const userId = req.user.userId;

    //searches mongoDB expense for all receipts that is paid by userID or split between user ID
    const receipts = await Expense.find({
      $or: [{ paidBy: userId }, { "splitBetween.user": userId }],
    })
      .populate("paidBy", "name") //populates data on who paid
      .populate("splitBetween", "name"); //populates data on who you split the receipt with

    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get single receipt by ID
exports.getReceiptById = async (req, res) => {
  try {
    const userId = req.user.userId;

    //from the url params id, in the DB find the name of who paid, who split with users
    const receipt = await Expense.findById(req.params.id)
      .populate("paidBy", "name")
      .populate({
        path: "splitBetween",
        populate: {
          path: "user",
          select: "name",
        },
      });

    //if no receipt return an error
    if (!receipt) {
      return res.status(404).json({ error: "receipt not found" });
    }

    //if you paid for the receipt or splitbetween, you can see the receipt
    const canViewRecipt =
      receipt.paidBy._id.toString() === userId ||
      receipt.splitBetween.some(
        (split) => split.user._id.toString() === userId
      );

    if (!canViewRecipt) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this receipt" });
    }

    res.status(200).json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update receipts, updating amount, description, paidby, splitbetween
exports.updateReceipt = async (req, res) => {
  try {
    //who is updating the receipt, via userID
    const userId = req.user.userId;

    const receipt = await Expense.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    //only the user who paid for the receipt can edit it
    if (receipt.paidBy.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorised to update this receipt" });
    }

    // if im updating the total amount for the receipt, when theres change in amount
    if (req.body.amount && req.body.amount != receipt.amount) {
      const newAmount = req.body.amount; //save the updated amount to new variable
      const numberOfPeople = receipt.splitBetween.length;
      const splitAmount = newAmount / numberOfPeople; //what $ does each person pay

      //update each person split amount with the new total amount /people, multiple users map through each of them
      const updatedSplitBetween = receipt.splitBetween.map((split) => ({
        user: split.user._id || split.user,
        amount: splitAmount,
      }));

      req.body.splitBetween = updatedSplitBetween;
    }

    //replace the old fields with new ones
    const updatedReceipt = await Expense.findByIdAndUpdate(
      req.params.id, //receipt id from the url
      req.body, // data sent by the client
      { new: true, runValidators: true } //new. = true returns the updated receipt, validators: make sure the new data obeys the schema
    )
      .populate("paidBy", "name")
      .populate({
        path: "splitBetween",
        populate: {
          path: "user",
          select: "name",
        },
      });

    res.status(200).json(updatedReceipt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete receipt
exports.deleteReceipt = async (req, res) => {
  try {
    const userId = req.user.userId;

    const receipt = await Expense.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    if (receipt.paidBy.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorised to delete this receipt" });
    }

    //delete the receipt, standard mongoose delete method
    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Receipt deleted succesfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBalanceSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const summary = await getUserBalanceSummary(userId);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
