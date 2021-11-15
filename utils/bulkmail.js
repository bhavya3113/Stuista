const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport(sendGridTransport({
  auth:{
    api_key: process.env.API_KEY
  }
}))

exports.bulkmail =(email,fullname)=>{
  transporter.sendMail({
    to:email,
    from:'learnatstuista@gmail.com',
    subject:'New course arrival',
    html:`<h4>Hello ${fullname},</h4>
    <br>New course relevant to your interest has arrived.Visit the website for more information.
    <br>
    <h5>Thanks ,<br>Team Stuista</h5>`
  })
}