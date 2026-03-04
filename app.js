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

const isProduction = process.env.NODE_ENV === "production";


app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / server-to-server requests (no origin)
      if (!origin) return callback(null, true);

      // Allow all localhost ports (Vite, CRA, etc.)
      if (origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

// const allowedOrigins = [
//   "http://localhost:5173", 
//   "http://localhost:3050", 
//   "https://local-service-api-1g2n.onrender.com" 
// ];


// app.use(cors())


// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (
//         !origin || // Postman etc.
//         origin.startsWith("http://localhost:") ||
//         origin === "https://your-frontend-domain.com"
//       ) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
  


// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (
//         !origin || 
//         origin.startsWith("http://localhost:") 
//         // origin.startsWith("https://local-service-api-1g2n.onrender.com")
//       ) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(express.json())
app.use(express.static('public'))
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      withCredentials: true,
    },
  })
);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// // API
const AuthRoute = require('./app/routes/AuthRouter')
app.use('/api',AuthRoute)

const FrontendApiRoute = require('./app/routes/FrontendRouter')
app.use('/api',FrontendApiRoute)

const AdminApiRoute = require('./app/routes/AdminRouter')
app.use('/api/admin',AdminApiRoute)

const ProviderApiRoute = require('./app/routes/ProviderRouter')
app.use('/api/provider',ProviderApiRoute)

const port = 3050

app.listen(port, () => {
    console.log(`Server running successfully at ${port}`)
})
