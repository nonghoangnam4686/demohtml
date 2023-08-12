const express = require("express");
const app = express();
const mysql = require("mysql");
const ejs = require("ejs");

const db = mysql.createConnection({
    host: "dangdatdatabase.cixu2ufy0ujz.ap-southeast-2.rds.amazonaws.com",
    port: "3306",
    user: "DatDang", 
    password: "Dat1234nam",
    database: "demoDangDat",
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.log("Error connecting to the database:", err.message);
        return;
    }
    console.log("Database is connected");
});

// Set EJS as the view engine
app.set("view engine", "ejs");

app.use(express.static("public"));
// Route to display the data
app.get("/", (req, res) => {
    const query = "SELECT * FROM users"; // Replace 'users' with your table name

    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching data from the database:", err.message);
            return;
        }
        res.render("index", { users: result }); // Pass the fetched data to the "index.ejs" template
    });
});

// Route to display the search page

app.get("/search", (req, res) => {
    res.render("search");
});

// Route to handle search based on keyword
app.get("/search/:keyword", (req, res) => {
    const keyword = req.params.keyword;
    const query = "SELECT * FROM users WHERE name LIKE ?"; // Assuming the column for user names is "name"

    db.query(query, [`%${keyword}%`], (err, result) => {
        if (err) {
            console.error("Error fetching data from the database:", err.message);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        res.json(result);
    });
});

app.use(express.urlencoded({ extended: true }));

// Route to display the registration form
app.get("/register", (req, res) => {
    res.render("register");
});

// Route to handle user registration form submission
app.post("/register", (req, res) => {
    const { name, email, age, gender, country } = req.body;
    const insertQuery = "INSERT INTO users (name, email, age, gender, country) VALUES (?, ?, ?, ?, ?)";

    db.query(insertQuery, [name, email, age, gender, country], (err, result) => {
        if (err) {
            console.error("Error inserting data into the database:", err.message);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        console.log("User registered:", name);
        res.redirect("/"); // Redirect to the homepage or any other page you prefer
    });
});

app.get("/TX_report", (req, res) => {
    res.render("TX_report");
});

app.get("/CA_report", (req, res) => {
    res.render("CA_report");
});

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});