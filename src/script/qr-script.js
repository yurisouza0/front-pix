document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket("wss://back-pix.onrender.com");

    socket.onopen = () => {
        console.log('Conexão WebSocket estabelecida!');


        const token = localStorage.getItem('authToken');
        if (token) {

            socket.send(JSON.stringify({ type: 'auth', token }));
            console.log('Token enviado para autenticação:', token);
        } else {
            console.error('Token não encontrado no localStorage. Você precisa fazer login.');
        }
    };


    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Mensagem recebida do servidor:', data);


            if (data.mensagem === 'Autenticação bem-sucedida!') {

                socket.send(JSON.stringify({ type: 'fetch-qr' }));
            }


            if (data.qrCode) {
                const qrCodeImg = document.getElementById('qr-code');
                if (qrCodeImg) {
                    qrCodeImg.src = data.qrCode; 
                    console.log('QR Code atualizado no frontend!');
                } else {
                    console.error('Elemento <img> com id "qr-code" não encontrado!');
                }
            }


            if (data.mensagem && !data.qrCode) {
                console.log('Mensagem do servidor:', data.mensagem);
                const errorElement = document.getElementById('error-message');
                errorElement.textContent = data.mensagem || 'Erro desconhecido.';
            }
        } catch (error) {
            console.error('Erro ao processar mensagem do servidor:', error);
        }
    };

    socket.onclose = () => {
        console.warn('Conexão WebSocket fechada.');
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = 'Conexão perdida com o servidor. Tente novamente mais tarde.';
    };

    socket.onerror = (error) => {
        console.error('Erro na conexão WebSocket:', error);
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = 'Erro na conexão com o servidor. Verifique sua rede.';
    };
});
