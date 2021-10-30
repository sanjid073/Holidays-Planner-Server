const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0th5g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("HolidaysPlanner");
    const OffersCollection = database.collection("Offers");
    const bookCollection = database.collection("BooksOffer");

    //   get all offers
    app.get("/offers", async (req, res) => {
      const offers = await OffersCollection.find({}).toArray();
      res.json(offers);
    });

    // add offer
    app.post("/offers", async (req, res) => {
      const offer = req.body;
      const result = await OffersCollection.insertOne(offer);
      res.json(result);
    });

    // get single offer
    app.get("/offer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await OffersCollection.findOne(query);
      res.send(result);
    });

    // books offer
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await bookCollection.insertOne(order);
      res.json(result);
    });

    // get book offer by email
    app.get("/myOrders/:email", async (req, res) => {
      // const email = req.params.email;
      const result = await bookCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
    //delete order from the database
    app.delete("/deleteOrders/:id", async (req, res) => {
      const result = await bookCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    //   get all order
    app.get("/allOrders", async (req, res) => {
      const result = await bookCollection.find({}).toArray();
      res.json(result);
    });

    //  update products
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await bookCollection.updateOne(filter, {
        $set: {
          status: "Approved",
        },
      });
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running assignment-11 server");
});

app.listen(port, () => {
  console.log("running assignment-11 server", port);
});
