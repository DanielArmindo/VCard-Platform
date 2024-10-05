var NotificationsList = document.getElementById('notifications-list');
var notificationsToRead = 0;

document.getElementById('prevBtn').addEventListener('click', function () {
    window.location.replace("menu.html");
});

document.addEventListener("deviceready", function () {
    getNotifications();
}, false);

async function getNotifications() {

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
        // console.log("Printing notifications from menu.js");
        // console.log(notifications);

        var notificationsJsonStr = '[' + notifications.replace(/}{/g, '},{') + ']';
        // console.log("------------------");
        // console.log("Printing notificationsJsonStr from menu.js");
        // console.log(notificationsJsonStr);

        var notificationsJson = JSON.parse(notificationsJsonStr);

        // console.log("Total notifications: " + notificationsJson.length);

        // notificationsJson.forEach(notification => {
        //     if (!notification.isRead)
        //         notificationsToRead++;
        // });

        // console.log("Printing notificationsToRead from menu.js");
        // console.log(notificationsToRead);

        if (notifications.length != 0) {
            // Before that invert the order of the notifications
            notificationsJson.reverse();

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
            console.log("Local Notifications: " + localNotifications);
            localNotifications.reverse();
            showNotifications(localNotifications);
        }


        document.getElementById('notifications-to-read').innerText = notificationsToRead;
    }
}

function showNotifications(notifications) {
    NotificationsList.innerHTML = '';
    notifications.forEach(function (notification) {
        var notificationsItem = document.createElement('div');
        notificationsItem.id = 'entidade-notification';
        notificationsItem.classList.add('m-3', 'p-3', 'parent-div', 'align-items-center', 'position-relative');
        notificationsItem.style.backgroundColor = '#333333';
        notificationsItem.style.borderRadius = '10px';

        var divInfo = document.createElement('div');
        divInfo.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'w-100', 'inner-div');

        var divInfo2 = document.createElement('div');
        divInfo2.classList.add('d-flex', 'flex-column', 'align-items-start', 'inner-div');
        divInfo2.style.width = '85%';

        var divInfo3 = document.createElement('div');
        divInfo3.classList.add('d-flex', 'justify-content-between', 'align-items-end', 'inner-div', 'form-check');
        divInfo3.style.width = '15%';

        var nome = document.createElement('span')
        nome.id = 'entidade-notification';
        nome.classList.add('text-white', 'custom-text-font');

        nome.innerText = notification.message

        var checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.disabled = notification.isRead;

        notification.isRead ? checkbox.checked = true : notificationsToRead += 1;

        checkbox.addEventListener('click', function () {
            divInfo3.disabled = true;
            checkbox.disabled = true;
            setIsRead(notifications, notification);
        });

        var data = document.createElement('span')
        data.id = 'data-notification';
        data.classList.add('text-light', 'custom-text-font');

        const parsedDate = new Date(notification.date);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedDate = parsedDate.toLocaleDateString('pt-PT', options).replace(/[/]/g, '-');

        data.innerText = formattedDate;

        notificationsItem.appendChild(divInfo)

        divInfo.appendChild(divInfo2)
        divInfo2.appendChild(nome)
        divInfo2.appendChild(data)
        divInfo.appendChild(divInfo3)
        divInfo3.appendChild(checkbox)

        NotificationsList.appendChild(notificationsItem);
    });
}

function setIsRead(notifications, notification) {
    console.log("setIsRead");
    console.log(JSON.stringify(notifications));
    console.log(JSON.stringify(notification));

    notifications.forEach(function (n) {
        if (n.message == notification.message && n.date == notification.date) {
            n.isRead = true;
        }
    });

    console.log(JSON.stringify(notifications));

    // Replace all file contents with the new data
    // window.resolveLocalFileSystemURL('file:///data/data/io.cordova.hellocordova/cache/notifications/transaction.json', function (fileEntry) {
    //     fileEntry.createWriter(function (fileWriter) {
    //         fileWriter.write(JSON.stringify(notifications));
    //         console.log("setIsRead: " + JSON.stringify(notifications));
    //     }, errorHandler);
    // }, errorHandler);

    // function errorHandler(e) {
    //     console.error('Error: ' + e.message);
    // }

    // Store in the local storage
    localStorage.setItem('notifications', JSON.stringify(notifications));

    // Update the notifications to read
    notificationsToRead--;
    document.getElementById('notifications-to-read').innerText = notificationsToRead;
}

