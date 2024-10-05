const btn = document.getElementById('prevBtn');
const nextBtn = document.getElementById("nextBtn");

btn.addEventListener('click', back, false);
nextBtn.addEventListener("click", login, false);

async function login() {
    let errorMessage = document.getElementById('error-message');

    let password = document.getElementById('password').value;

    let successfulLogin = await loginVCard(password, window.localStorage.getItem("phoneNumber"));

    if (successfulLogin) {
        window.localStorage.setItem("loggedIn", "true");
        window.location.replace("menu.html");
    } else {
        errorMessage.style.textAlign = "left"
        errorMessage.innerHTML = "Credenciais Invalidas"
    }
}

function back() {
    //TODO
    window.location.href = 'checkPhoneNumber.html';
}