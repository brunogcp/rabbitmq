const amqp = require('amqplib');

async function startSubscriber() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchangeName = "logs";

        await channel.assertExchange(exchangeName, 'fanout', {
            durable: false
        });

        const q = await channel.assertQueue('', {
            exclusive: true
        });

        console.log("🔍 Aguardando por mensagens em", q.queue);
        channel.bindQueue(q.queue, exchangeName, '');

        channel.consume(q.queue, message => {
            if (message.content) {
                console.log("📩 Mensagem recebida:", message.content.toString());
            }
        }, {
            noAck: true
        });
    } catch (error) {
        console.error("Erro:", error);
    }
}

startSubscriber();