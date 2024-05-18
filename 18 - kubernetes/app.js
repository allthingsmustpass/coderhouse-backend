// Importaciones
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import mongoose from "mongoose";
import morgan from "morgan";
import passport from "passport";
import "dotenv/config";
import __dirname from "./__dirname.js";
import cart from "./src/controller/cart-routes.js";
import loggerRouter from "./src/controller/logger.routes.js";
import messages from "./src/controller/messages-routes.js";
import products from "./src/controller/products-routes.js";
import routerSessions from "./src/controller/sessions-routes.js";
import passwordReset from "./src/controller/passwordReset-routes.js";
import MessagesDao from "./src/dao/messagesDao.js";
import ProductsDao from "./src/dao/productDao.js";
import views from "./src/routes/views-routes.js";
import Logger from "./src/utils/Logger.js";
import initializaPassport from "./src/utils/passport.config.js";
import { Server } from "socket.io";

// Servidor Http
const app = express();
const httpServer = app.listen(process.env.PORT || 3000, () => {
  Logger.info(`Server running at port ${process.env.PORT}`);
});
let productos;
let mensajes;

// Inicialización de datos
const initialData = async () => {
  productos = await ProductsDao.getAllProducts();
};

const initialMessages = async () => {
  mensajes = await MessagesDao.getAllMessages();
};

// Servidor Socket
const socketServer = new Server(httpServer);
socketServer.on("connection", socket => {
  initialData();
  socket.emit("products", productos);
  initialMessages();
  socket.emit("messages", mensajes);
});

// Conexión a la base de datos
const uri = process.env.MONGO_URI;
mongoose.set("strictQuery", false);

mongoose.connect(uri).then(
  () => {
    Logger.info("Conectado a DB");
  },
  err => {
    Logger.fatal(err);
  }
);

// Exportación de socket.io para poder usarlo en los endpoints:
export default socketServer;

// Middleware
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: uri,
      ttl: 60 * 60 * 24,
    }),
  })
);
initializaPassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", products);
app.use("/api", cart);
app.use("/api", messages);
app.use("/api", routerSessions);
app.use("/api", loggerRouter);
app.use("/api", passwordReset);
app.use("/", views);

// Configuración de templates de vistas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/src/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
