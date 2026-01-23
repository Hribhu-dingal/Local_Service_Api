const dotenv = require('dotenv').config()
const express = require('express')
const dbcon = require('./app/config/dbcon')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')


// Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const SwaggerOptions = require('./swagger.json');
const swaggerDocument = swaggerJsDoc(SwaggerOptions);

const app = express()
dbcon()

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json())
app.use(express.static('public'))
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// // API
const AuthRoute = require('./app/routes/AuthRouter')
app.use('/api',AuthRoute)

const FrontendApiRoute = require('./app/routes/FrontendRouter')
app.use('/api',FrontendApiRoute)

const AdminRoute = require('./app/routes/AdminRouter')
app.use('/api/admin',AdminRoute)

const ProviderRoute = require('./app/routes/ProviderRouter')
app.use('/api/provider',ProviderRoute)

const port = 3050

app.listen(port, () => {
    console.log(`Server running successfully at ${port}`)
})
