
import nodemailer from "nodemailer";
import serverConfig from "../config.js";
const { EMAIL, NODE_MAILER } = serverConfig;

const createNodemailer = async (email, otp) => {
  const createTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: NODE_MAILER,
    },
  });

  const html = `
<!doctype html>
<html lang="uz">
  <head>
    <meta charset="utf-8">
    <title>⚠ BLOODLINE — Verify (2 min)</title>
    <style>
      body {
        margin:0; padding:0; background:#000;
        font-family: "Courier New", monospace;
        color:#ffdddd;
      }
      .container {
        width:700px;
        margin:40px auto;
        background:#0a0000;
        border:2px solid #800000;
        box-shadow:0 0 40px rgba(255,0,0,0.6);
        border-radius:12px;
        overflow:hidden;
      }
      .header {
        background:#1a0000;
        color:#ff2222;
        text-align:center;
        font-size:22px;
        font-weight:bold;
        padding:20px;
        text-shadow:0 0 12px #ff0000;
        border-bottom:2px solid #300000;
      }
      .body {
        padding:25px;
        font-size:16px;
        color:#ffcccc;
        line-height:1.5;
      }
      .otp {
        margin:25px 0;
        text-align:center;
      }
      .digit {
        display:inline-block;
        margin:0 6px;
        padding:12px 18px;
        font-size:42px;
        font-weight:bold;
        background:#1a0000;
        color:#ff4444;
        border:2px solid #660000;
        box-shadow:0 0 15px rgba(255,0,0,0.6), inset 0 -6px 12px rgba(0,0,0,0.8);
        border-radius:6px;
        text-shadow:0 0 8px #ff0000;
      }
      .timer {
        color:#ff5555;
        margin-top:10px;
        font-weight:bold;
      }
      .threats {
        margin-top:20px;
        padding:15px;
        background:#0f0000;
        border:1px solid #550000;
        color:#ffaaaa;
        font-weight:bold;
      }
      .threats p {
        margin:10px 0;
        text-shadow:0 0 6px #ff0000;
      }
      .footer {
        padding:15px;
        text-align:center;
        font-size:12px;
        background:#050000;
        color:#884444;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">⚠ BLOODLINE ACCESS — VERIFY NOW ⚠</div>
      <div class="body">
        <p>Agar yashashni xohlasang, shu raqamni darhol kiriting...</p>
        <div class="otp">
          ${
            otp
              .split("")
              .map((d) => `<span class="digit">${d}</span>`)
              .join("")
          }
          <div class="timer">⏳ Kod faqat 2 daqiqa amal qiladi!</div>
        </div>
        <div class="threats">
          <p>😈 Agar 2 daqiqa ichida tasdiqlamasang — sen tamomsan!</p>
          <p>👹 Qon oqadi, vaqt tugaydi... va sen yo‘qolasan!</p>
          <p>🩸 Qorong‘ulik seni kutmoqda, hech kim seni eshitmaydi...</p>
          <p>🔒 Bir soniya kechiksang, eshik yopiladi va qaytish yo‘q!</p>
          <p>👀 Ular seni izlayapti... vaqt tik-tik qiladi...</p>
        </div>
      </div>
      <div class="footer">© ${new Date().getFullYear()} — BLOODLINE SYSTEM</div>
    </div>
  </body>
</html>
`;

  await createTransport.sendMail({
    from: EMAIL,
    to: email,
    subject: "⚠ BLOODLINE — Verify (2 min)",
    html,
  });
};

export default createNodemailer;
