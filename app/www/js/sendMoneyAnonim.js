const params = new URLSearchParams(window.location.search);

document.addEventListener("deviceready", function () {
    const value = params.get('value');
    const description = params.get('description');

    const inputDescription = document.getElementById('description');
    const inputMoney = document.getElementById('moneyInput');
    inputMoney.addEventListener('blur', validateMoneyInput, false);

    fillFields(value, description);

    const btn = document.getElementById('btnAvançar');
    btn.addEventListener('click', async function () {
        let response = { data: null, msg: "", status: "" };
        var phoneNumber = document.getElementById('phoneNumber').value;

        let validates = [validatePhoneNumber(), validateMoneyInput()];
        if (!validates[0] || !validates[1]) return;

        response = await getNameVcard(phoneNumber);
        if (response.status != 200) {
            showToastMessage('O destinatário não tem vCard', color.danger, color.light);
            return;
        }
        phoneNumber = formatNumber(phoneNumber);
        phoneNumber = encodeURIComponent(phoneNumber);
        window.location.replace(`confirm_transaction.html?phone=${phoneNumber}&contactname=${response.data.name}&value=${inputMoney.value}&description=${inputDescription.value}`);
    });

}, false);

document.getElementById('prevBtn').addEventListener('click', function () {
    window.location.replace('contactos.html');
}, false);

function validateMoneyInput() {
    var errorMessage = document.getElementById('error-message');
    const moneyInput = document.getElementById('moneyInput').value;
    //contains non numeric characters
    if (containNonNumeric(moneyInput)) {
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

function validatePhoneNumber() {
    var errorMessage = document.getElementById('error-message-phone');

    if (document.getElementById('phoneNumber').value == '') {
        errorMessage.innerHTML = 'O número de telemóvel não pode estar vazio.';
        return false;
    }

    if (containNonNumeric(document.getElementById('phoneNumber').value)) {
        errorMessage.innerHTML = 'O número de telemóvel não pode conter caractéres não numéricos.';
        return false;
    }

    if (document.getElementById('phoneNumber').value[0] != '9' && document.getElementById('phoneNumber').value.length > 0) {
        errorMessage.innerHTML = 'O número de telemóvel deve começar por 9.';
        return false;
    }

    if (document.getElementById('phoneNumber').value.length != 9) {
        errorMessage.innerHTML = 'O número de telemóvel tem de ter 9 dígitos.';
        return false;
    }

    errorMessage.innerHTML = '';
    return true;
}

function formatNumber(number) {
    number = number.replace(/\s/g, '');
    number = number.slice(-9);
    number = "+351 " + number.slice(0, 3) + " " + number.slice(3, 6) + " " + number.slice(6);
    return number;
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