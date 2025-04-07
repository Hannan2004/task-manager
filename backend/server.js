const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB();

// Configure CORS
const corsOptions = {
    origin: [
        'https://task-manager-frontend-container-911407792100.us-central1.run.app', // Frontend URL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use('/api/tasks', require('./routes/taskRoutes'));

// Use the PORT environment variable or default to 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));