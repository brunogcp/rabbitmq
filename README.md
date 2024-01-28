<div align="center">
  <h3 align="center">RABBITMQ</h3>
  <div>
  <a href="https://bgcp.vercel.app/article/8442d13f-e85d-433e-878f-6472556c0a7a">
  <img src="https://img.shields.io/badge/Download PDF (ENGLISH)-black?style=for-the-badge&logoColor=white&color=000000" alt="three.js" />
  </a>
  </div>
</div>

## 🚀 Introdução ao RabbitMQ


RabbitMQ é um message broker avançado, ideal para sistemas que necessitam de comunicação eficiente e escalável entre componentes. Com Node.js, RabbitMQ facilita o processamento assíncrono de mensagens e tarefas, melhorando significativamente a eficiência e a escalabilidade das aplicações.

### 🌟 Principais Características:

- **⚡ Alto Desempenho e Escalabilidade**: Ideal para o manejo de alto volume de mensagens.
- **🔄 Flexibilidade**: Suporta diversos padrões de mensagens.
- **✔️ Confiabilidade**: Garante a entrega e persistência de mensagens.
- **🌐 Compatibilidade Multi-Linguagem**: Funciona perfeitamente com várias linguagens, incluindo Node.js.

## 🛠️ Instalação

### Windows:

Para instalar o RabbitMQ no Windows, visite a página oficial e siga as instruções: [Instalar RabbitMQ no Windows](https://www.rabbitmq.com/download.html).

### Linux (Ubuntu/Debian):

1. `sudo apt-get install rabbitmq-server` 📦
2. `sudo systemctl start rabbitmq-server` ▶️

### macOS (Homebrew):

1. Instale o Homebrew, se necessário. 🍺
2. `brew install rabbitmq` 📦
3. `brew services start rabbitmq` ▶️
<div style="page-break-after: always;"></div>

## 📊 Uso Básico

### Configuração Inicial:

🔧 Primeiros passos com o RabbitMQ e Node.js:

1. Inicio o projeto node: `npm init -y`.
2. Instale o cliente RabbitMQ para Node.js: `npm install amqplib`.
3. Crie uma conexão básica e uma fila simples no RabbitMQ.

### Exemplo Básico em Node.js:

1. Crio o arquivo index.js
```js
// index.js
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
```
2. Execute o arquivo index.js: `node index.js`
### Publicador (Publisher)
1. Vamos criar um arquivo chamado `publisher.js`:

``` js
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
```

### Inscrever (Subscriber)
1. Vamos criar um arquivo chamado `subscriber.js`:

```js
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

```
### Como Funciona:

1. **Publisher**:
    
    - Conecta-se ao RabbitMQ.
    - Declara uma "exchange" do tipo `fanout`, que transmite as mensagens para todas as filas conhecidas.
    - Publica uma mensagem na "exchange".
2. **Subscriber**:
    
    - Conecta-se ao RabbitMQ.
    - Declara a mesma "exchange".
    - Cria uma fila temporária exclusiva para esse subscriber.
    - Liga a fila à "exchange".
    - Consome mensagens da fila.
### Testando o Exemplo:

1. Execute `subscriber.js` em um terminal para começar a escutar as mensagens.
2. Execute `publisher.js` em outro terminal para enviar uma mensagem.
3. Você verá que a mensagem enviada pelo publicador é recebida pelo inscrito.

## 📈 RabbitMQ para Envio de Emails

### Teoria do Envio de Emails com RabbitMQ:

💡 O RabbitMQ permite que tarefas como o envio de e-mails sejam enfileiradas e processadas de forma assíncrona, evitando sobrecarga no servidor principal e melhorando a eficiência geral da aplicação.

### Motivo para Utilizar o RabbitMQ para Emails:

🚀 Utilizar o RabbitMQ para envio de e-mails permite gerenciar grandes volumes de e-mails de forma eficiente, sem afetar o desempenho da aplicação principal.

### Criação do Sistema de Envio de Emails:

👨‍💻 Implementação de um sistema de envio de e-mails usando RabbitMQ e Node.js.

1. **Configuração**:
   
    - Instale RabbitMQ e Node.js.
    - Instale os pacotes `amqplib` e `nodemailer`: `npm install amqplib nodemailer`
    
2. **Publicador (Publisher)**:

```js
// email-publisher.js
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
```
<div style="page-break-after: always;"></div>


3. **Consumidor (Consumer)**:

```js
// email-consumer.js
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
```

### 🔍 Testes:

1. **Verificação do Envio de Emails**:
    
    - Execute `publisher.js` para enviar um pedido de email.
    - Execute `consumer.js` para processar o pedido e enviar o email.
    - Verifique a saída do console no `consumer.js` para confirmar o envio.

## 🏆 Conclusão

Neste tutorial, exploramos o RabbitMQ em combinação com Node.js, uma dupla poderosa para gerenciar mensagens e tarefas de maneira eficiente e escalável. A utilização do RabbitMQ para processar tarefas demoradas ilustra perfeitamente como ele pode melhorar significativamente a performance de aplicações web.

Espero que este guia tenha sido útil e inspirador, e que você se sinta preparado para incorporar o RabbitMQ em seus próprios projetos. Continue explorando, experimentando e, acima de tudo, se divertindo com a programação! 🐇💻