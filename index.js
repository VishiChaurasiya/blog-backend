require("dotenv").config();

const express = require("express");
const { connectToMongoDB } = require("./utils/connect");
const postRoute = require("./routes/post");
const tagRoute = require("./routes/tag");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const app = express();

connectToMongoDB(process.env.MONGODB)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log({ err }));

app.use(cors());
app.use(express.json());

app.use("/blog/post", postRoute);
app.use("/blog/tag", tagRoute);

app.listen(PORT, () => console.log(`Server started listening at PORT:${PORT}`));
