const Contact = require("../models/contact.model");

// ➕ Add contact
const addContact = async (req, res) => {
  try {
    const { userId, contactId } = req.body;

    const exists = await Contact.findOne({
      user: userId,
      contact: contactId
    });

    if (exists) {
      return res.status(400).json({ message: "Already added" });
    }

    const contact = await Contact.create({
      user: userId,
      contact: contactId
    });

    res.json(contact);

  } catch (error) {
    res.status(500).json({ message: "Error adding contact" });
  }
};

// 📋 Get contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.params.userId })
      .populate("contact", "username phone");

    res.json(contacts);

  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts" });
  }
};

module.exports = { addContact, getContacts };