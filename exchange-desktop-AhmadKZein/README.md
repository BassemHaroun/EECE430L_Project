## Desktop Functional & Technical Documentation

Shaymaa & Co. Currency Exchange Presents:

The main exchange page displays the buy and sell rates and allows the user to add a new transaction.
The following functions were used:
- fetchRates() : fetches the current exchange rates from the backend
- addTransaction() : when the user records a transactions, this function is called 

The Statistics page displays the average, minimum, and maximum rates, as well as the variance, median, and standard deviation.
The following function was used:
- fetchStats() : fetches the stats from the backend.

The Graph page displays a graph that shows the fluctation of the rates over time (or it should, but it is not functional)
The following function was used:
- fetchGraph() : fetches data from the backend to plot the graph showing the buy and sell rates over time.

The Transactions page displays a table for the user's transactions. This page alos includes the additional wallet feature which builds on the add funds function, but it is not functional. It is hidden behind authentication.
The following functions were used:
- initialize() : fetches transactions to display in a table.
- addFunds() : adds the funds inputted by the user and sends them to the backend.

The Pending page displays pending transactions in a table. It is hidden behind authentication
The following functions were used:
- initialize() : fetches pending transactions for table display.
- accept() : when user selects transaction to accept, the function is calld. 

The Calculator page allows for conversions using the calculator
The following functions were used:
- fetchRates() : fetches rates from the backend.
- calculate() : when user wants to calculate rates, function is called, and it uses rates from fetchRates()

The register page allows user to register
the following function was used:
-Register(): called when user wants to register. It does so using tokens.

The login page allows user to login
the following function was used:
-Login(): called when user wants to login. It does so using tokens.


 
