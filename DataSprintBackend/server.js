const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const port = process.env.PORT || 3000;

connectDB();

// existing routes
app.use('/api/emp', require('./routes/empRouter'));
app.use('/api/hr', require('./routes/hrRouter'));
app.use('/api/ask', require('./routes/ollamaRouter'));

// test route
app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
