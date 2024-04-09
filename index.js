const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();

app.use(cors({
  origin : 'https://aabarnawal.github.io/smartHelmetClient/',
  methods : 'GET, POST,PUT, DELETE',
  credentials : true
}));
app.use(express.json())

var iot = false;
app.get('/',(req, res)=>{
    res.send("hello world");
})


// const makeTrue =() => { 
//   setTimeout(function () {
//     var datetime = new Date();
//     iot==true? iot=false : iot=true;
//     console.log(iot);
//     console.log(datetime.getTime());

//     makeTrue();
//   }, 10000);
// }

// makeTrue();



const userSchema = mongoose.Schema({
  Date : Number,
  minutes : Number
})


mongoose.connect("mongodb+srv://krankit1711:PA6Wnyo7gG36kYX6@test-data.fdofcqw.mongodb.net/");
const User = mongoose.model('User', userSchema);

async function insert(_date, _num){
  console.log("data is inserting !!");
  await User.create({
    Date : _date,
    minutes : _num
  })
}

var flag = 0;
var startTime = 0;

//recieve true or false form iot device
app.post('/api/post', (req,res)=>{
  res.send("api submitted");
  iot = req.body.start;
  var time = 0;
  var datetime = new Date();
  if(req.body.start==true){
    //start time
    startTime = datetime.getTime();
    flag = 1;
    console.log("***start time ", startTime, " flag = ", flag);
  }
  //get time stamp
  if(req.body.start==false && flag==1){
    //end time and store it in val
    console.log("***EndTime ",datetime.getTime());
    time = datetime.getTime() - startTime;
    flag = 0;
    console.log("***minutes ",Math.floor(time / 60000));
    console.log("***date ",datetime.getDate());
    insert(datetime.getDate(), Math.floor(time / 60000));
  }

  console.log(req.body.start)
  
})

//send true false to front end
app.get('/api/send', async (req, res)=>{
  await res.send(iot);
})

app.listen(8080, (err)=>{
    console.log("server started");
})