const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId =require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello Food-Corner!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4sklc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("food-corner").collection("products");
    
    app.get('/products', (req, res) => {
        productCollection.find({})
        .toArray((err, items) => {
            res.send(items);
        })
    })

    app.get('/product/:id', (req, res) => {
        productCollection.find({_id: ObjectId(req.params.id)})
            .toArray((err, items) => {
                res.send(items[0]);
            })
    })


    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log(newProduct)
        productCollection.insertOne(newProduct)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.delete('/deleteProduct/:id', (req, res) => {
        productCollection.deleteOne({ _id: ObjectId(req.params.id)})
        .then(result =>{
            console.log(result)
        })
    })

    // client.close();
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})