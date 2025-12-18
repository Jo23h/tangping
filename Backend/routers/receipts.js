const express = require("express");
const router = express.Router();
const {
  createReceipt,
  getAllReceipts,
  // getAllReceiptsDebug,
  getReceiptById,
  updateReceipt,
  deleteReceipt,
  getBalanceSummary
} = require("../controllers/receiptController");
const verifyToken = require('../middleware/verifyToken')

//get all receipts
router.get("/", verifyToken, getAllReceipts);

// //DEBUG: get ALL receipts (no user filter)
// router.get("/debug/all", verifyToken, getAllReceiptsDebug);

//create receipt
router.post("/", verifyToken, createReceipt);

router.get('/balance', verifyToken, getBalanceSummary)

//get single receipt y ID
router.get("/:id", verifyToken, getReceiptById);

//update receipt details
router.put("/:id", verifyToken, updateReceipt);

//delete receipt
router.delete("/:id", verifyToken, deleteReceipt);


module.exports = router;
