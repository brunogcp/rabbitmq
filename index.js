const amqp = require('amqplib');

async function connect() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queueName = "simple_queue";

    await channel.assertQueue(queueName, { durable: true // A fila não será perdida mesmo que o RabbitMQ reinicie 
    });
    console.log('🎉 Conectado ao RabbitMQ e fila criada.');
}

connect();