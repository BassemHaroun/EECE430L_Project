# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



## Frontend architecture

The Home page, the Transactions page, and the Statistics page make up the web frontend. In the index.js file, Routes is used to link the pages together. The user can go from any single page to another using the navbar.
In all pages, the user can sign up, log in, and log out. Reading the user token from local storage starts the process. 

The user can use the calculator to do calculations using the most recent currency rate and to add transactions on the Home page, which also displays the current selling and purchasing exchange rates. The react functions listed below are what it uses to connect to the backend.
- fetchRates(): retrieves the backend's most recent exchange rates.
- additem() adds and sends the transaction data entered by the user to the backend.
- The login, logout, and signup processes are handled by the functions login(), logout(), and createUser(). These make changes to the token stored locally.


The user can add money to his wallet on the Transactions page, which also includes tables for the user's transactions and any pending transactions.
Hence it has the following react functions to connect it to the backend:
- addItem(transtype) : gets called when the user wants to add money to his wallet. transtype is a boolean value that indicates whether the user is adding LBP or USD.
- addTransaction(): gets called when the user selects a transaction to complete and add. 
- fetchUserTransactions(): gets called to fetch the user's transactions in order to display them in a table.
- fetchPendingTransactions(): gets called to fetch the pending transactions in order to display them in a table.
- fetchWallet(): gets called to fetch a user's wallet contents in terms of LBP and USD
- login(), logout(), createUser() : takes care of the login, logout and signup process. Updates the token in the localstorage.

On the Statistics page, a graph depicting the changing selling and buying exchange rates over time is displayed with various statistics.
The react functions listed below are what it uses to connect to the backend.
- fetchStats() : fetches the statistics from the backend. The statistics include: average, median, max, min, variance and standard deviation of selling and buying exchange rate. The user also inputs the start and end dates for which he would like to see the statistics.
- fetchGraph() : fecthes the needed data from the backend to plot the graph that shows the fluctuation of the selling exchange rate as a function of time. The user also inputs the start and end dates for which he would like to see the graph. The graph code was done with the help of sources such as stackoverflow and DEV Community's "How to Create Charts in ReactJS" article.
- login(), logout(), createUser() : takes care of the login, logout and signup process. Updates the token in the localstorage.
