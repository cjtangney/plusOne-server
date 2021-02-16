const express = require('express');
const cors = require('cors');
const app = express();

var allowlist = ['http://localhost:3333', 'https://plus-one.vercel.app/'];
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (allowlist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }

// app.use(cors(corsOptionsDelegate));
app.use(cors('https://plus-one.vercel.app/'));

const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const { resolve } = require('path');
const { homedir } = require('os');
const url = 'mongodb+srv://root:cU2P8myQ2y332Di@wr-winrate.zn8ks.mongodb.net/winrates-WR?retryWrites=true&w=majority';
const dbName = 'list_01';
const collectionName = 'heroes';

app.get('/heroes', async (_, res) => {
  const client = new mongo(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  client.connect().then(() => {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return cursor = collection.find({});
  }).then((cursor) => {
    return cursor.toArray()
  }).then((data) => {
    res.send(data);
    client.close();
  });
});

app.post('/update\::hero', (req, res) => {
  console.log('updating: ', req.params.hero);
  const hero = JSON.parse(req.params.hero);
  const o_ID = new ObjectID(hero._id);
  hero._id = o_ID;

  const client = new mongo(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  client.connect().then(async () => {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const filter = { _id: o_ID };
    const result = await collection.updateOne(filter, { $set: hero });
    return(result);
  }).then((info) => {
    console.log(info.result);
    client.close();
    res.send();
  });
});

app.listen(3000, () => {
  console.log('Server running... 🚀', '\n', 'port: 3000');
});