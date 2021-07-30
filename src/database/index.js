const mongoose = require("mongoose");
const { sendLogInfo } = require("../logs/coralogix");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
mongoose.Promise = global.Promise;

sendLogInfo({
  data: `Banco de dados conectado: ${
    process.env.NODE_ENV === "production" ? "Produção" : "Staging"
  }`,
  name: "INFO",
});

module.exports = mongoose;
