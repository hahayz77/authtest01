//jshint esversion:6
require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
mongoose.connect('mongodb+srv://hahayz77:alucard123@testcluster.lbwsmb8.mongodb.net/authdb?retryWrites=true&w=majority',{useNewUrlParser: true})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = new mongoose.model('user', userSchema)

app.get('/', (req, res)=>{
    res.render('home')
})

//#########################

app.get('/login', (req, res)=>{
    res.render('login')
})

app.post('/login', async(req,res)=>{
    try {
        const username = req.body.username
        const password = req.body.password

        const foundUser = await User.findOne({email: username})
        const match = await bcrypt.compare(password, foundUser.password);
        if(match) {
            res.render('secrets')
        } else{
            console.log('wrong password');
            res.send('wrong password')
        }
    } catch (error) {
        console.log(error)
    }

})

//#########################

app.get('/register', (req, res)=>{
    res.render('register')
})

app.post('/register', async(req,res)=>{
   try{
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
        email: req.body.username,
        password: hash
    })
    const save = await newUser.save();
    res.render('secrets');

   } catch(err){
    console.log(err)
   }
})

//###########################


app.listen(3000, ()=>{console.log("http://localhost:3000/ ########################")})