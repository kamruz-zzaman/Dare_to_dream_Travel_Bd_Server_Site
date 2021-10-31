const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.utqcf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("DaretoDreamTravel");
        const packagesCollection = database.collection("Packages");
        const bookingCollection = database.collection("Booking");
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const package = await cursor.toArray();
            res.send(package);
        })
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const package = await packagesCollection.findOne(query);
            res.send(package);
        })
        app.post('/packages', async (req, res) => {
            const data = req.body;
            const package = await packagesCollection.insertOne(data);
            res.send(package);
        })
        app.post('/booking', async (req, res) => {
            const data = req.body;
            const booking = await bookingCollection.insertOne(data);
            res.send(booking);
        })
        app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        })
        app.put('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    Status: `Done`
                },
            };
            const result = bookingCollection.updateOne(filter, updateDoc, options);
            console.log(result);
            res.send(result);
        })
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const booking = await bookingCollection.deleteOne(query);
            res.send(booking);
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Dare to Dream Travel Start')
})


app.listen(port, () => {
    console.log('server start at port', port);
})