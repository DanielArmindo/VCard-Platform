document.addEventListener('deviceready', async () => {

    let response = await getUser();
    user = response.data;

    let status = localStorage.getItem('receiveNotifications');
    if (status == null || status == undefined) {
        localStorage.setItem('receiveNotifications', 0);
        status = 0;
    }
    console.log("Notification Status: SocketManager " + localStorage.getItem('receiveNotifications'));

    // if (cordova.plugins.foregroundService) {
    //     cordova.plugins.foregroundService.stop();
    // }
    cordova.plugins.foregroundService.start('Vcard Notifications', 'Background Service', 'myicon', 3, 10, user, status);
});