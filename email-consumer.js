const amqp = require('amqplib');
const nodemailer = require('nodemailer');

const emailQueue = "email_queue";

async function startConsumer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue(emailQueue, { durable: true });
    console.log("🔍 Aguardando pedidos de email...");

    channel.consume(emailQueue, async message => {
        const emailDetails = JSON.parse(message.content.toString());
        console.log("📩 Enviando email:", emailDetails);

        // Configuração do Nodemailer para enviar o email
        let transporter = nodemailer.createTransport({
		    host: "smtp.example.com",   // Substitua pelo host do seu provedor SMTP
		    port: 587,                  // Porta para SMTP seguro, use 465 para SSL
		    secure: false,              // true para 465, false para outras portas
		    auth: {
		        user: "seuemail@example.com",  // Seu endereço de e-mail
		        pass: "suasenha"              // Sua senha de e-mail
		    },
		    tls: {
		        rejectUnauthorized: false  // Necessário para alguns servidores que usam certificados autoassinados
		    }
		});

        let info = await transporter.sendMail({
            from: '"Nome do Remetente" <seuemail@example.com>',
            to: emailDetails.to,
            subject: emailDetails.subject,
            text: emailDetails.body
        });

        console.log("Email enviado:", info.messageId);
        channel.ack(message);
    });
}

startConsumer();
