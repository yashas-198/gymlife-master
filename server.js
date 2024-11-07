// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gymSubscriptionDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a schema for the enrollment data
const enrollmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    plan: { type: String, required: true },
});

// Create a model for the enrollment
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory

// Route to handle enrollment form submission
app.post('/enroll', async (req, res) => {
    const { name, email, plan } = req.body;

    try {
        // Save data to MongoDB
        const newEnrollment = new Enrollment({ name, email, plan });
        await newEnrollment.save();

        console.log(`Enrollment details received: Name - ${name}, Email - ${email}, Plan - ${plan}`);
        res.json({ message: 'Details submitted successfully!' });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ message: 'Error submitting details' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
