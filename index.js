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

// const findUrlByUrl = (url, done) => {
//     Shorturl.find({url: url},function(err,data){
//       if (err) return console.log(err);
      
//       done(null, data);
//     });
    
// };

const findUrlById = (urlId, done) => {
    Shorturl.findById({_id: urlId},function(err,url){
      if (err) return console.log(err);
      
      done(null, url);
    });
    
};

const removeByUrl = (url, done) => {
    Shorturl.remove({url: url},function(err,data){
      if (err) return console.log(err);
      
      done(null, data);

    })
    
};
// const createAndSave = require('./index').createAndSaveShorturl
app.post('/api/shorturl', function(req, res, next ){
  // r = dns.lookup(url, function(err,address,family){
  //   console.log(address);
  //   console.log(family);
  //   console.log(err)
  // })

  r = Shorturl.find({},function(err,data){
    if (err) return console.log(err);
    return  data.length;
    // console.log(data[0]);
    // const found =  data.find(element => element.url > req.body.url)
    // console.log(found)
  });
  req.body.size = r
  next();
  // var info = req.body;
  // let short = new Shorturl(info)
  // short.save(function (err,data){
  //     if (err) return console.log(err);
  //     // done(null, data);
  // });
  // var obj = {"original_url": info.url, "short_url": info.short}
  // req.obj = obj

  // next();
  
  

},function(req,res){
      console.log(req.body.size)
      // res.send(req.obj);
  }
);

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
exports.shortUrlModel = Shorturl;
// exports.createAndSaveShorturl = createAndSaveShorturl;
exports.findUrlById =  findUrlById;
// exports.findUrlByUrl = findUrlByUrl;
exports.removeByUrl =  removeByUrl;