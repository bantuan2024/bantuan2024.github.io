const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios'); // Tambahkan axios untuk HTTP request
const app = express();
const port = 2626;

// Ganti dengan token bot Telegram milikmu
const botToken = '7207871141:AAGQHPInZWuoHSJzHr5s-kZQr4pM63fizPs';
// Ganti dengan chat ID tujuan (misalnya ID chat pengguna atau grup)
const chatId = '6864784021';

// Middleware untuk parsing application/json
app.use(bodyParser.json());

// Melayani file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rute untuk menerima data formulir
app.post('/submit', (req, res) => {
    const formData = req.body;

    // Lakukan sesuatu dengan data yang diterima
    console.log('Data Sedang di periksa!', formData);

    // Persiapkan pesan yang akan dikirim ke bot Telegram
    const message = `
Data formulir diterima:
Nama: ${formData.nama}
Email: ${formData.email}
Pesan: ${formData.pesan}
    `;

    // Mengirim pesan ke bot Telegram
    axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
    })
    .then(response => {
        console.log('Pesan di terima');
        // Kirim respon ke browser
        res.send('Data berhasil diterima dan sedang di proses');
    })
    .catch(error => {
        console.error('Periksa jaringan', error);
        res.status(500).send('periksa jaringan anda');
    });
});

// Menjalankan server di port yang ditentukan
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});