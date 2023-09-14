const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const port = 3000;

// Serve static files from a directory (e.g., 'public' or 'js')
app.use(express.static('C:\\Users\\rwv12\\OneDrive\\Desktop\\Work\\JS_PRAC-main'));

// Create a new SQLite database connection
const db = new sqlite3.Database('./test.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});

app.use(express.urlencoded({ extended: true }));

app.post('/submit-form-wishsimulator', (req, res) => {
    // Handle form submission for wish simulator
    const { x, n, p } = req.body;

    // Debugging logs
    console.log(`Wish Simulator Form data received: Successes Desired=${x}, Number of Wishes=${n}, Chance for Specific Rarity in Banner=${p}`);

    // Calculate probability here if needed
    const calculatedProbability = calculateProbability(x, n, p); // Replace with your actual calculation function

    // Send the calculated result back to the client
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ result: calculatedProbability });
});


// Handle form submission for form.html
app.post('/submit-form', (req, res) => {
    // Handle form submission for the original form
    const { uid, name, charPulled, wishesUsed } = req.body;

    // Debugging logs
    console.log(`Original Form data received: UID=${uid}, Name=${name}, Character=${charPulled}, Wishes=${wishesUsed}`);

    // Insert data into the SQLite database
    const sql = 'INSERT INTO test_data (uid, name, charPulled, wishesUsed) VALUES (?, ?, ?, ?)';
    db.run(sql, [uid, name, charPulled, wishesUsed], (err) => {
        if (err) {
            console.error(err.message);
            res.statusCode = 500;
            res.end('Server Error');
        } else {
            console.log('Original Form data inserted successfully');
            res.setHeader('Content-Type', 'text/html');
            res.end('Original Form data submitted successfully');
        }
    });
});

app.get('/', (req, res) => {
    // Serve form.html for the root route
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.get('/contact.html', (req, res) => {
    // Serve contact.html
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/about.html', (req, res) => {
    // Serve about.html
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/wishsimulator.html', (req, res) => {
    // Serve wishsimulator.html
    res.sendFile(path.join(__dirname, 'wishsimulator.html'));
});

// Handle 404 for all other URLs
app.use((req, res) => {
    res.statusCode = 404;
    res.end('Not Found');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
