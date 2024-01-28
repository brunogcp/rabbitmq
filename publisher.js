const amqp = require('amqplib');

async function publishMessage() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchangeName = "logs";
        const msg = "Hello World!";

        await channel.assertExchange(exchangeName, 'fanout', {
            durable: false
        });

        channel.publish(exchangeName, '', Buffer.from(msg));
        console.log("📤 Mensagem enviada:", msg);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error("Erro:", error);
    }
}

publishMessage();