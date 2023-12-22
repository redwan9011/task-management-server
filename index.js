const express = require('express')
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_SECRET_KEY}@cluster0.dpklxw3.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const taskcollection = client.db("taskmanagement").collection("tasks");
    
    app.get('/tasks' , async(req, res) => {
        const result = await taskcollection.find().toArray()
        res.send(result)
    })

    app.get('/tasks/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await taskcollection.findOne(query);
        res.send(result)
      })

    app.post('/tasks' , async(req, res) => {
        const task = req.body;
        const result = await taskcollection.insertOne(task);
        res.send(result)
    })
    app.delete('/tasks/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await taskcollection.deleteOne(query);
        res.send(result)
      })

      app.put('/tasks/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const option = { upsert: true };
        const task = req.body;
        const updatetask = {
          $set: {
  
            title: task.title,
            deadlines:task.deadlines,
            description: task.description,
            priority:task.priority
  
          }
        }
        const result = await taskcollection.updateOne(filter, updatetask, option);
        res.send(result)
      })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('task management is running ')
})
app.listen(port , ()=> {
    console.log('task management is running on' , port);
})

