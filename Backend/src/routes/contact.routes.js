const express = require("express");
const router = express.Router();

const { addContact, getContacts } = require("../controllers/contact.controller");

router.post("/add", addContact);
router.get("/:userId", getContacts);

module.exports = router;