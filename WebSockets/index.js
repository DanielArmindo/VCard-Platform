const { instrument } = require("@socket.io/admin-ui");
const httpServer = require('http').createServer()
const io = require("socket.io")(httpServer, {
    cors: {
        origin: ["*", "http://localhost:5173", "http://localhost:8000", "http://localhost"],
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true,
    },
    allowEIO3: true
});

instrument(io, {
    auth: false,
    mode: "development",
});

httpServer.listen(8080, () => {
    console.log("listening on *:8080");
});

io.on("connection", (socket) => {
    console.log(`client ${socket.id} has connected`);

    socket.on('loggedIn', function (user) {
        console.log(`client ${socket.id} with id: ${user.id} has logged in`);
        socket.join(user.id)
        if (user.user_type == 'A') {
            socket.join('administrator')
        }
    })

    socket.on('newTransaction', function (newTransaction) {
        // O Administrador criou uma transação externa (Crédito) para um VCARD, emitir para o VCARD que recebeu a transação. 
        if (newTransaction.type == 'C') {
            socket.in(parseInt(newTransaction.vcard)).emit('newTransaction', newTransaction)

            // O utilizador criou uma transação para outro VCARD, emitir para o VCARD que recebeu a transação.
        } else if (newTransaction.type == 'D' && newTransaction.payment_type == 'VCARD') {
            socket.in(parseInt(newTransaction.payment_reference)).emit('newTransaction', newTransaction)
        }
    })

    socket.on('blockedVCard', function (user, blockedVCard) {
        socket.in('administrator').except(user.id).emit('blockedVCard', blockedVCard)
        socket.in(parseInt(blockedVCard.phone_number)).emit('blockedVCard', blockedVCard)
    })

    socket.on('unblockedVCard', function (user, unblockedVCard) {
        socket.in('administrator').except(user.id).emit('unblockedVCard', unblockedVCard)
        socket.in(parseInt(unblockedVCard.phone_number)).emit('unblockedVCard', unblockedVCard)
    })

    socket.on('maxDebitUpdated', function (vcard) {
        socket.in(parseInt(vcard.phone_number)).emit('maxDebitUpdated', vcard)
    })

    socket.on('deletedVCard', function (user, deletedVCard) {
        // Se foi um administrador a eliminar um VCARD, emitir também para o VCARD que foi eliminado.
        if (user.user_type == 'A') {
            socket.in(parseInt(deletedVCard.phone_number)).emit('deletedVCard', deletedVCard)
        }
        // No caso de um utilizador eliminar a sua conta VCARD, emitir para os administradores.
        socket.in('administrator').except(user.id).emit('deletedVCard', deletedVCard)
    })

    socket.on('deletedAdmin', function (user, deletedAdmin) {
        socket.in('administrator').except(user.id).emit('deletedAdmin', deletedAdmin)
    })

    socket.on('moneyRequest', (requester, responder, transactionValue) => {
        socket.in(parseInt(responder)).emit('moneyRequest', requester, responder, transactionValue)
    })

    socket.on('moneyRequestDeclined', (requester, responder, transactionValue) => {
        socket.in(parseInt(requester)).emit('moneyRequestDeclined', requester, responder, transactionValue)
    })
});
