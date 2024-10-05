const params = new URLSearchParams(window.location.search);
var phoneNumber = params.get('phone');

document.addEventListener("deviceready", function () {
    const contactName = params.get('contactname');
    const value = params.get('value');
    const description = params.get('description');
    const showMessage = params.get('showMessage');

    const inputDescription = document.getElementById('description');
    const inputMoney = document.getElementById('moneyInput');
    inputMoney.addEventListener('blur', validateMoneyInput, false);

    if (showMessage) {
        showToastMessage('Contacto criado com sucesso!', color.success, color.light);
    }

    document.getElementById('nomeDestinatario').innerText = contactName;
    document.getElementById('numeroDestinario').innerText = phoneNumber;

    fillFields(value, description);

    const btn = document.getElementById('btnAvançar');
    btn.addEventListener('click', function () {
        if (!validateMoneyInput()) return;
        phoneNumber = encodeURIComponent(phoneNumber);
        window.location.replace(`confirm_transaction.html?phone=${phoneNumber}&contactname=${contactName}&value=${inputMoney.value}&description=${inputDescription.value}`);
    });

}, false);

document.getElementById('prevBtn').addEventListener('click', function () {
    window.location.replace('contactos.html');
}, false);

function validateMoneyInput() {
    var errorMessage = document.getElementById('error-message');
    const moneyInput = document.getElementById('moneyInput');
    //contains non numeric characters
    if (containNonNumeric(moneyInput.value)) {
        errorMessage.innerHTML = 'O valor deve ser um número maior que 0.';
        return false;
    }

    if (moneyInput.value <= 0 || moneyInput.value == '') {
        errorMessage.innerHTML = 'O valor deve ser um número maior que 0.';
        return false;
    }
    errorMessage.innerHTML = '';
    return true;
}

function containNonNumeric(inputString) {
    const nonNumericRegex = /^\d+(\.\d{0,2})?$/;
    return !nonNumericRegex.test(inputString);
}

function fillFields(value, description) {
    const moneyInput = document.getElementById('moneyInput');
    const descriptionInput = document.getElementById('description');

    moneyInput.value = value;
    descriptionInput.value = description || '';
}

function adjustWidth(input) {
    if (input.value.length < 4) { 
        input.style.width = 4 + "ch";
        return;
    }

    if (input.value.length > 7) {
        input.value = input.value.slice(0, 7);
        return;
    }

    if (containNonNumeric(input.value)) {
        input.value = input.value.slice(0, input.value.length - 1);
        return;
    }

    input.style.width = input.value.length + "ch";
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