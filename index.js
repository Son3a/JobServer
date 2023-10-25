const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const path = require("path")
const dotenv = require('dotenv');
const cors = require('cors')
const YAML = require('yamljs');
const swaggerUI = require('swagger-ui-express');
// env
dotenv.config();
app.use(cors());
app.options('*', cors());
let bodyParser = require('body-parser')
// user cors
app.use(cors())

// parse application/x-www-form-urlencoded
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// swagger
const swaggerJsDocs = YAML.load('./api.yaml');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));


// parse application/json
app.use(bodyParser.json())

// static file 
//edit folder static
app.use(express.static(path.join(__dirname, '../upload')));
// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
// Router
require('./src/routes')(app)

// config mongodb
require('./src/db').connect()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})