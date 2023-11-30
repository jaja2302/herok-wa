const express = require('express');
const venom = require('venom-bot');
const venomOptions = require('./venom-options.js');

const app = express();
const port = 3000;

let client = null;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Venom bot
venom.create(venomOptions)
    .then((_client) => {
        client = _client;
        startBot();
    })
    .catch((err) => {
        console.error('Failed to initialize Venom:', err);
    });

// Start the bot and set up message event handler
function startBot() {
    client.onMessage((message) => {
        // Handle incoming messages here
        // For example, reply to all incoming messages with 'Hi!'
        const sender = message.from;
        client.sendText(sender, 'Hi!');
    });
}

// Endpoint to send WhatsApp messages
app.post('/send-whatsapp', async (req, res) => {
    const { number, text } = req.body;

    if (!number || !text) {
        return res.status(400).json({ error: 'Please provide both number and text' });
    }

    try {
        await client.sendText(`${number}@c.us`, text);
        return res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Failed to send message:', error);
        return res.status(500).json({ error: 'Failed to send message' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
