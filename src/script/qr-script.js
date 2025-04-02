document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://localhost:3300'); // Substitua pela URL do servidor WebSocket

    socket.onopen = () => {
        console.log('Conexão WebSocket estabelecida!');
        // Enviar uma solicitação para o QR Code (se necessário)
        socket.send(JSON.stringify({ type: 'fetch-qr' }));
    };

socket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);

        // Trata autenticação bem-sucedida
        if (data.mensagem === 'Autenticação bem-sucedida!') {
            console.log('Autenticação realizada com sucesso!');
            socket.send(JSON.stringify({ type: 'fetch-qr' })); // Solicita o QR Code
        }

        // Exibe o QR Code recebido
        if (data.qrCode) {
            const qrCodeImg = document.getElementById('qr-code');
            if (qrCodeImg) {
                qrCodeImg.src = data.qrCode;
                console.log('QR Code atualizado no frontend!');
            } else {
                console.error('Elemento <img> com id "qr-code" não encontrado!');
            }
        }
    } catch (error) {
        console.error('Erro ao processar mensagem do servidor:', error);
    }
};



    socket.onclose = () => {
        console.log('Conexão WebSocket fechada.');
    };
});
