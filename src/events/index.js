const AWS = require("aws-sdk");
const { Consumer } = require("sqs-consumer");
const { sendLogInfo, sendLogError } = require("../logs/coralogix");

const validatorJson = require("../validators/validatorJson");
const { RecognizeStories } = require("../services/SqsServices");

AWS.config.update({ region: "us-east-2" });
const sqs = new AWS.SQS({ apiVersion: "2012-11-05", region: "us-east-2" });

const queueUrl = process.env.AWS_QUEUE;

const sqsEvents = async (message, event) => {
  const obj = {
    RecognizeStories: await RecognizeStories(message),
  };

  return obj[event];
};

function CreateConsumers() {
  sendLogInfo({ data: `Initing ${queueUrl}`, name: "INFO" });

  const consumer = Consumer.create({
    queueUrl,
    sqs,
    handleMessage: async (message) => {
      sendLogInfo({ data: message.Body, name: "INFO" });

      const orderData = validatorJson(message.Body) && JSON.parse(message.Body);

      await sqsEvents(orderData.data, orderData.event);

      const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      };
      sqs.deleteMessage(deleteParams, function (error, data) {
        if (error) {
          sendLogError({ data: `Delete Error ${error}`, name: "ERROR" });
        } else {
          sendLogInfo({ data: `Message Deleted ${data}`, name: "INFO" });
        }
      });

      return;
    },
  });

  consumer.on("error", (err) => {
    sendLogError({ data: err.message, name: "ERROR" });
  });

  consumer.on("processing_error", (err) => {
    sendLogError({ data: err.message, name: "ERROR" });
  });

  consumer.on("timeout_error", (err) => {
    sendLogError({ data: err.message, name: "ERROR" });
  });

  consumer.start();

  sendLogInfo({ data: `Started ${queueUrl}`, name: "INFO" });
}

module.exports = CreateConsumers;
