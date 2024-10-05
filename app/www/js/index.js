document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    // Ao iniciar a aplicação, verifica se o utilizador já está autenticado...
    if (window.localStorage.getItem("loggedIn") === "true") {
        window.location.replace("menu.html");
    } else {
        window.location.replace("checkPhoneNumber.html");
    }
}