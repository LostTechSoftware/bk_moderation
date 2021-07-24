const AWS = require("aws-sdk");
const cron = require("node-cron");
const { sendLogInfo, sendLogError } = require("../logs/coralogix");
const {
  RecognizeStories,
} = require("../services/SqsServices/RecognizeStories");

AWS.config.update({ region: "us-east-2" });
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const queueUrl = process.env.AWS_QUEUE;

const params = {
  QueueUrl: queueUrl,
  MaxNumberOfMessages: 10,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 0,
};

cron.schedule("*/10 * * * * *", async () => {
  sqs.receiveMessage(params, async (err, message) => {
    if (err) {
      console.log(err, err.stack);
      sendLogError({ data: `Queue error ${err}`, name: "ERROR" });
    } else {
      if (!message.Messages) {
        sendLogInfo({ data: "Nothing to process", name: "INFO" });
        console.log("Nothing to process");
        return;
      }
      const orderData =
        /^[\],:{}\s]*$/.test(
          message.Messages[0].Body.replace(/\\["\\\/bfnrtu]/g, "@")
            .replace(
              /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
              "]"
            )
            .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
        ) && JSON.parse(message.Messages[0].Body);
      sendLogInfo({ data: orderData, name: "INFO" });

      if (orderData.event === "RecognizeStories") {
        await RecognizeStories(orderData.data);
      }

      const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: message.Messages[0].ReceiptHandle,
      };
      sqs.deleteMessage(deleteParams, function (error, data) {
        if (error) {
          console.log("Delete Error", error);
          sendLogError({ data: `Delete Error ${error}`, name: "ERROR" });
        } else {
          console.log("Message Deleted", data);
          sendLogInfo({ data: `Message Deleted ${data}`, name: "INFO" });
        }
      });
    }
  });
});
