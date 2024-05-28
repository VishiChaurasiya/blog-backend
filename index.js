const express = require("express");
const { connectToMongoDB } = require("./connect");
const postRoute = require("./routes/post");
const tagRoute = require("./routes/tag");

const app = express();
const PORT = process.env.PORT || 3005;

connectToMongoDB(
  process.env.MONGODB ?? "mongodb://localhost:27017/blog-backend"
)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log({ err }));

app.use(express.json());

app.use("/post", postRoute);
app.use("/tag", tagRoute);

app.listen(PORT, () => console.log(`Server started listening at PORT:${PORT}`));
