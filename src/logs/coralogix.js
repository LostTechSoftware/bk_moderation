const Coralogix = require("coralogix-logger");

// global confing for application name, private key, subsystem name
const config = new Coralogix.LoggerConfig({
  applicationName: "MS_MODERATION",
  privateKey: "5a6e43f3-955f-d1d3-acdd-a40787d109fc",
  subsystemName: process.env.PROD === true ? "PRODUCTION" : "STAGING",
});

Coralogix.CoralogixLogger.configure(config);

// create a new logger with category
const info = new Coralogix.CoralogixLogger("info");
const error = new Coralogix.CoralogixLogger("error");

function sendLogInfo({ name, data }) {
  const log = new Coralogix.Log({
    severity: Coralogix.Severity.info,
    className: name,
    methodName: name,
    text: data,
  });

  info.addLog(log);
}

function sendLogError({ name, data }) {
  const log = new Coralogix.Log({
    severity: Coralogix.Severity.error,
    className: name,
    methodName: name,
    text: data,
  });

  error.addLog(log);
}

module.exports = { sendLogInfo, sendLogError };
