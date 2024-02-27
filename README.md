# About Project

This project's **objective** is to implement a Single Page Application (SPA) for the "vCard" platform, using Vue.js framework for the development of the web client, Laravel and Node.js for the backend (a Restful API with Laravel and a WebSocket server with Node.js).

The vCard is a virtual debit card associated with a mobile phone number, without a physical card. Each vCard has a non-negative balance, and owners can make debit transactions (purchases, transfers) but not credit transactions. All transactions are recorded in the vCard's history. On the web, owners can configure debit and credit categories and view statistics. Administrators can configure default categories, block/unblock vCards, and other settings.

# Architecture

- The client application is partitioned into several JavaScript source files (js), from which vite ([https://vitejs.dev](https://vitejs.dev)) or a similar tool will generate the application file (or files).
- The application file, which is also a JavaScript file, and all the static assets (the html file, css files, images, etc.) are placed on the web server so that the application can be delivered through the Web - the application file (JS) is executed on the client (browser) but is delivered by a Web server.
- The application on the client (browser) will consume the Restful API service, which is implemented in Laravel and will have several endpoints that provide data to the client or allow the client to perform operations.
- The Laravel Restful API will read and store data on a MySQL database.
- The project also includes a Websocket server, implemented in JavaScript and running on a Node.js server. A full-duplex communication channel is established between the client application and the Websocket server, which allows instant messaging between them.
- The Websocket server acts as an intermediary between several instances of the client application, so that is possible to establish full duplex communication between any instances of the client application (using the Websocket server as a communication intermediary).
- It is also possible to use other libraries, frameworks, technologies, or databases that complement the described architecture. For example, "NoSQL" databases or cache technologies can be used to optimize the performance of storage operations, or queue servers to implement asynchronous operations on the server.

# Softwares Requeriments

This project used the following softwares:

- **Laravel** - An open-source web application framework written in PHP. It provides a structure for developing robust and secure web applications.
- **DataBase** - Laravel supports various database management systems like MySQL, PostgreSQL, SQLite, and SQL Server.
- **Vue.js** - A progressive JavaScript framework for building interactive user interfaces. It is used to develop the web application's user interface.
- **Server Node.js** - A JavaScript runtime environment that allows you to run JavaScript on the server. It is used to run the web application's server.
- For dependencies **npm** - The default package manager for the JavaScript ecosystem. It is used to install and manage project dependencies.

**Optional Softwares**

- **Postman** - A collaboration tool for API development. It is used to test the application's endpoints.
- **Laragon** - A local development environment that includes Apache, PHP, MySQL, and other essential tools for web developers. It is a recommended option for web application development on Windows.

# How to run Project

LaravelAPI

```bash
# Inside the LaravelAPI folder (first time)
composer install
php artisan key:generate
php artisan migrate:fresh
composer dump-autoload
php artisan db:seed # Choose option 0 for test
php artisan storage:link
php artisan passport:install # Copy last number and key to .env

# When not using Laragon - Run Server
# Dont forget to change PASSPORT_URL to correspodent URL
php artisan serve
```

VueApp

```bash
# Inside the VueApp folder (first time)
npm install

# Run Server
npm run dev

# Compile and Minify for Production
npm run build
```

WebSockets

```bash
# Inside the Websockets folder (first time)
npm install

# Run Server
npm run dev
```

# Reminders

**Be careful** with the application's ports to avoid conflicts.

- Vue - **:3000**
- Laravel - On Windows, Laragon creates a dedicated URL, otherwise, avoid using other ports. (Don't forget to change the files that use the laravel URL)
- Node Server - **:8080**

When changing the laravel url, don't forget to modify the **VITE_API_DOMAIN** variable in the vue app's **.env.development** file.

**Caution** - To log-in into web application you need to go to the database and get an username from view_table and the password for anyone is 123
