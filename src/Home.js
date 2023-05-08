import './Home.css';
import { useState, useEffect, useCallback } from "react";
import { clearUserToken, saveUserToken, getUserToken } from "./localStorage";
import UserCredentialsDialog from "./UserCredentialsDialog/UserCredentialsDialog";
import { NavLink, Route, Routes } from 'react-router-dom';
import Transactions from './Transactions';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { DataGrid } from '@mui/x-data-grid';

var SERVER_URL = "http://127.0.0.1:5000";

function Home(){
  let [buyUsdRate, setBuyUsdRate] = useState(null);
  let [sellUsdRate, setSellUsdRate] = useState(null);
  let [lbpInput, setLbpInput] = useState("");
  let [usdInput, setUsdInput] = useState("");
  let [transactionType, setTransactionType] = useState("usd-to-lbp");
  let [userToken, setUserToken] = useState(getUserToken());
  let [userTransactions, setUserTransactions] = useState([]);
  let [usdamount, setUsdAmount] = useState("null");
  let [lbpamount, setLbpAmount] = useState("null");

  const States = {
    PENDING: "PENDING",
    USER_CREATION: "USER_CREATION",
    USER_LOG_IN: "USER_LOG_IN",
    USER_AUTHENTICATED: "USER_AUTHENTICATED",
   };

   let [authState, setAuthState] = useState(States.PENDING);

  function fetchRates() {
    fetch(`${SERVER_URL}/exchangeRate`)
    .then(response => response.json())
    .then(data => {setBuyUsdRate(data.lbp_to_usd); setSellUsdRate(data.usd_to_lbp)})
  }
  useEffect(fetchRates, []); 

  function addItem() {
    var data;
    if (transactionType === "usd-to-lbp") {
       data = {usd_amount: usdInput,
               lbp_amount: lbpInput,
               usd_to_lbp: true};}
   
    else if (transactionType === "lbp-to-usd") {
       data = {usd_amount: usdInput,
               lbp_amount: lbpInput,
               usd_to_lbp: false};}
   
    setUsdInput = null;
    setLbpInput = null;

   if (userToken === null){
  
    fetch(`${SERVER_URL}/trans`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      fetchRates();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    }

  else  {
    fetch(`${SERVER_URL}/trans`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      fetchRates();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    }
  }

  function login(username, password) {
    return fetch(`${SERVER_URL}/authentication`, {method: "POST", headers: {"Content-Type": "application/json",},
     body: JSON.stringify({
     user_name: username,
     password: password,
     }),
     })
     .then((response) => response.json())
     .then((body) => {
     setAuthState(States.USER_AUTHENTICATED);
     setUserToken(body.token);
     saveUserToken(userToken);
     });
     }

  function createUser(username, password) {
    return fetch(`${SERVER_URL}/user`, {
    method: "POST", headers: {"Content-Type": "application/json",},
    body: JSON.stringify({
    user_name: username,
    password: password,
    }),
    }).then((response) => login(username, password));
    }

  function logout() {
    setUserToken(null);
    clearUserToken();
  }

  const fetchUserTransactions = useCallback(() => {
    fetch(`${SERVER_URL}/trans`, {
    headers: {
    Authorization: `bearer ${userToken}`,
    },
    })
    .then((response) => response.json())
    .then((transactions) => setUserTransactions(transactions));
    }, [userToken]);
    useEffect(() => {
    if (userToken) {
    fetchUserTransactions();
    }
    }, [fetchUserTransactions, userToken]);

    return(
        <div className='transactions'> {authState === States.USER_CREATION && 
        <UserCredentialsDialog open={true} title={"Register"} submitText={"Register"} onSubmit={createUser} onClose={() => setAuthState(States.PENDING)}/>}
        {authState === States.USER_LOG_IN && (
        <UserCredentialsDialog open={true} title={"Log in"} submitText={"Log in"} onSubmit={login} onClose={() => setAuthState(States.PENDING)}/>)}
    <div>
      <nav className="navbar navbar-inverse bringToFrontDiv">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">Shaymaa & Co. Currency Exchange</a>
          </div>
          <ul className="nav navbar-nav">
            <li><NavLink activeClassName="current" to="/">Home</NavLink></li>
            <li><NavLink activeClassName="current" to="/transactions">Transactions</NavLink></li>
            <li><NavLink activeClassName="current" to="/statistics">Statistics</NavLink></li>
          </ul>

          <div className="nav navbar-nav navbar-right">
          {userToken !== null ? (<button type="button" class="navbar-buttons" onClick={logout}>Logout</button>) : (
          <div>
            <button type="button" class="navbar-buttons" onClick={() => setAuthState(States.USER_LOG_IN)}>Login</button>
            <button type="button" class="navbar-buttons" onClick={() => setAuthState(States.USER_CREATION)}>Sign up</button>
            </div> )}
          </div>
        </div>
      </nav>
    </div>
        <div className="row">
        <div className="col-lg-12">
        <div className="jumbotron bg-cover">
          <h1>Today's Exchange Rate</h1>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-lg-5">
        <div className="my-container left" >
          <h1>BUY USD {" "}</h1>
          <h3><span>{buyUsdRate == null ? "Rate not available" : buyUsdRate.toFixed(3)}</span></h3>
        </div>
      </div>
      <div className="col-lg-2 vertical-line">
        <div className="vl"></div>
      </div>
      <div className="col-lg-5">
        <div className="my-container right">
          <h1>SELL USD {" "}</h1>
          <h3><span>{sellUsdRate == null ? "Rate not available": sellUsdRate.toFixed(3)}</span></h3>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="calculator-container">
        <h1>CALCULATOR</h1>
        <div className="row">
          <div className="col-lg-5">
            <h3>LBP AMOUNT</h3>
          </div>
          <div className="col-lg-2 offset-lg-6">
          </div>
          <div className="col-lg-5">
            <h3>USD AMOUNT</h3>
          </div>
        </div>
        <div className="row inputs">
          <div className="col-lg-5">
            <div className="input-group">
              <input className="form-control" placeholder="LBP amount" type="number" min="0" value={lbpInput}
              onChange={(val) => {
                if (transactionType === "usd-to-lbp") {
                  setLbpInput(val.target.value);
                  setUsdInput(val.target.value / sellUsdRate);
                } else {
                  setLbpInput(val.target.value);
                  setUsdInput(val.target.value / buyUsdRate);
                }
              }}/>
            </div>
          </div>
          <div className="col-lg-2 offset-lg-6">
            <div>
            <div class="btn-group">
            <button type="button" className="btn btn-primary" onClick={() => setTransactionType("usd-to-lbp")}>Sell USD</button>
            <button type="button" className="btn btn-primary" onClick={() => setTransactionType("lbp-to-usd")}>Buy USD</button>
          </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="input-group">
              <input className="form-control" placeholder="USD amount" type="number" min="0" value={usdInput}
              onChange={(val) => {
                if (transactionType === "usd-to-lbp") {
                  setUsdInput(val.target.value);
                  setLbpInput(val.target.value * sellUsdRate);
                } else {
                  setUsdInput(val.target.value);
                  setLbpInput(val.target.value * buyUsdRate);
                }
              }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="calculator-container">
        <h1>ADD TRANSACTIONS</h1>
        <div className="row inputs">
          <div className="col-lg-5">
            <div className="input-group">
              <input className="form-control" placeholder="LBP amount" type="number" min="0" value={lbpamount} onChange={(val) => {setLbpAmount(val.target.value); }}/>
            </div>
          </div>
          <div className="col-lg-2 offset-lg-6">
          </div>
          <div className="col-lg-5">
            <div className="input-group">
              <input className="form-control" placeholder="USD amount" type="number" min="0" value={usdamount} onChange={(val) => {setUsdAmount(val.target.value); }}/>
            </div>
          </div>
        </div>
        <div className="row">
            <button type="button" className="button-funds" onClick={addItem}>ADD TRANSACTION</button>
        </div>
      </div>
    </div>
    </div>
    );
}   

export default Home;