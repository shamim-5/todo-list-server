const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ffdipzm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const todoCollection = client.db("todo_list").collection("list");

    app.get("/", async (req, res) => {
      const result = await todoCollection.find().toArray();
      res.send(result);
    });

    app.post("/add", async (req, res) => {
      const query = req.body;
      const result = await todoCollection.insertOne(query);
      res.send(result);
    });

    app.delete("/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = req.body;
      const result = await todoCollection.updateOne(
        { _id: ObjectId(id) },
        {
          $set: query,
        },
        { upsert: true }
      );

      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
