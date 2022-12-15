require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let mongoose = require('mongoose');
let dns = require('dns');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let bodyParser = require('body-parser');
const { info } = require('console');
app.use(bodyParser.urlencoded({ extended: true }))
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

var contador = 1;

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



let shorturlSchema = new mongoose.Schema({
    url: String,
    short: Number,
});

let Shorturl = mongoose.model('Shorturl', shorturlSchema);


const createAndSaveShorturl = (info, done) =>{
  let short = new Shorturl(info)
  short.save(function (err,data){
      if (err) return console.log(err);
      done(null, data);
  });
}

let cont = 1;
let urls = [];
let bodies
// const createAndSave = require('./index').createAndSaveShorturl
app.post('/api/shorturl', function(req, res, next){
  let url = req.body.url
  let body;
  let found  = urls.find(element => element['original_url'] == url )
  // console.log(urls)
  if (found == undefined){
    console.log('not found')
    body = {"original_url": url, "short_url": cont};
    urls.push(body);
    req.body = body;
    cont += 1;
  }else{
    console.log('hola')
    req.body = found
  }
  next();
}, function(req,res){
  res.send(req.body);
  
});

app.get('/api/shorturl/:shorturl?',function(req,res){
  let shorturl = req.params.shorturl;
  console.log(shorturl);
  let found  = urls.find(element => element['short_url'] == Number(shorturl) )
  console.log(found)
  if (found != undefined){
    res.redirect(found.original_url);
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
exports.shortUrlModel = Shorturl;
// exports.createAndSaveShorturl = createAndSaveShorturl;