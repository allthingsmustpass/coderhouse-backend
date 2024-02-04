const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const exphbs = require("express-handlebars");

const productsRoutes = require("./routes/products.routes");
const cartRoutes = require("./routes/cart.routes");
const homeRoutes = require("./routes/home.routes");
const realTimeProductsRoutes = require("./routes/realTimeProducts.routes"); 
const configureWebSocket = require("./controllers/websocketController");
const productManager = require("./classes/productManager.js");

const pm = new productManager("./src/json/products.json");

const path = require('path');

/*Port and socket*/
const PORT = 8080;
const app = express();
const server = http.createServer(app);

/*Handlebars*/
app.engine("handlebars", exphbs({
  defaultLayout: path.join(__dirname, 'views', 'home')
}));
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, 'views'));

/*Express*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*Routes*/
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/", homeRoutes);
app.use("/realtimeproducts", realTimeProductsRoutes); 

/*Websocket*/
const io = socketIO(server);
configureWebSocket(server, pm);

server.listen(PORT, () => {
  console.log(`API listening: http://localhost:${PORT}`);
});
