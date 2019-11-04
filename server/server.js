require('./config/config.js')

const express = require('express')
const mongoose = require('mongoose');
const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
 
// parse application/json
app.use(bodyParser.json())

//Configuracion de rutas
app.use(require('./routes/index'));



 
mongoose.connect( process.env.URLDB,
  {useNewUrlParser: true,
   useCreateIndex: true, 
   useUnifiedTopology: true,
   useCreateIndex: true,
   useNewUrlParser: true}).then(() => {
console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});


app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`)
});