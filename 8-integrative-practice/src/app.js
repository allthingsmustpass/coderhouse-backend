const express = require("express");
const http = require("http");
const exphbs = require("express-handlebars");
const { mongoDBconnection } = require("./database/mongo.config");

const productsRoutes = require("./routes/products.routes");
const cartRoutes = require("./routes/cart.routes");
const path = require('path');
const API_PREFIX = "api";

/* Port and socket */
const PORT = 8080;
const app = express();
const server = http.createServer(app);

/* Handlebars */
app.engine(
  "handlebars",
  exphbs({
    extname: "handlebars",
    defaultLayout: false, 
    layoutsDir: "views/layouts/"
  })
);
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, 'views'));

/* Express */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes */
app.use(`/${API_PREFIX}/products`, productsRoutes)
app.use(`/${API_PREFIX}/carts`, cartRoutes)


/* Mongo */
mongoDBconnection()

  .then(() => {
    console.log("Conexión a MongoDB Atlas establecida correctamente");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB Atlas:", error);
  });

server.listen(PORT, () => {
  console.log(`API listening: http://localhost:${PORT}`);
});
