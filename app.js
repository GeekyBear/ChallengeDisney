const express = require('express');
const app = express();
const { db } = require('./models/db')
const port = 3000;
const cookieparser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const { listCharacters, createChar, updateChar, getChar, deleteChar, 
  queryByAge,queryByName,queryByMovieId,listMovies,createMovie,getMovie,deleteMovie, updateMovie,
  queryMovByName, queryMovByIdGenre, queryMovByOrder } = require('./functions');
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}))
app.use(cookieparser());
app.use(session(
  {
    name: 'sid',
    secret: 'secret', //It should be in an enviroment file
    resave: false,
    saveUninitialized: false,
    cookie:{
      maxAge: 1000 * 60 * 60 * 2 //2hs
    }
  }
))

app.use(express.json());

// This users should be in a database and the password should be hashed, but I prefer to
// keep advancing with the proyect... If I got time, I will add it...
const authUsers = [
  {id:1, name: 'Eze', email: 'ezegeek@gmail.com', password: '12345'},
  {id:2, name: 'Alo', email: 'alondra@gmail.com', password: '12345'}
]

app.use((req,res,next) => {
  next();
})

// REDIRECTS //
const redirectLogin = (req, res, next) => {
  if(!req.session.userId){
    res.redirect('/login');
  } else {
    next();
  }
}

const redirectHome = (req, res, next) => {
  if(req.session.userId){
    res.redirect('/home');
  } else {
    next();
  }
}

// ROUTES ------------------------------------
// Get to /
app.get('/', (req, res) => {
  res.json('Say hello to my little web!')
});

// Get to HOME
app.get('/home', redirectLogin, (req, res) => {
  const user = authUsers.find(user => user.id === req.session.userId);
  console.log(user)
  res.send(`
    <div>
      <h1>Bienvenido ${user.name}</h1>
      <h4>${user.email}</h4>
      <a href='/'>To /</a>
    </div>`
  )
});

// LOGIN GET
app.get('/login', (req,res) => {
  res.send(
    `<h1>Log in</h1>
    <form method='post' action='/login'>
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Password' required/>
      <input type='submit' />
    </form>
    <a href='/register'>Register</a>`
  )
})
// LOGIN POST
app.post('/login', redirectHome, (req, res) => {
  const { email, password } = req.body;
  if(email && password){
    const user = authUsers.find(user => user.email === email && user.password === password)
    if(user){
      req.session.userId = user.id;
      return res.redirect('/')
    }
  }
  res.redirect('/login')
});

//REGISTER POST
app.post('/register', redirectHome, (req, res) => {
  const { name, email, password } = req.body;
  if(name && email && password){
    const exists = authUsers.some(user => user.email === email)
    if(!exists){
     const user = {
      id: authUsers.length + 1,
      name,
      email,
      password
     }

    // USING NODEMAILER AND MAILTRAP FOR TESTING PURPOSES ------
     var mailOptions = {
      from: '"Example Team" <from@example.com>',
      to:email,
      subject: 'Nice Nodemailer test',
      text: 'Welcome to my little project ',
      html: '<b>Hey there! </b><br> Thanks for your registration<br />'
     };
     transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      });
      // EMAIL "SENT" ------------------------------------------
    
     authUsers.push(user);
     return res.redirect('/')
    }
  }
  res.redirect('/register')
});

//REGISTER GET
app.get('/register', (req,res) => {
  res.send(`
    <>
      <h1>Register</h1>
      <form method='post' action='/register'>
        <input name='name' placeholder='Name' required />
        <input type='email' name='email' placeholder='Email' required />
        <input type='password' name='password' placeholder='Password' required/>
        <input type='submit' />
      </form>
      <a href='/login'>Log In</a>
    </>
  `
  )
})

//LOGOUT GET
app.get('/logout',redirectLogin, (req,res) => {
  req.session.destroy((err) => {
    if(err){
      return res.redirect('/home')
    }
    res.clearCookie('sid');
    res.redirect('/')
  })
})

// GET ALL CHARACTERS
app.get('/characters', redirectLogin, async (req, res, next)=>{
  const { name, age, movieId } = req.query;
  
  if(!name && !age && !movieId) {
    try {
        const characters = await listCharacters();
        res.status(200).json({characters: characters});
    } catch(e) {
        console.log(e)
        res.sendStatus(500);
    }
  }
  
  
  if(name){
    try {
      const char = await queryByName(name);
      if(!char[0]) return res.send('Character not found')
      return res.json(char)
    } catch (e) {
      console.log(e);
      res.sendStatus(500);    
    }
  }

  if(age){
    try {
      const char = await queryByAge(age);
      if(!char[0]) return res.send('Character not found')
      return res.json(char)
    } catch (e) {
      console.log(e);
      res.sendStatus(500);    
    }
  }

  // tengo que buscar los personajes por pelicula
  if(movieId){
    try {
      const char = await queryByMovieId(movieId)
      if(!char[0]) return res.send('Character not found')
      return res.json(char)
    } catch (e) {
      console.log(e);
      res.sendStatus(500);    
    }
  }
});

// <CHARACTER - CRUD> -----------------------------------------
// CREATE CHARACTER  - ¡¡¡¡OK!!!!
app.post('/characters', redirectLogin, async (req, res, next)=>{
  try {
      const { image, name, age, weigth, history, movieName } = req.body;
      const response = await createChar(image, name, age, weigth, history, movieName)
      res.status(200).json({response})
  } catch(e) {
      console.log(e);
      res.sendStatus(500);
  }
});

// GET CHARACTER DETAIL - ¡¡¡¡OK!!!!
app.get('/characters/:name', redirectLogin, async (req, res, next) => {
  try {
    const { name } = req.params;
    const char = await getChar(name);
    if(!char[0]) return res.send('Character not found')
    res.json(char)
  } catch (e) {
    console.log(e);
    res.sendStatus(500);    
  }
})

// UPDATE CHARACTER - ¡¡¡¡OK!!!!
app.put('/characters', redirectLogin, async (req, res) => {
  try {
    const { image, name, age, weigth, history, associatedMedia } = req.body;
    const char = await updateChar(image, name, age, weigth, history, associatedMedia);
    res.json(char)
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
})

// DELETE CHARACTER
app.delete('/characters/:name', redirectLogin, async (req, res) => {
  try {
    const { name } = req.params;
    const response = await deleteChar(name);
    return res.status(204).json(response);
  } catch (error) {
    console.log(error)
  }
})
// </CHARACTER CRUD> -----------------------------------------

// <QUERIES> -------------------------------------------------

// </QUERIES> ------------------------------------------------

// <MOVIES> -----------------------------------------
// GET ALL MOVIES -- OK REVISAR
app.get('/movies', redirectLogin, async (req, res, next)=>{
  const { name, idGenero, order } = req.query;

  // If name, then search movie by name
  if(name){
    try {
      const movies = await queryMovByName(name);
      if(movies.length === 0) return res.status(404).send('Movie not found');
      return res.status(200).json(movies);
    } catch(e) {
      return res.sendStatus(500);
    }
  }

   // If idGenero, then search movies by genre
  if(idGenero){
    try {
      const movies = await queryMovByIdGenre(idGenero);
      if(movies.length === 0) return res.status(404).send('Genre not found');
      return res.status(200).json(movies);
    } catch(e) {
      return res.sendStatus(500);
    }
  }

  // if order = asc || desc, it returns movies by date of creation
  if(order){
    try {
      const moviesByDate = await queryMovByOrder(order);
      if(moviesByDate.length === 0) return res.status(404).json('Movies not found');
      return res.status(200).json(moviesByDate);
    } catch(e) {
      return console.log(e);
    }
  }

  try {
      const movies = await listMovies();
      return res.status(200).json(movies);
  } catch(e) {
    return res.sendStatus(500);
  }
});

// GET SPECIFIC MOVIE
app.get('/movies/:movie', redirectLogin, async (req,res) => {
  try {
    const { movie } = req.params;
    const mov = await getMovie(movie);
    if(!mov[0]) return res.send('Movie not found')
    res.json(mov)
  } catch (e) {
    console.log(e);
    res.sendStatus(500);    
  }
})

// CREATE MOVIE - OK
app.post('/movies', redirectLogin, (req, res) => {
  const { title, image, dateCreation, score,  genre, genreImg } = req.body;
  res.json(createMovie(title, image, dateCreation, score,  genre, genreImg  ))
})

// UPDATE CHARACTER - ¡¡¡¡OK!!!!
app.put('/movies', redirectLogin, async (req, res) => {
  try {
    const { title, image, dateCreation, score,  genre, genreImg  } = req.body;
    const movie = await updateMovie(title, image, dateCreation, score,  genre, genreImg);
    res.json(movie)
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
})

// DELETE MOVIE
app.delete('/movies/:name', redirectLogin, (req, res) => {
  const { name } = req.params;
  res.json(deleteMovie(name))
})

// </MOVIES> -----------------------------------------

app.listen(port, (err) => {
  if(err){
    console.log(err)
  } else {
    console.log(`Server listening on port ${port}`);
    db.sync({force:true});
  }
})

var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b82eb763d48c0f",
    pass: "7b111b8689f790"
  }
});