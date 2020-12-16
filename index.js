const  bodyParser = require("body-parser");
const apps = require('./app');
const express = require("express");
const app = express();
let ejs = require('ejs');
const save = require('instagram-save');
const mongoose = require('mongoose');
const fs=require('fs');
var zipFolder = require('zip-folder');
const AdmZip = require('adm-zip');

const zip = new AdmZip();



const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressLayouts);

global.downloadName = "" ;
global.pathname = "" ;



app.post("/download",(req,res)=>{

  files = fs.readdirSync(pathname);
  console.log(files);
  if(files.length == 0){
    res.render("/download",{info : "Account is Private"})
  }

  console.log('EXCELLENT in download');
  console.log(downloadName);
  const data = zip.toBuffer();
  res.set('Content-Type','application/octet-stream');
  res.set('Content-Disposition',`attachment; filename=${downloadName}`);
  res.set('Content-Length',data.length);
  res.download(downloadName, downloadName,()=>{
    
  });

});

app.post("/instaPost",(req,res)=>{

  const str = req.body.url

  const words = str.split('/');
  console.log(words[4]);

  if (!fs.existsSync(__dirname+"/result/specific-photo/"+words[4]+"/")) {
    fs.mkdirSync(__dirname+"/result/specific-photo/"+words[4]+"/")
  }

  save(words[4], 'result/specific-photo/'+words[4]+"/").then(res => {
    console.log(res.file);

    
  });
  zipFolder(__dirname+"/result/specific-photo/"+words[4], __dirname+"/"+words[4]+".zip", function(err) {
    if(err) {
        console.log('oh no!', err);
    } else {
        console.log('EXCELLENT');
        pathname = __dirname+"/result/specific-photo/"+words[4];
        downloadName = words[4]+".zip"
        console.log("set");
    }
  });
 
  files = fs.readdirSync(__dirname+"/result/specific-photo/"+words[4])
  console.log(files);
  console.group(files.length)
  if(files.length == 0){
    res.render("dashboard",{info:"",info1:"",info2:"",info3 : "Invalid Input!"})
  }
  else{
    res.render("download");
  }
  

});





 app.post("/account",(req,res)=>{
    
    const questions=[{
        account:req.body.account_name,
        scroll:req.body.s1
    }];
    var mode = "account";
    console.log(questions[0].account);
    console.log(questions[0]);
 

const secondFunction = async () => {
   
   result = apps.main(questions[0],mode);
   await result;
   console.log(result);
   console.log(result);
  

  zipFolder(__dirname+"/result/account/"+questions[0].account, __dirname+"/"+questions[0].account+".zip", function(err) {
    if(err) {
        console.log('oh no!', err);
    } else {
   
      pathname = __dirname+"/result/account/"+questions[0].account;
      downloadName = questions[0].account+".zip"
      console.log("set");
      
     
      
    }
  });

  files = fs.readdirSync(__dirname+"/result/account/"+questions[0].account)
  console.log(files);
  console.group(files.length)
  if(files.length == 0){
    res.render("dashboard",{info : "Invalid Username!",info1:"",info2:"",info3 : ""})
  }
  else{
    res.render("download");
  }



  

}
secondFunction()

});




app.post("/hashtag",(req,res)=>{
    
  const questions=[{
      hashtag:req.body.hashtag,
      scroll:req.body.s2
  }];
  var mode = "hashtags";
  console.log(questions[0].hashtag);
  console.log(questions[0]);

  const secondFunction = async () => {
    
    await apps.main(questions[0],mode);
    
    zipFolder(__dirname+"/result/tags/"+questions[0].hashtag, __dirname+"/"+questions[0].hashtag+".zip", function(err) {
      if(err) {
          console.log('oh no!', err);
      } else {
          console.log('EXCELLENT');
          pathname = __dirname+"/result/tags/"+questions[0].hashtag;
          downloadName = questions[0].hashtag+".zip";
          console.log("set");
      }
    });
  
    files = fs.readdirSync(__dirname+"/result/tags/"+questions[0].hashtag)
  console.log(files);
  console.group(files.length)
  if(files.length == 0){
    res.render("dashboard",{info1 : "Invalid Hashtag!",info : "",info2:"",info3:""})
  }
  else{
    res.render("download");
  }
  
  }
  secondFunction();


});

app.post("/location",(req,res)=>{
    
  const questions=[{
      locations:req.body.location,
      scroll:req.body.s3
  }];
  var mode = "locations";
  console.log(questions[0].locations);
  console.log(questions[0]);
  const secondFunction = async () => {
    
    await apps.main(questions[0],mode);
  
    zipFolder(__dirname+"/result/locations/location1", __dirname+"/location1.zip", function(err) {
      if(err) {
          console.log('oh no!', err);
      } else {
          console.log('EXCELLENT');
          pathname = __dirname+"/result/locations/location1";
          downloadName = "location1.zip";
          console.log("set");
      }
    });
  
    files = fs.readdirSync(__dirname+"/result/locations/location1")
    console.log(files);
    console.group(files.length)
    if(files.length == 0){
      res.render("dashboard",{info2 : "Invalid location!",info : "",info1:"",info2:""})
    }
    else{
      res.render("download");
    }
  
  }
  secondFunction();

});





/*not mine*/
require('./config/passport')(passport);

// DB Config
const db = 'mongodb+srv://varadkj:varad@cluster0.qsnmn.mongodb.net/test?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(
    db,
    { useNewUrlParser: true,
    useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

  app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Connect flash
  app.use(flash());

  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  
  // Routes
  app.use('/', require('./routes/index.js'));
  app.use('/users', require('./routes/users.js'));


app.listen(3000,()=>{
    console.log("server started");
});





