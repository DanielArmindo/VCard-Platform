document.getElementById("prevBtn").addEventListener("click", function () {
    window.location.replace("definicoes.html");
});
document.getElementById("container-btn").addEventListener("click", function () {
    deleteAccount();
});
document.getElementById("password").addEventListener("blur", validatePassword);
document.getElementById("confirmationCode").addEventListener("blur", validateConfirmationCode);

async function deleteAccount() {
    let response = { data: null, msg: "", status: 0 };

    password = document.getElementById("password").value;
    confirmation_code = document.getElementById("confirmationCode").value;

    if (!validatePassword()) return;
    if (!validateConfirmationCode()) return;

    response = await deleteVcard(password, confirmation_code);
    console.log(response);

    if (response.status != 200) {
        showToastMessage(response.msg, color.danger, color.light);
        return;
    }

    localStorage.clear();
    window.location.replace("checkPhoneNumber.html?showDeletedMessage=true");
}

function validatePassword() {
    password = document.getElementById("password").value;
    if (password.length == 0) {
        document.getElementById('password-error-message').innerHTML = 'Introduza a sua palavra-passe.';
        return false;
    }

    document.getElementById('password-error-message').innerHTML = '&nbsp;';
    return true;
}

function validateConfirmationCode() {
    var confirmationCode = document.getElementById('confirmationCode');
    var errorMessage = document.getElementById('confirmationCode-error-message');
    if (confirmationCode.value.length != 3) {
        errorMessage.innerHTML = 'O pin deve ter 3 dígitos.';
        return false;
    }

    if (containNonNumeric(confirmationCode.value)) {
        errorMessage.innerHTML = 'O código de confirmação deve conter apenas números.';
        return false;
    }

    errorMessage.innerHTML = '&nbsp;';
    return true;
}

function containNonNumeric(inputString) {
    const nonNumericRegex = /[^0-9]/;
    return nonNumericRegex.test(inputString);
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