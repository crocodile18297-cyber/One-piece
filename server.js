import express from "express";
import http from "http";

const app = express();
app.disable("x-powered-by");

const page = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#101827">
  <title>Проект остановлен</title>
  <style>
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(ellipse at top,#263b58,#101827 65%);color:#f4f7fb;font:16px/1.55 system-ui,-apple-system,Segoe UI,sans-serif}
    main{width:min(100%,520px);text-align:center;padding:40px 28px;border:1px solid #40516b;border-radius:22px;background:#172337e8;box-shadow:0 24px 80px #0006}
    .logo{font-size:12px;letter-spacing:.2em;color:#9eafc8}
    h1{margin:18px 0 10px;font-size:clamp(28px,7vw,42px)}
    p{margin:0;color:#c2ccdb}
    small{display:block;margin-top:28px;color:#7f91aa}
  </style>
</head>
<body>
  <main>
    <div class="logo">ONE PIECE · GRAND ARENA</div>
    <h1>Проект остановлен</h1>
    <p>Игровой сервер и онлайн-матчи отключены. Исходный код проекта сохранён.</p>
    <small>Страница технического отключения</small>
  </main>
</body>
</html>`;

app.use((req, res) => {
  res.status(410);
  res.set("Cache-Control", "no-store, max-age=0");
  res.type("html").send(page);
});

const server = http.createServer(app);
const port = Number(process.env.PORT) || 3000;
server.listen(port, "0.0.0.0", () => {
  console.log("ONE PIECE: GRAND ARENA is shut down; source code is preserved.");
});
