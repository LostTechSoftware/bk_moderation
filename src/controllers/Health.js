const { sendLogError } = require("../logs/coralogix");
const Story = require("../models/story");

async function Health(req, res) {
  try {
    await Story.findOne();

    return res.status(200).json("Okay");
  } catch (error) {
    sendLogError({ name: "Health", data: error });

    return res.status(400).json("Error");
  }
}

module.exports = Health;
