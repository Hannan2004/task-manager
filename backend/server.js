const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB();

// Configure CORS
app.use(cors({
    origin: [
      'https://task-manager-frontend-911407792100.us-central1.run.app',
      'http://localhost:3000'  // For local development
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));