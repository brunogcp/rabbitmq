const amqp = require('amqplib');

const emailQueue = "email_queue";

async function sendEmailRequest(emailDetails) {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue(emailQueue, { durable: true });
    channel.sendToQueue(emailQueue, Buffer.from(JSON.stringify(emailDetails)), { persistent: true });

    console.log("📧 Pedido de email enviado:", emailDetails);
    setTimeout(() => {
        connection.close();
    }, 500);
}

// Exemplo de detalhes do email
const emailDetails = {
    to: "destinatario@example.com",
    subject: "Assunto do Email",
    body: "Corpo do Email"
};

sendEmailRequest(emailDetails);