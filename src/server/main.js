import express from 'express';
import ViteExpress from 'vite-express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const client = new MongoClient('mongodb+srv://elscharpf:PvPxvoTq649Iiv4Y@a4transactiontracker.dagno.mongodb.net/?retryWrites=true&w=majority&appName=A4TransactionTracker');
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('A4TransactionTracker');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectDB();

app.post('/addUser', async (req, res) => {
  try {
    const { username, password } = req.body;
    const collection = db.collection('users');

    // Check if user already exists
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    await collection.insertOne({ username, password });
    res.status(201).json({ message: 'User added successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const collection = db.collection('users');
    const users = await collection.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const collection = db.collection('users');

    const user = await collection.findOne({ username, password });

    if (user) {
      res.json({ success: true, username });
    } else {
      res.status(400).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Add a new transaction
app.post('/add', async (req, res) => {
  try {
    const { username, amount, category, date } = req.body;
    const collection = db.collection('transactions');

    // Insert the transaction with the associated username
    const newTransaction = { username, amount, category, date };
    await collection.insertOne(newTransaction);

    // Get all transactions for the user
    const userTransactions = await collection.find({ username }).toArray();
    res.json(userTransactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// Read all transactions for the logged-in user
app.post('/read', async (req, res) => {
  try {
    const { username } = req.body;
    const collection = db.collection('transactions');

    const userTransactions = await collection.find({ username }).toArray();
    res.json(userTransactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Update a transaction
app.post('/update', async (req, res) => {
  try {
    const { id, amount, category, date } = req.body;
    const collection = db.collection('transactions');

    // Update the transaction with the ID
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { amount, category, date } });

    // Get all transactions for the user after the update
    const userTransactions = await collection.find({ username: req.body.username }).toArray();
    res.json(userTransactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete a transaction
app.post('/delete', async (req, res) => {
  try {
    const { id, username } = req.body;
    const collection = db.collection('transactions');

    // Delete the transaction with the ID
    await collection.deleteOne({ _id: new ObjectId(id) });

    // Get all transactions for the user after deletion
    const userTransactions = await collection.find({ username }).toArray();
    res.json(userTransactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

ViteExpress.listen(app, 3000);
