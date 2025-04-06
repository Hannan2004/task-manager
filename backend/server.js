const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
