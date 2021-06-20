const AWS = require("aws-sdk");

var rekognition = new AWS.Rekognition();

var params = {
  JobId: "id_121312938" /* required */,
  //   MaxResults: "NUMBER_VALUE",
  //   NextToken: "STRING_VALUE",
  SortBy: "TIMESTAMP",
};

rekognition.getContentModeration(params, function (err, data) {
  if (err) console.log(err, err.stack);
  // an error occurred
  else console.log(data); // successful response
});
