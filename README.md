# Disclaimer

This project was carried out as part of the Advanced Topics in Software Engineering course in Computer Engineering at the Polytechnic Institute of Leiria.

# About This Project

This project involves the development of a mobile app that will provide a virtual card environment to its users.

- Users will be able to transfer money to each other through a virtual environment. The app will interact with a centralized support system that will contain details about users and transactions.
- The user will have access to a dashboard where they can check the balance of the virtual card and access all the main features of the app.
- The user will also be able to create a virtual card using their phone number.
- The app will allow notifications and will have the Piggy Bank Vault feature, which will allow the user to create a specific savings tab where they can save some money from their card.

**Attention**:

This project has the same structure as the project [Vcard-Platform](https://github.com/DanielArmindo/VCard-Platform), however the focus of the frontend is not on a SPA (Single Page Application) using the Vue framework, but on a mobile application to facilitate accessibility in the context of the problem.

In conjunction with the development of this application, automated tests were performed that served to help in the development of the mobile app, in order to identify and regularize the intended features. The **Katalon** software was used for this purpose.

The "**automated-tests**" directory contains all the necessary files that Katalon Studio needs to test the functionalities implemented in the mobile application. Within it, the "**Apks**" folder provides the APKs to install on Android or to use with Katalon.

# Softwares Requeriments

This project used the following softwares:

- **Android Studio** - Official integrated development environment (IDE) from Google for creating applications for the Android operating system. It is an advanced tool with resources for developing, testing, and publishing Android applications. - https://developer.android.com/studio
	- An optional installation instead of Android Studio is to install just the **Windows SDK** - https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/
- **Apache Cordova** - Open-source development framework that allows to build mobile apps using HTML, CSS, and JavaScript instead of native languages, enabling the creation of cross-platform apps from a single codebase. - https://cordova.apache.org/
- **Katalon Studio** - Comprehensive test automation solution for web, mobile, and API applications that combines advanced recording, execution, and reporting capabilities into a single integrated platform. - https://katalon.com/
- For dependencies **npm** - The default package manager for the JavaScript ecosystem. It is used to install and manage project dependencies. - https://www.npmjs.com/

# How to run Project

```bash
# Dont forget this commands for dependencies (only first time)
npm install -g cordova

# At the root of the project
cordova platform ls # show existing platforms in the project (optional)
cordova platform add browser
# Don't forget to change the url of the api used in the mobile app in /www/js/data.js on the first line
npx cordova run browser --live-reload # prepare the environment for development

# To build application / Generate APK
cordova platform add android
cordova build android # After this last command the apk will be generated in /platforms/android/bin
```

Don't forget that the development environment can be made easier with Android Studio, giving you the possibility to choose the version of android to use and much more.

```bash
# Optional
cordova run android
```

# Reminders

It is imperative that the **existing API and WebSocket server** from the previous project ([Vcard-Platform](https://github.com/DanielArmindo/VCard-Platform)) be utilized, as they constitute the indispensable backend for this project.

**Be careful** with the application's ports to avoid conflicts.

- Laravel - On Windows, Laragon creates a dedicated URL, otherwise, avoid using other ports. (Don't forget to change the files that use the laravel URL)
- Node Server - **:8080**
- Android App in context of web browser - **:3000**

When changing the laravel url, don't forget to modify the **baseUrl** variable in the cordova app's **/www/js/data.js** file.
