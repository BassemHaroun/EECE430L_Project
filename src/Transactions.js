import './Transactions.css';
import { useState, useEffect, useCallback } from "react";
import { clearUserToken, saveUserToken, getUserToken } from "./localStorage";
import UserCredentialsDialog from "./UserCredentialsDialog/UserCredentialsDialog";
import { NavLink, Route, Switch } from 'react-router-dom';
import { DataGrid } from "@mui/x-data-grid";

var SERVER_URL = "http://127.0.0.1:5000";

function Transactions(){
  let [lbpInput, setLbpInput] = useState("");
  let [usdInput, setUsdInput] = useState("");
  let [userToken, setUserToken] = useState(getUserToken());
  let [userTransactions, setUserTransactions] = useState([]);
  let [pendingTransactions, setPendingTransactions] = useState([]);
  let [usd_wallet, set_usd_wallet] = useState(null);
  let [lbp_wallet, set_lbp_wallet] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);

  const States = {
    PENDING: "PENDING",
    USER_CREATION: "USER_CREATION",
    USER_LOG_IN: "USER_LOG_IN",
    USER_AUTHENTICATED: "USER_AUTHENTICATED",
  };

  let [authState, setAuthState] = useState(States.PENDING);

  function fetchWallet() {
    fetch(`${SERVER_URL}/user`)
      .then((response) => response.json())
      .then((data) => {
        set_usd_wallet(data.usd_wallet);
        set_lbp_wallet(data.lbp_wallet);
      });
  }

  async function addItem(transtype) {
    const data = {
      usd_amount: usdInput,
      lbp_amount: lbpInput,
    };

    if (transtype === true) {
      data.usd_amount = 0;
    }

    if (transtype === false) {
      data.lbp_amount = 0;
    }

    await fetch(`${SERVER_URL}/addFunds`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + getUserToken(),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      fetchWallet();
  }

  async function addTransaction() {
    
    const data = {
      transaction_id: selectionModel
    };

    await fetch(`${SERVER_URL}/accept`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + getUserToken(),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        fetchPendingTransactions();
        fetchUserTransactions();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      fetchWallet();
  }

  function login(username, password) {
    return fetch(`${SERVER_URL}/authentication`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        setAuthState(States.USER_AUTHENTICATED);
        setUserToken(body.token);
        saveUserToken(body.token);
      });
      fetchWallet();
  }

  function createUser(username, password) {
    return fetch(`${SERVER_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

  const fetchPendingTransactions = useCallback(() => {
    fetch(`${SERVER_URL}/pending`, {
    })
      .then((response) => response.json())
      .then((transactions) => setPendingTransactions(transactions));
  }, []);
  useEffect(() => {
    if (userToken) {
      fetchPendingTransactions();
    }
  }, [fetchPendingTransactions, userToken]);


  return(
    <div className='transactions'>
      {authState === States.USER_CREATION && (
        <UserCredentialsDialog
          open={true}
          title={"Register"}
          submitText={"Register"}
          onClose={() => setAuthState(States.PENDING)}
          onSubmit={createUser}
        />
      )}
      {authState === States.USER_LOG_IN && (
        <UserCredentialsDialog
          open={true}
          title={"Log in"}
          submitText={"Log in"}
          onClose={() => setAuthState(States.PENDING)}
          onSubmit={login}
        />
      )}

      <div>
      <nav className="navbar navbar-inverse bringToFrontDiv">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="/" >Shaymaa & Co. Currency Exchange</a>
          </div>
          <ul className="nav navbar-nav">
            <li><NavLink activeclassname="current" to="/">Home</NavLink></li>
            <li><NavLink activeclassname="current" to="/transactions">Transactions</NavLink></li>
            <li><NavLink activeclassname="current" to="/statistics">Statistics</NavLink></li>
          </ul>

              <div className="nav navbar-nav navbar-right">
                    {userToken !== null ? (
                      <button type="button" className="navbar-buttons" onClick={logout}>Logout</button>
                      ) : (
                          <div>
                              <button type="button" className="navbar-buttons" onClick={() => setAuthState(States.USER_LOG_IN)}>Login</button>
                              <button type="button" className="navbar-buttons" onClick={() => setAuthState(States.USER_CREATION)}>Sign up</button>
                          </div>
                      )}
              </div>
        </div>
      </nav>
      </div>
      <div className="row">
            <div className="col-md-6">
                <div className="jumbotron-at-top"><h1 className="margin">WELCOME BACK</h1>
                <h2 style={{marginLeft:  '110px', marginTop: '75px', color: '#eae2d2'}}>My Wallet:</h2>
                <h2 style={{marginLeft:  '280px', marginTop: '-43px', color: '#eae2d2'}}><span>
                {usd_wallet == null ? "No funds available" : lbp_wallet.toFixed(3)}
              </span> L.L.</h2>
                <h2 style={{marginLeft:  '280px', marginTop: '25px', color:'#eae2d2'}}><span>
                {lbp_wallet == null ? "No funds available" : usd_wallet.toFixed(3)}
              </span> $</h2>
                </div>
            </div>
            <div className="col-md-6">
              <div className="my-container-top">
              <h1 style={{marginLeft:  '191px', marginTop: '-10px'}}>ADD TO YOUR WALLET</h1>
                <div className="row">
                  <div className="col-lg-6">
                    <h1>LBP AMOUNT</h1>
                  </div>
                  <div className="col-lg-6">
                    <h1>USD AMOUNT</h1>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="input-group">
                      <input className="form-control" placeholder="LBP amount" type="number" value={lbpInput} onChange={(e) => setLbpInput(e.target.value)}/>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="input-group">
                      <input className="form-control" placeholder="USD amount" type="number" value={usdInput} onChange={(e) => setUsdInput(e.target.value)}/>
                    </div>
                  </div>
                </div>
                <div className="btn-group">
                  <button type="button" className="btn btn-primary" onClick={() => addItem(true)}>Add LBP</button>
                  <button type="button" className="btn btn-primary" onClick={() => addItem(false)}>Add USD</button>
                </div>
              </div>
            </div>
    </div>
    <div className="table-container">
      <h2>Pending transactions</h2>
      <p>Select the transaction you would like to complete and select the submit button.</p>
      <DataGrid
      id="table"
            columns={[
              {field: "added_date", headerName: "Date added", width: 250 },
              {field: "lbp_amount", headerName: "LBP Amount", flex: 1 },
              {field: "usd_amount", headerName: "USD Amount", flex: 1 },
              {field: "usd_to_lbp", headerName: "USD to LBP rate", flex: 1 },
            ]}
            rows={pendingTransactions} autoHeight onSelectionModelChange={(newSelection) => {setSelectionModel(newSelection);}}/>
      <button className="submit-btn" type="button" onClick={() => addTransaction()}>Submit</button>
    </div>
    <div className="table-container">
      <h2>All transactions</h2>
      <p>Below are displayed all user transactions.</p>
      <DataGrid
      id="table"
            columns={[
              {field: "added_date", headerName: "Date added", width: 250 },
              {field: "lbp_amount", headerName: "LBP Amount", flex: 1 },
              {field: "usd_amount", headerName: "USD Amount", flex: 1 },
              {field: "usd_to_lbp", headerName: "USD to LBP rate", flex: 1 },
            ]}
            rows={userTransactions} autoHeight/>
    </div>
    </div>
    );
}
export default Transactions;