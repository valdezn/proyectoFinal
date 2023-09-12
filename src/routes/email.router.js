import { Router } from "express";
import nodemailer from 'nodemailer'

const router = Router();


const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.EMAIL_PASS
    },
});

router.get("/", async (req, res) => {
    let result = await transport.sendMail({
      from: "valdeznoelia26@gmail.com",
      to: "valdeznoelia26@gmail.com",
      subject: "correo test",
      html: `
      <div style='color:blue'>
        <h1>Reestablezca su contraseña</h1>
        <button id="restart">Restart</button>
      </div>`, ///el botón funciona sólo en pc
    });
    res.send(result);
  });

export default router