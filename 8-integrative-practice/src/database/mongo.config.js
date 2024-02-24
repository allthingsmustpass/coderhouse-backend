const mongoose = require("mongoose");

const DB_HOST = "localhost";
const DB_NAME = "ecommerce";
const DB_PORT = 8080;
const USERNAME = "user";
const KEY = "key";

const configConnection = {
  url: `mongodb+srv://${USERNAME}:${KEY}@cluster0.llc9gue.mongodb.net/?retryWrites=true&w=majority`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};


const mongoDBconnection = async () => {
  try {
    await mongoose.connect(configConnection.url, configConnection.options);
    console.log(
      `URL: ${configConnection.url.substring(0, 20)}`);
    console.log(`${DB_NAME}`);
    console.log(`Connected!`);
  } catch (error) {
    console.log(error);

    throw new Error(error);
  }
};

module.exports = {
  configConnection,
  mongoDBconnection,
};
