const morgan = require('morgan');
const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARE DIFINITIONS
app.use(express.json());

// LOGGIN MIDDLEWARE

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// MIDDLEWARE TO ADD A TIME TO REQUESTS
app.use((req, res, next) => {
  req.RequestTime = new Date().toISOString();
  next(); // Call next middleware
});

// TEST MIDDLEWARE
// app.use((req, res, next) => {
//   console.log('Hello from Middleware!');
//   next();
// });

// ROUTING MIDDLEWARE

// if request hits "/api/v1/tours/" handover to -> "tourRouter" Router
// if request hits "/api/v1/users/" handover to -> "usersRouter" Router
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);

// TOUR RESOURCE
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTourById);
// app.post('/api/v1/tours', addTour);

// USER RESOURCE
// app.get('/api/v1/users', getAllUsers);
// app.get('/api/v1/users/:id', getUserById);
// app.post('/api/v1/users', addUser);
// app.delete('/api/v1/users/:id', deleteUserById);
// app.patch('/api/v1/users/:id', updateUserById);

//////////////////////////// ROUTER CREATION ///////////////////////////

//////////////////////////// TOUR RESOURCE ////////////////////////////

//////////////////////////// USER RESOURCE ////////////////////////////

//////////////////////////////////////////////////////////////////

module.exports = app;
