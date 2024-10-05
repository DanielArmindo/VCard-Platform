# About Project

The **main aim** of this project is to implement a Single Page Application (SPA) for a web platform that concentrates its functionality on handling vCards. The application's architecture will be **based on the React front-end library**, with the support of other complementary tools and libraries, with the aim of offering an optimized and user-friendly user experience.

The main focus of the application developed in this project is the management of vCards, which are used to represent a person or entity's contact information. React was chosen as the front-end library due to its popularity, robustness and flexibility, providing an agile and efficient development environment.

**Attention**

This project is **based on the same scenario presented in the [Vcard-Platform](https://github.com/DanielArmindo/VCard-Platform) repository**. To run the web application resulting from this project, it will be necessary to use all the components present in the aforementioned repository, with the exception of those related to the Vue.js framework. This approach allows for harmonious integration between the parts developed, guaranteeing the consistency and functionality expected by the end user.

This application is partitioned into several JavaScript source files (js), from which vite ([https://vitejs.dev](https://vitejs.dev)) or a similar tool will generate the application file (or files).

This application was developed on **my own initiative**, using existing technologies. The decision to create the application stemmed from the need to explore and improve web development skills, using the tools and resources available in the current context. This initiative reflects the commitment to continuous learning and the search for practical experiences in the area of software development.

# Decisions

The decision was made not to use a framework that uses the React library, in order to deepen the understanding of the library's fundamental concepts. The aim of this approach is to allow a direct exploration of the underlying principles of React, as well as its interaction with other libraries and tools, enabling an analysis of its limitations and capabilities. This choice aims to provide a deeper and more comprehensive understanding of how React works.

I believe that this approach provides not only a deeper understanding of React, but also develops transferable skills that make it easier to adapt to different frameworks that use React in the future.

As far as the design of the application is concerned, it **was decided to keep the original layout from Vue.js**, since the focus is primarily on React's functionality and not on visual aesthetics.

# Libraries Used

This application used the following libraries (react is not mentioned as it is installed with vitejs):

- **axios** - Used to make simple and efficient client-side HTTP requests in JavaScript applications
- **bootstrap** - Offers a set of tools for creating responsive and stylized web interfaces using HTML, CSS and JavaScript.
- **socket.io-client** - Offers a robust and efficient implementation of the WebSocket protocol, enabling real-time bidirectional communication between clients and servers in web applications.
- **react-router-dom** - Provides declarative routing for React applications, allowing navigation between different interface components dynamically and based on URLs.
- **react-toastify** - Makes easy to display toast-style notifications in React applications, offering a simple and customizable way to provide visual feedback to the user about specific events or actions.
- **react-icons** - Provides a wide range of vectorized icons ready for use in React applications, allowing easy and flexible icon integration
- **chart.js** - Offers a simple and flexible way to create interactive and responsive graphics in web applications, using HTML5 canvas to render data in a visually appealing and informative way.
- **react-redux** & **@reduxjs/toolkit** - Make easier to manage state in React applications using the Redux standard. **react-redux** integrates Redux with React components, while **@reduxjs/toolkit** simplifies Redux configuration and provides extra functionality, such as creating reducers and actions in a more concise way.

# How to run Application

```bash
# Inside the VueApp folder (first time)
npm install

# Run Server
npm run dev

# Compile and Minify for Production
npm run build
```

# Reminders

**Be careful** with the application's ports to avoid conflicts.

- React - **:5173**
- Laravel - On Windows, Laragon creates a dedicated URL, otherwise, avoid using other ports. (Don't forget to change the files that use the laravel URL)
- Node Server - **:8080**

When changing the laravel url, don't forget to modify the **VITE_API_DOMAIN** variable in the vue app's **.env.development** file.

**Caution** - To log-in into web application you need to go to the database and get an username from view_table and the password for anyone is 123
