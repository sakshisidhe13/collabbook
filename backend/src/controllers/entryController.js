const Entry = require("../models/entryModel");
const validator = require("validator");
const User = require("../models/userModel"); 

const createEntry = async (req, res) => {
  const { date, mood, title, content } = req.body;
  const loggedUser = req.user;

  if (!title || !content || !mood)
    return res
      .status(422)
      .json({ message: "Please submit with required fields!" });

  if (!validator.isDate(date)) {
    return res.status(422).json({
      message: "Please provide a valid date!",
    });
  }

  if (title.length > 20) {
    return res.status(422).json({
      message: "Title length should not be more than 20 characters!",
    });
  }

  if (content.length > 1500) {
    return res.status(422).json({
      message: "Content length should not be more than 1500 characters",
    });
  }

  try {
    const saveEntry = await Entry.create({
      createdBy: loggedUser._id,
      date,
      title,
      mood,
      content,
    });

    res.status(201).json({
      message: "Entry added successfully!",
      saveEntry,
    });
  } catch (error) {
    console.error("Error adding entry!: ", error);
    res.status(500).json({
      message: "Something went wrong! Please try again later!",
    });
  }
};

const getEntries = async (req, res) => {
  const loggedUser = req.user;

  try {
   const entries = await Entry.find({
    $or: [
      { createdBy: loggedUser._id },
      { collaborators: loggedUser._id },
    ],
})
  .populate("createdBy", "firstName lastName")
  .sort({ date: -1 });

    res
      .status(200)
      .json({ message: "Entries fetched successfully!", data: entries });
  } catch (error) {
    console.error("Error fetching entries!: ", error);
    res.status(500).json({
      message: "Something went wrong! Please try again later!",
    });
  }
};

const getEntry = async (req, res) => {
  const loggedUser = req.user;
  const entryId = req.params.id;

  try {
    const entry = await Entry.findById(entryId)
    .populate("createdBy", "firstName lastName");

    if (
      !entry ||
      (entry.createdBy.toString() !== loggedUser._id.toString() &&
        !entry.collaborators.includes(loggedUser._id))
    ) {
      return res.status(404).json({
        message: "Entry not found or you don’t have access!",
      });
      }

    res
      .status(200)
      .json({ message: "Entry fetched successfully!", data: entry });
  } catch (error) {
    console.error("Error fetching this entry!: ", error);
    res.status(500).json({
      message: "Something went wrong! Please try again later!",
    });
  }
};

const updateEntry = async (req, res) => {
  const loggedUser = req.user;
  const entryId = req.params.id;
  const { date, title, mood, content } = req.body;

  if (!title || !content || !mood)
    return res
      .status(422)
      .json({ message: "Please submit with required fields!" });

  if (!validator.isDate(date)) {
    return res.status(422).json({
      message: "Please provide a valid date!",
    });
  }

  if (title.length > 20) {
    return res.status(422).json({
      message: "Title length should not be more than 20 characters!",
    });
  }

  if (content.length > 1500) {
    return res.status(422).json({
      message: "Content length should not be more than 1500 characters",
    });
  }

  try {
    const entry = await Entry.findOne({
  _id: entryId,
  $or: [
    { createdBy: loggedUser._id },
    { collaborators: loggedUser._id },
  ],
});

if (!entry) {
  return res.status(404).json({
    message: "Entry not found or not editable by you!",
  });
}

entry.date = date;
entry.title = title;
entry.mood = mood;
entry.content = content;
await entry.save();

res.status(200).json({ message: "Entry updated successfully!", data: entry });
  } catch (error) {
    console.error("Error updating this entry!: ", error);
    res.status(500).json({
      message: "Something went wrong! Please try again later!",
    });
  }
};

const deleteEntry = async (req, res) => {
  const loggedUser = req.user;
  const entryId = req.params.id;

  try {
    const entry = await Entry.findOneAndDelete({
      _id: entryId,
      createdBy: loggedUser._id,
    });

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found or not deleted due to permissions!",
      });
    }

    res
      .status(200)
      .json({ message: "Entry deleted successfully!", data: entry });
  } catch (error) {
    console.error("Error deleting this entry!: ", error);
    res.status(500).json({
      message: "Something went wrong! Please try again later!",
    });
  }
};

const searchEntries = async (req, res) => {
  const loggedUser = req.user;
  const queryText = req.query.text;

  if (!queryText?.trim()) {
    return res.status(400).json({ message: "Search text is required!" });
  }

  if (queryText.length > 100) {
    return res
      .status(422)
      .json({ message: "Search string cannot be exceed 100 charactere!" });
  }

  try {
    const entries = await Entry.find({
      $and: [
        {
          $or: [
            { title: { $regex: queryText, $options: "i" } },
            { content: { $regex: queryText, $options: "i" } },
          ],
        },
        { createdBy: loggedUser._id },
      ],
    }).sort({ date: -1 });

    res.status(200).json({
      message:
        entries.length === 0
          ? "No entries found!"
          : "Entries fetched successfully!",
      data: entries,
    });
  } catch (error) {
    console.error("Error searching the entry!", error);
    res.status(500).json({
      message: "Something went wrong! Please try again later!",
    });
  }
};

const shareEntryWithUser = async (req, res) => {
  const loggedUser = req.user;
  const entryId = req.params.id;
  const { email } = req.body;

  try {
    const entry = await Entry.findById(entryId);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (entry.createdBy.toString() !== loggedUser._id.toString()) {
      return res.status(403).json({ message: "Only the owner can share this entry" });
    }

    const userToShareWith = await User.findOne({ email });

    if (!userToShareWith) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    const userId = userToShareWith._id;

    if (!entry.collaborators.includes(userId)) {
      entry.collaborators.push(userId);
      await entry.save();
    }

    res.status(200).json({ message: "User added as collaborator", entry });
  } catch (error) {
    console.error("Error sharing entry:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  searchEntries,
  shareEntryWithUser,
};
