require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const { JSDOM } = require("jsdom");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files from the 'assets' directory
app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit-order', (req, res) => {
    const { packs, name, address, email, phone, whatsapp } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `${name} <${email}>`,
        to: process.env.RECIPIENT_EMAIL,
        subject: 'New Order Submission',
        text: `Number of Packs: ${packs}\nName: ${name}\nAddress: ${address}\nEmail: ${email}\nPhone: ${phone}\nWhatsApp: ${whatsapp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error sending email: ' + error.message });
        }
        res.json({ success: true, message: 'Order placed successfully!' });
    });
});

// JSDOM Manipulation (for demonstration purposes)
const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
const document = dom.window.document;

var link = document.createElement("link");
link.rel = "stylesheet";
link.href = "./assets/css/styles.css";
document.head.appendChild(link);

console.log(document.documentElement.outerHTML);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
