const aws = require("aws-sdk");
const mongoose = require("../database");

const s3 = new aws.S3();

const StorySchema = new mongoose.Schema({
  createdAt: {
    default: Date.now,
    type: Date,
  },
  image: String,
  imageKey: String,
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
  },
  type: {
    type: String,
    default: "image",
  },
  finish: {
    type: Number,
    default: 0,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  city: String,
  duration: Number,
  status: { type: String, default: "waiting_review" },
});

const Story = mongoose.model("Story", StorySchema);

StorySchema.pre("remove", function () {
  if (this.image) {
    return s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: this.imageKey,
      })
      .promise();
  }
});

module.exports = Story;
