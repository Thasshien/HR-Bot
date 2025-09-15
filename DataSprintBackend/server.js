const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
const axios = require("axios")
const { loginAdmin } = require("./controllers/loginController")
const { slaChecker } = require("./agents/slaChecker")

app.use(cors({
  origin: 'http://localhost:5173',// frontend is allowed as whitlable site
  credentials: true
}));

loginAdmin();
slaChecker();

const port = process.env.PORT || 3000;

app.use('/api/emp', require('./routes/empRouter'));
app.use('/api', require('./routes/loginRoutes'));
app.use('/api/hr', require('./routes/hrRouter'));
app.use('/api/ask', require('./routes/rasaRouter'));

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
