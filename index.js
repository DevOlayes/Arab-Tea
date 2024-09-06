require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files from the 'assets' directory
app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Pricing logic based on pack quantity
const calculatePrice = (packs) => {
    let price;
    switch (packs) {
        case '1':
            price = 15000;
            break;
        case '2':
            price = 25000;
            break;
        case '3':
            price = 30000; // Buy 2, get 1 free
            break;
        case '4':
            price = 39000; // Buy 3, get 1 free
            break;
        default:
            price = 0; // If no valid pack is selected
    }
    return price;
};

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.use(bodyParser.json());

app.post('/submit-order', (req, res) => {
    const { packs, price, name, state, address, email, phone, whatsapp } = req.body;

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Replace with your Gmail address
            pass: process.env.EMAIL_PASS   // Replace with your Gmail password or App Password
        }
    });
    
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'your-email@gmail.com', // Send the order details to your Gmail
        subject: 'New Order Received',
        text: `
            New Order Details:
            Name: ${name}
            Packs: ${packs}
            Price: ${price}
            State: ${state}
            Address: ${address}
            Email: ${email}
            Phone: ${phone}
            WhatsApp: ${whatsapp}
        `
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.json({ success: false, message: "Error sending email: " + error.message });
        }
        return res.json({ success: true, message: "Order submitted successfully!" });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
