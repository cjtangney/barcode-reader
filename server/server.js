const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = 'mongodb://localhost:27017/barcode-reader';

// socket stuff
const http = require('http');
const socket = require('socket.io');

// use http server for socket
const server = http.Server(app);
const io = socket(server);
app.io = io;

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// set the payload limit
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({parameterLimit: 100000, limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));
app.use(logger('dev'));
app.set('io', io);

// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this method posts a new list to the database and updates existing ones
router.post('/putData', (req, res) => {
  let data = new Data();
  const { name, fileName, serials, totalQty, redeemQty } = req.body;
  if (!name || !fileName) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS'
    });
  }
  data.redeemQty = redeemQty;
  data.totalQty = totalQty;
  data.serials = serials;
  data.fileName = fileName;
  data.name = name;
  Data.findOneAndUpdate({ fileName: data.fileName }, data, {upsert: true}, function (err, data){
    if(err){
      return res.json({ success: false, error: err });
    }else{
      req.app.get('io').emit('sync-lists');
      return res.json({ success: true });
    }
  });
});

// this method updates lists
router.post('/updateData', (req, res) => {
  let data = new Data();
  const { name, fileName, serials, totalQty, redeemQty } = req.body;
  if (!name || !fileName) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS'
    });
  }
  data.redeemQty = redeemQty;
  data.totalQty = totalQty;
  data.serials = serials;
  data.fileName = fileName;
  data.name = name;
  Data.updateOne({ "fileName": req.body.fileName},{$set: {"serials": req.body.serials, "redeemQty": req.body.redeemQty}}, function(err, data){
    if(err){
      return res.json({ success: false, error: err });
    }else{
      req.app.get('io').emit('sync-data');
      return res.json({ success: true });
    }
  });
});

// watch the socket
io.on('connection', (socket) => {
  socket.on('update-data', () => {
    io.emit('sync-data');
  })
  socket.on('update-list', () => {
    io.emit('sync-list');
  })
  socket.on('disconnect', () => {
    console.log('user disconnected from socket');
  });
})

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
server.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));