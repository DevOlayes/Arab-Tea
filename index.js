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
app.post('/submit-order', (req, res) => {
    const { packs, name, state, address, email, phone, whatsapp } = req.body;
    const price = calculatePrice(packs); // Calculate the price based on the number of packs

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
        text: `Number of Packs: ${packs}\nPrice: ₦${price}\nName: ${name}\nState: ${state}\nAddress: ${address}\nEmail: ${email}\nPhone: ${phone}\nWhatsApp: ${whatsapp}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // If there's an error, send a failure response
            return res.status(500).json({ success: false, message: 'Error sending email: ' + error.message });
        }
        // Send success response if email is sent
        res.json({ success: true, message: 'Order placed successfully!', price: price });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
