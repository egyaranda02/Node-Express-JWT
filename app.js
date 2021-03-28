const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
// const dbURI = 'mongodb+srv://shaun:test1234@cluster0.del96.mongodb.net/node-auth';
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
//   .then((result) => app.listen(3000))
//   .catch((err) => console.log(err));

app.listen(3000, ()=>{
  console.log("Listening to port 3000");
})

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes);

app.get('/set-cookies', (req, res)=>{
  res.cookie('newUser', false);
  res.cookie('isCoder', true, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});

  res.send('you got the cookie!');
});

app.get('/read-cookies', (req, res)=>{
  const cookies = req.cookies;
  console.log(cookies);

  res.json(cookies);
});