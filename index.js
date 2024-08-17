const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const corsOptions = {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://traveleasy-417a6.web.app',
      'https://traveleasy-417a6.firebaseapp.com'
      
     
    ],
    credentials: true,
    optionSuccessStatus: 200,
  }

// middleware
app.use(cors(corsOptions));
app.use(express.json());


const uri = "mongodb+srv://easyTravel:WpmIc2RLky7O93eO@cluster0.edfearx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    const placeCollection = client.db('travelDB').collection('travel');
    const userCollection = client.db('travelDB').collection('user');

    app.get('/travel', async (req, res) => {
        const cursor = placeCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/travel/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await placeCollection.findOne(query);
        res.send(result);
    })

    app.post('/travel', async (req, res) => {
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await placeCollection.insertOne(newCoffee);
        res.send(result);
    })

    app.put('/travel/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true };
        const updatedPlace = req.body;

        const place = {
            $set: {
                tourists_spot_name: updatedPlace.ourists_spot_name,
                average_cost: updatedPlace.average_cost.value,
                ountry_Name: updatedPlace.country_Name.value,
                location: updatedPlace.location,
                seasonality: updatedPlace.seasonality,
                short_description: updatedPlace.details,
                travel_time: updatedPlace.travel_time,
                totaVisitorsPerYear: updatedPlace.quantity,
                image: updatedPlace.photo
            }
        }

        const result = await placeCollection.updateOne(filter, place, options);
        res.send(result);
    })

    app.delete('/travel/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await placeCollection.deleteOne(query);
        res.send(result);
    })

    // user related apis
    app.get('/user', async (req, res) => {
        const cursor = userCollection.find();
        const users = await cursor.toArray();
        res.send(users);
    })

    app.post('/user', async (req, res) => {
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result);
    });

    app.patch('/user', async (req, res) => {
        const user = req.body;
        const filter = { email: user.email }
        const updateDoc = {
            $set: {
                lastLoggedAt: user.lastLoggedAt
            }
        }
        const result = await userCollection.updateOne(filter, updateDoc);
        res.send(result);
    })

    app.delete('/user/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await userCollection.deleteOne(query);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('travel easy server is running')
})

app.listen(port, () => {
    console.log(`travel easy is running on port: ${port}`)
})
