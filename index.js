const express = require("express");
const mongoose = require("mongoose"); 
const path = require('path');
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const instructorRoutes = require("./routes/instructor");
const userRoutes = require("./routes/user");
const multer = require('multer');

dotenv.config();
const app = express();


const fileStorage = multer.diskStorage({
  destination:(req,file,cb)=>{
    if (file.fieldname == 'image')
      cb(null, 'images');
    else 
    cb(null,'videos');
  },
  filename: (req,file,cb)=>{
    cb(null,  file.fieldname + '-' + file.originalname)
  }
})

const fileFilter=(req,file,cb)=>{
  var ext = path.extname(file.originalname);
  if (file.fieldname == "image")
  {
    if(ext == '.png' || ext == '.jpg' || ext == '.jpeg')
       cb(null,true);
    else {
      cb(null,false);
      console.log("wrong file type")}
  }
  else if(file.fieldname === "video")
  {
    if(ext == '.mp4')
       cb(null,true);
    else {
      cb(null,false);
      console.log("wrong file type")}
  }
}

app.use(multer({storage:fileStorage,fileFilter:fileFilter})//.array('video', 10));
// .single('image'));
.fields([
  { name: 'image'},
  { name: 'video'}
]));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use('/videos',express.static(path.join(__dirname, 'videos')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});


app.use('/auth',authRoutes);
app.use('/courses',courseRoutes);
app.use(instructorRoutes);
app.use(userRoutes);


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});



mongoose
  .connect(
    process.env.CONNECT_TO_DB
  )
  .then(result => {
    app.listen(8080);
    console.log("connected");
  })
  .catch(err => console.log("error",err));
  
