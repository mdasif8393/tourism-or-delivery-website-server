const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h5pr3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      
        const database = client.db("travelAgency");
        const tourCollection = database.collection("tours");
        const ordersCollection = database.collection("orders");

        //post tours
        app.post('/tours', async (req, res) => {
            const doc = req.body;
            const result = await tourCollection.insertOne(doc);
            res.send(result);
        })

        //get tours
        app.get('/tours', async (req, res) => {
            const cursor = tourCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        //get single tour
        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await tourCollection.findOne(query)
            res.send(result)
        })

        //post an order
        app.post('/orders', async (req, res) => {
            const doc = req.body;
            const result = await ordersCollection.insertOne(doc)
            res.send(result)
        })
        
        //get orders by email
        app.get('/orders/:email', async (req, res) => {
            const userEmail = req.params.email;
            const query = { email: userEmail};
            const cursor = ordersCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        
        //delete a order
        app.delete('/orders/:id', async (req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await ordersCollection.deleteOne(query);
          res.send(result);

        })

        //get all orders
        app.get('/orders', async (req, res) => {
          const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        //update a user order status
        app.put('/orders/:id', async (req, res) => {
          const id = req.params.id;
          const user = req.body;
          console.log(id, user)
          const query = {_id: ObjectId(id)};
          const options = { upsert: true };
          const updateDoc = {
            $set: {
             status: user.status
            },
          };
          const result = await ordersCollection.updateOne(query, updateDoc, options);
          res.send(result);
        })

    } 
    
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running Travel agency website')
})

app.listen(port, () => {
  console.log(`running to the port:${port}`)
})