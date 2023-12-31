const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;
const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://yachiyo-d018.web.app",
      "https://yachiyo-d018.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// My Middlewares

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  console.log(token);
  if (!token) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Unauthorized" });
    }
    console.log("value in token", decoded);
    req.decoded = decoded;
    next();
  });
};

// MONGO DB CONNECTION

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hq7fxqk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbConnect = async () => {
  try {
    await client.connect(); // Add 'await' here
    console.log("DB Connected Successfully✅");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

// BACKEND CODE STARTS HERE

const roomCollection = client.db("yachiyoDB").collection("rooms");
const bookingCollection = client.db("yachiyoDB").collection("bookings");
const reviewCollection = client.db("yachiyoDB").collection("reviews");

// BASE API
app.get("/", (req, res) => {
  res.send("Yachiyo server is running....");
});

// AUTH RELATED API
app.post("/jwt", async (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .send({
        status: true,
      });
  } catch (error) {
    res.send({
      status: true,
      error: error.message,
    });
  }
});

// Featured section related API

// Room related API
// Finding all the rooms
app.get("/rooms", async (req, res) => {
  const cursor = roomCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

// Finding rooms by id for booking
app.get("/rooms/details/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await roomCollection.findOne(query);
  res.send(result);
});

// Finding rooms by id for checkout
app.get("/rooms/checkout/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await roomCollection.findOne(query);
  res.send(result);
});

// Booking related API

// Update the seats when a booking is made
app.put("/rooms/checkout/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const room = await roomCollection.findOne(query);

  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  if (room.seats === 0) {
    res.status(400).json({ error: "No seats available" });
    return;
  }

  // Decrement the available seats by 1
  const updatedSeats = room.seats - 1;

  // Update the room document in the database with the new number of seats
  const update = { $set: { seats: updatedSeats } };
  const result = await roomCollection.updateOne(query, update);

  if (result.modifiedCount === 1) {
    res.status(200).json({ message: "Booking successful" });
  } else {
    res.status(500).json({ error: "Booking failed" });
  }
});

// Sorting Booking by email
app.get("/bookings", verifyToken,async (req, res) => {
  let query = {};
  if (req.query?.email) {
    query = { email: req.query.email };
  }
  const result = await bookingCollection.find(query).toArray();
  res.send(result);
});

// Inserting items into bookings
app.post("/bookings", async (req, res) => {
  const order = req.body;
  const result = await bookingCollection.insertOne(order);
  res.send(result);
});

// Deleting booking
app.delete("/bookings/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await bookingCollection.deleteOne(query);
  res.send(result);
});

// Update booking date
app.put("/bookings/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const { newDate } = req.body;
  const update = { $set: { date: newDate } };
  const result = await bookingCollection.updateOne(query, update);
  res.send(result);
});

// Reviews related API

app.get("/reviews", async (req, res) => {
  const id = req.query.roomId;
  let query = {};
  if (req.query?.roomId) {
    query = { idx: parseInt(id) };
  }
  const result = await reviewCollection.find(query).toArray();
  res.send(result);
});

// Adding reviews to the site
app.post("/reviews", async (req, res) => {
  const newReview = req.body;
  const result = await reviewCollection.insertOne(newReview);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server is running in PORT: ${port}`);
});


// Made the private repo public 