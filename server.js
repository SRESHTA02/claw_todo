const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./auth');
const todoRoutes = require('./todos');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
