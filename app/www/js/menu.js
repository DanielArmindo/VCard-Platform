var divLastTransactionDetails = document.getElementById("last-transaction-details-div");
var socket;

document.addEventListener("deviceready", async function () {
    getVCardInformation();
    showLastTransaction();
    getNotifications();

    var params = new URLSearchParams(window.location.search);
    var showMessage = params.get('showMessage');
    var transaction = params.get('transaction');
    transaction = JSON.parse(atob(transaction));

    if (showMessage) {
        showToastMessage('Transação efetuada', color.success, color.light);
        params.delete('showMessage');
        showMessage = false;

        iniciarSocket();
        let response = await getUser();
        user = response.data;
        await emitLogin(user);
        await emitNewTransaction(transaction);
    }
}, false);

document.getElementById("btn-enviar-dinheiro").addEventListener("click", function () {
    window.location.href = "contactos.html";
});

document.getElementById("btn-lista-transacoes").addEventListener("click", function () {
    window.location.href = "transactions.html";
});

document.getElementById("btn-mealheiro").addEventListener("click", function () {
    window.location.href = "mealheiro.html";
});

document.getElementById("btn-definicoes").addEventListener("click", function () {
    window.location.href = "definicoes.html";
});
document.getElementById("btn-notifications").addEventListener("click", function () {
    window.location.href = "mensagens.html";
});


async function getVCardInformation() {
    var response = { data: null, msg: "" };

    response = await getVCard();
    if (response.msg == 'OK') {
        document.getElementById("saldo").innerHTML = Number(response.data.data.balance).toFixed(2) + " €";
    } else {
        document.getElementById("saldo").innerHTML = "0.00 €";
    }

    response2 = await getSavingsInPiggyBank()

    if (response2.msg == 'OK') {
        document.getElementById("mealheiro").innerHTML = Number(response2.data.Mealheiro.balance).toFixed(2) + " €";
    } else {
        document.getElementById("mealheiro").innerHTML = "0.00 €";
    }
}


async function showLastTransaction() {
    var response = { data: null, msg: "" };

    response = await getLastTransaction();

    if (response.msg == "OK") {
        document.getElementById("entidade-ultima-transacao").innerHTML = response.data.data.pair_vcard != null ? formatPhoneNumber(response.data.data.pair_vcard) : response.data.data.payment_reference;

        if (response.data.data.type == "C") {
            document.getElementById("valor-ultima-transacao").classList.add("text-success");
            document.getElementById("valor-ultima-transacao").innerHTML = "+" + response.data.data.value + " €";
            document.getElementById("tipo-transacao-ultima-transacao").innerHTML = "Crédito";
        } else {
            document.getElementById("valor-ultima-transacao").classList.add("text-danger");
            document.getElementById("valor-ultima-transacao").innerHTML = "-" + response.data.data.value + " €";
            document.getElementById("tipo-transacao-ultima-transacao").innerHTML = "Débito";
        }
        document.getElementById("saldo-antes-ultima-transacao").innerHTML = response.data.data.old_balance + " €";
        document.getElementById("saldo-depois-ultima-transacao").innerHTML = response.data.data.new_balance + " €";
        document.getElementById("tipo-pagamento-ultima-transacao").innerHTML = response.data.data.payment_type;
        document.getElementById("referencia-ultima-transacao").innerHTML = response.data.data.payment_reference;
        document.getElementById("descricao-ultima-transacao").innerHTML = response.data.data.description ? response.data.data.description.substring(0, 103) : "Sem descrição";
        document.getElementById("data-ultima-transacao").innerHTML = response.data.data.date;

        divLastTransactionDetails.classList.remove("d-flex");
        divLastTransactionDetails.classList.remove("align-items-center");

        for (var i = 0; i < divLastTransactionDetails.children.length; i++) {
            divLastTransactionDetails.children[i].classList.remove("d-none");
        }

        var msgSemTransacoes = document.getElementById("msg-sem-transacoes");
        msgSemTransacoes.classList.add("d-none");
    }
}

function getNotifications() {
    var notificationsToRead = 0;

    window.resolveLocalFileSystemURL('file:///data/data/io.cordova.hellocordova/cache/notifications/transaction.json', function (fileEntry) {
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function (e) {
                console.log(this.result);

                handleData(this.result);
            };

            reader.readAsText(file);

        }, errorHandler);
    }, errorHandler);

    function errorHandler(e) {
        console.error('Error: ' + e.message);
    }

    function handleData(notifications) {
        console.log("Printing notifications from menu.js");
        console.log(notifications);

        var notificationsJsonStr = '[' + notifications.replace(/}{/g, '},{') + ']';
        console.log("------------------");
        console.log("Printing notificationsJsonStr from menu.js");
        console.log(notificationsJsonStr);

        var notificationsJson = JSON.parse(notificationsJsonStr);

        console.log("Total notifications: " + notificationsJson.length);

        // See the notifications that are different from the ones in the local storage and add them to the local storage
        var localNotifications = JSON.parse(localStorage.getItem('notifications'));
        if (localNotifications != null) {
            notificationsJson.forEach(notification => {
                var exists = false;
                localNotifications.forEach(localNotification => {
                    if (notification.id == localNotification.id) {
                        exists = true;
                    }
                });
                if (!exists) {
                    localNotifications.push(notification);
                }
            });
            localStorage.setItem('notifications', JSON.stringify(localNotifications));
        } else {
            localStorage.setItem('notifications', JSON.stringify(notificationsJson));
        }
        localNotifications = JSON.parse(localStorage.getItem('notifications'));

        localNotifications.forEach(notification => {
            if (!notification.isRead)
                notificationsToRead++;
        });

        console.log("Printing notificationsToRead from menu.js");
        console.log(notificationsToRead);

        if (notificationsToRead == 0) {
            document.getElementById('no-notifications-to-read').classList.remove('d-none');
            document.getElementById('notifications-to-read').classList.add('d-none');
        } else {
            document.getElementById('no-notifications-to-read').classList.add('d-none');
            document.getElementById('notifications-to-read').classList.remove('d-none');
        }
    }
}

function formatPhoneNumber(phoneNumber) {
    if (phoneNumber.length !== 9) {
        return phoneNumber;
    }

    const formattedNumber = phoneNumber.slice(0, 3) + " " + phoneNumber.slice(3, 6) + " " + phoneNumber.slice(6);
    return formattedNumber;
}

function showToastMessage(msg, bgColor, textColor) {
    Toastify({
        text: msg,
        duration: 4000,
        position: "center",
        style: {
            color: textColor,
            background: bgColor,
            boxShadow: "0 0 10px " + bgColor,
        }
    }).showToast();
}

var color = {
    success: '#28a745',
    danger: '#dc3545',
    primary: '#007bff',
    info: '#17a2b8',
    secondary: '#6c757d',
    warning: '#ffc107',
    light: '#f8f9fa',
    dark: '#343a40'
};


async function iniciarSocket() {
    if (socket) {
        console.log('Socket já iniciado')
        return;
    }
    try {
        socket = await io('http://172.22.21.90:8080');
        console.log('Socket iniciado')
    } catch (e) {
        console.log(e)
    }
}

async function emitNewTransaction(transaction) {
    await socket.emit('newTransaction', (transaction));
}

async function emitLogin(user) {
    try {
        await socket.emit('loggedIn', user);
        console.log('Login emitido')
    } catch (e) {
        console.log(e)
    }
}