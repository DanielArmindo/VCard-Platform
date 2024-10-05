const params = new URLSearchParams(window.location.search);
var inputPin = document.getElementById('pin');
var phoneNumber = params.get('phone');
var socket;

document.addEventListener("deviceready", function () {
    const contactName = params.get('contactname');
    const value = params.get('value');
    const description = params.get('description');
    const moneyInput = params.get('value');

    const receiverName = document.getElementById('nomeDestinatario');
    const receiverNumber = document.getElementById('numeroDestinatario');
    const valueToSend = document.getElementById('valor');
    const descriptionInfo = document.getElementById('description');

    receiverName.innerText = contactName;
    receiverNumber.innerText = phoneNumber;
    valueToSend.innerText = (value || "0.00") + ' €';
    descriptionInfo.innerText = description || "Sem descrição";

    document.getElementById('prevBtn').addEventListener('click', function () {
        phoneNumber = encodeURIComponent(phoneNumber);
        window.location.replace(`sendMoney.html?phone=${phoneNumber}&contactname=${contactName}&value=${moneyInput}&description=${description}`);
    }, false);

    inputPin.addEventListener('blur', validatePin, false);

    const btnConfirmar = document.getElementById('btnConfirmar');
    btnConfirmar.addEventListener('click', function () {
        confirmTransaction('VCARD', unformatPhoneNumber(phoneNumber), value, inputPin.value, description);
    }, false);

}, false);

function unformatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/\s/g, "").slice(4, 13)
}

async function confirmTransaction(type, receiver, value, confirmation_code, description) {
    if (!validatePin()) {
        return;
    }

    var response = { data: null, msg: "", status: "" };
    response = await trasaction(type, receiver, value, confirmation_code, description);

    if (response.msg) {
        if (response.msg == "OK") {
            let transaction = response.data.data;
            transaction = btoa(JSON.stringify(transaction));
            window.location.replace(`menu.html?showMessage=true&transaction=${transaction}`);
        } else {
            showToastMessage(`${response.msg}`, color.danger, color.light);
        }
    } else {
        if (response.status == 401) { // Unauthorized
            showToastMessage("Pin de confirmação errado!", color.danger, color.light);
        } else if (response.status == 404) { // Not Found
            showToastMessage("O destinatário não tem vCard", color.danger, color.light);
        } else if (response.status == 500) { // Internal Server Error
            showToastMessage("Ocorreu um erro interno no servidor", color.danger, color.light);
        } else if (response.status == 422) { // Unprocessable Entity
            showToastMessage("Campos de entrada inválidos!", color.danger, color.light);
        }
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

function validatePin() {
    var errorMessage = document.getElementById('pin-error-message');
    if (inputPin.value.length != 3) {
        errorMessage.innerHTML = 'O pin deve ter 3 dígitos.';
        return false;
    }

    if (containNonNumeric(inputPin.value)) {
        errorMessage.innerHTML = 'O pin deve conter apenas números.';
        return false;
    }

    errorMessage.innerHTML = '';
    return true;
}

function containNonNumeric(inputString) {
    const nonNumericRegex = /[^0-9]/;
    return nonNumericRegex.test(inputString);
}