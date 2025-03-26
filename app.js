const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");
const compression = require("compression");
const http = require("http");
const languageMiddleware = require("./middlewares/languageMiddleware");


// Custom modules
const databaseManager = require("./core/db_connection");


// Routes
const authRoute = require("./lib/auth/auth_route");

const usersRoute = require("./lib/users/users_route");

// Middleware
// Middleware
const { isAuthenticated } = require("./middlewares/auth/auth_middleware.js");

// Initialize app and server
const app = express();
const server = http.createServer(app);

// Load environment variables
dotenv.config();

// Middleware configurations
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "GET, POST, PUT, PATCH, DELETE",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(languageMiddleware);
app.use(logger("dev"));
app.use(compression());

app.use("/v1/auth", authRoute);

// Apply authentication middleware for protected routes
app.use(isAuthenticated);
app.use("/v1/users", usersRoute);






// Connect to MongoDB
(async () => {
  try {
    await databaseManager.connectToDatabase();
    console.log("Connected to database successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the application if the database connection fails
  }
})();








// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  if (err.type === "entity.too.large") {
    return res.status(413).send("Payload too large");
  }
  res.status(500).send("Internal Server Error");
});

server.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});
// Export server
module.exports = { server };
