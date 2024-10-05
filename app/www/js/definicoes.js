document.getElementById("prevBtn").addEventListener("click", function () {
    window.location.replace("menu.html");
});
document.getElementById("deleteAccountBtn").addEventListener("click", function(){
    window.location.replace("deleteAccount.html");
});

document.getElementById("btn-spare-change").addEventListener("change", function () {
    changeSpareChangeStatus(this.checked ? 1 : 0);
});

document.getElementById("btn-notifications").addEventListener("change", function () {
    changeNotificationsStatus(this.checked ? 1 : 0);
});

document.getElementById("logout").addEventListener("click", function () {
    sair();
});

document.addEventListener("deviceready", function () {
    getSpareChangeStatus();
    getNotificationsStatus();
    document.getElementById("btn-spare-change").disabled = false;
    document.getElementById("btn-notifications").disabled = false;
}, false);

async function getSpareChangeStatus() {
    var response = { data: null, msg: "" };

    response = await getPiggyBankSpareChangeStatus();

    if (response.msg != 'OK') {
        showToastMessage('Erro ao obter estado do mealheiro', color.danger, color.light);
        return;
    }

    if (response.data.Mealheiro.spare_change == true)
        document.getElementById('btn-spare-change').checked = true;
    else
        document.getElementById('btn-spare-change').checked = false;
}

async function changeSpareChangeStatus(status) {
    let response = { data: null, msg: "", status: "" };

    response = await updatePiggyBankSpareChangeStatus(status);

    if (response.status != '200') {
        showToastMessage('Erro ao alterar estado do mealheiro', color.danger, color.light);
        return;
    }

    showToastMessage(response.msg, color.info, color.light);
}

function getNotificationsStatus() {
    let status = localStorage.getItem('receiveNotifications');
    if (status == null || status == undefined) {
        localStorage.setItem('receiveNotifications', 0);
        status = 0;
    }

    console.log("Notification Status: Definicoes.js " + localStorage.getItem('receiveNotifications'));

    if (status == 1)
        document.getElementById('btn-notifications').checked = true;
    else
        document.getElementById('btn-notifications').checked = false;
}

async function changeNotificationsStatus(status) {
    cordova.plugins.foregroundService.stop();

    let response = await getUser();
    user = response.data;

    console.log("New Notification Status: " + status);
    localStorage.setItem('receiveNotifications', status);

    cordova.plugins.foregroundService.start('Vcard Notifications', 'Background Service', 'myicon', 3, 10, user, status);
}

async function sair() {
    let response = { data: null, msg: "", status: "" };

    response = await logout();

    if (response.msg != 'OK') {
        showToastMessage('Erro ao sair da aplicação!', color.danger, color.light);
        return;
    }

    window.resolveLocalFileSystemURL('file:///data/data/io.cordova.hellocordova/cache/notifications/transaction.json', function (fileEntry) {
        fileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function () {
                console.log('File content cleared successfully.');
                handleData();
            };

            fileWriter.onerror = function (e) {
                console.error('Error clearing file: ' + e.toString());
            };

            // Truncate the file to clear its content
            fileWriter.truncate(0);
        }, function (error) {
            console.error('Error creating FileWriter: ' + error.message);
        });
    }, function (error) {
        console.error('Error resolving file URL: ' + error.message);
    });

    function handleData() {
        window.location.replace("index.html");
    }
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