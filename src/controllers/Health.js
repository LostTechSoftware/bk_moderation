const logs = require("../logs");
const Story = require("../models/story");

async function Health(req, res) {
  try {
    await Story.findOne();

    return res.status(200).json("Okay");
  } catch (error) {
    logs.error(error);

    return res.status(400).json("Error");
  }
}

module.exports = Health;
