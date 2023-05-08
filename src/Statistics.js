import "./Statistics.css";
import { useState, useEffect, useCallback } from "react";
import { clearUserToken, saveUserToken, getUserToken } from "./localStorage";
import UserCredentialsDialog from "./UserCredentialsDialog/UserCredentialsDialog";
import { NavLink, Route, Switch } from "react-router-dom";
import {LineChart, ResponsiveContainer, Legend, Tooltip, Line, XAxis, YAxis, CartesianGrid} from 'recharts';

var SERVER_URL = "http://127.0.0.1:5000";

const States = {
  PENDING: "PENDING",
  USER_CREATION: "USER_CREATION",
  USER_LOG_IN: "USER_LOG_IN",
  USER_AUTHENTICATED: "USER_AUTHENTICATED",
};

function Statistics() {
  let [userToken, setUserToken] = useState(getUserToken());
  let [authState, setAuthState] = useState(States.PENDING);
  let [start_date, set_start_date] = useState(null);
  let [usd_to_lbp_avg, set_usd_to_lbp_avg] = useState(null);
  let [usd_to_lbp_min, set_usd_to_lbp_min] = useState(null);
  let [usd_to_lbp_max, set_usd_to_lbp_max] = useState(null);
  let [usd_to_lbp_median, set_usd_to_lbp_median] = useState(null);
  let [lbp_to_usd_avg, set_lbp_to_usd_avg] = useState(null);
  let [lbp_to_usd_min, set_lbp_to_usd_min] = useState(null);
  let [lbp_to_usd_max, set_lbp_to_usd_max] = useState(null);
  let [lbp_to_usd_median, set_lbp_to_usd_median] = useState(null);
  let [usd_to_lbp_var, set_usd_to_lbp_var] = useState(null);
  let [lbp_to_usd_var, set_lbp_to_usd_var] = useState(null);
  let [usd_to_lbp_stddev, set_usd_to_lbp_stddev] = useState(null);
  let [lbp_to_usd_stddev, set_lbp_to_usd_stddev] = useState(null);
  let [rates, set_rates] = useState(null);


  async function fetchStats(start_date, end_date) {
    await fetch(`${SERVER_URL}/exchangeRateStats`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date : start_date,
        end_date : end_date
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        set_start_date(data.start_date);
        set_usd_to_lbp_avg(data.usd_to_lbp_avg);
        set_usd_to_lbp_min(data.usd_to_lbp_min);
        set_usd_to_lbp_max(data.usd_to_lbp_max);
        set_usd_to_lbp_median(data.usd_to_lbp_median);
        set_lbp_to_usd_avg(data.lbp_to_usd_avg);
        set_lbp_to_usd_min(data.lbp_to_usd_min);
        set_lbp_to_usd_max(data.lbp_to_usd_max);
        set_lbp_to_usd_median(data.lbp_to_usd_median);
        set_usd_to_lbp_var(data.usd_to_lbp_var);
        set_lbp_to_usd_var(data.lbp_to_usd_var);
        set_usd_to_lbp_stddev(data.usd_to_lbp_stddev);
        set_lbp_to_usd_stddev(data.lbp_to_usd_stddev);
      });
      fetchGraph();
  }
  useEffect(fetchStats, []);

  async function fetchGraph(start_date_graph, end_date_graph) {
    await fetch(`${SERVER_URL}/graph`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date : start_date_graph,
        end_date : end_date_graph
      }),
    })
      .then((response) => response.json())
      .then((rates) => set_rates(rates));
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
    setUserToken(null).then(clearUserToken);
  }

 

  return (
    <div className="statistics">
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
              <a className="navbar-brand" href="/">
              Shaymaa & Co. Currency Exchange
              </a>
            </div>
            <ul className="nav navbar-nav">
              <li><NavLink activeClassName="current" to="/">Home</NavLink></li>
              <li><NavLink activeClassName="current" to="/transactions">Transactions</NavLink></li>
              <li><NavLink activeClassName="current" to="/statistics">Statistics</NavLink></li>
            </ul>

            <div className="nav navbar-nav navbar-right">
              {userToken !== null ? (
                <button type="button" class="navbar-buttons" onClick={logout}>
                  Logout
                </button>
              ) : (
                <div>
                  <button type="button" class="navbar-buttons" onClick={() => setAuthState(States.USER_LOG_IN)}>Login</button>
                  <button type="button" class="navbar-buttons" onClick={() => setAuthState(States.USER_CREATION)}>Sign up</button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
      <div className="top-container">
        <div onChange={(start_date,end_date) => fetchStats(start_date.value,end_date.value)}></div>
        <script>
        start_date.max = new Date().toISOString().split("T")[0];
        end_date.max = new Date().toISOString().split("T")[0];
        </script>
      <label for="start">Start date:</label>
      <input type="date" id="start_date" name="start_date" min="2023-01-01"></input><br></br><br></br>
      <label for="start">End date:</label>
      <input type="date" id="end_date" name="end_date" min="2023-01-01"></input>
        <div className="row">
          <div className="col-lg-4">
            <h2>Selling rate</h2>
            <div className="row elements1">
              <div className="col-lg-6">
                <h4>Average</h4>
              </div>
              <div className="col-lg-6">
                <h4>Min</h4>
              </div>
              <div className="col-lg-6">
                <h4>Max</h4>
              </div>
            </div>
          </div>
          <div className="col-lg-41">
            <h2>Buying rate</h2>
            <div className="row elements">
              <div className="col-lg-6">
                <h4>Average</h4>
              </div>
              <div className="col-lg-6">
                <h4>Min</h4>
              </div>
              <div className="col-lg-6">
                <h4>Max</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="row elements1">
          <div className="col-lg-2">
            <h4>
              <span id="sell-usd-avg">
                {usd_to_lbp_avg == null
                  ? "Rate not available"
                  : usd_to_lbp_avg.toFixed(3)}
              </span>
            </h4>
          </div>
          <div className="col-lg-2">
            <h4>
              <span id="sell-usd-min">
                {usd_to_lbp_min == null
                  ? "Rate not available"
                  : usd_to_lbp_min.toFixed(3)}
              </span>
            </h4>
          </div>
          <div className="col-lg-2">
            <h4>
              <span id="sell-usd-max">
                {usd_to_lbp_max == null
                  ? "Rate not available"
                  : usd_to_lbp_max.toFixed(3)}
              </span>
            </h4>
          </div>
          <div className="col-lg-2">
            <h4>
              <span id="buy-usd-avg">
                {lbp_to_usd_avg == null
                  ? "Rate not available"
                  : lbp_to_usd_avg.toFixed(3)}
              </span>
            </h4>
          </div>
          <div className="col-lg-2">
            <h4><span id="buy-usd-min">
                {lbp_to_usd_min == null
                  ? "Rate not available"
                  : lbp_to_usd_min.toFixed(3)}
              </span></h4>
          </div>
          <div className="col-lg-2">
            <h4><span id="buy-usd-max">
                {lbp_to_usd_max == null
                  ? "Rate not available"
                  : lbp_to_usd_max.toFixed(3)}
              </span></h4>
          </div>
        </div><br></br><br></br>
        <div className="row">
          <div className="col-lg-4">
            <div className="row elements1">
              <div className="col-lg-6">
                <h4>Median</h4>
              </div>
              <div className="col-lg-6">
                <h4>Variance</h4>
              </div>
              <div className="col-lg-6">
                <h4>Standard Deviation</h4>
              </div>
            </div>
          </div>
          <div className="col-lg-41">
            <div className="row elements">
              <div className="col-lg-6">
                <h4>Median</h4>
              </div>
              <div className="col-lg-6">
                <h4>Variance</h4>
              </div>
              <div className="col-lg-6">
                <h4>Standard Deviation</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
        <div className="col-lg-2">
            <h4>
              <span id="sell-usd-median">
                {usd_to_lbp_median == null
                  ? "Rate not available"
                  : usd_to_lbp_median.toFixed(3)}
              </span>
            </h4>
          </div>
          <div className="col-lg-2">
            <h4>
              <span id="sell-usd-var">
                {usd_to_lbp_var == null
                  ? "Rate not available"
                  : usd_to_lbp_var.toFixed(3)}
              </span>
            </h4>
          </div>
          <div className="col-lg-2">
            <h4>
              <span id="sell-usd-std">
                {usd_to_lbp_stddev == null
                  ? "Rate not available"
                  : usd_to_lbp_stddev.toFixed(3)}
              </span>
            </h4>
          </div>
          <div className="col-lg-2">
            <h4>
              <span id="buy-usd-median">
                {lbp_to_usd_median == null
                  ? "Rate not available"
                  : lbp_to_usd_median.toFixed(3)}
              </span>
            </h4>
          </div>
          <div className="col-lg-2">
            <h4>
              <span id="buy-usd-var">
                {lbp_to_usd_var == null
                  ? "Rate not available"
                  : lbp_to_usd_var.toFixed(3)}
              </span>
            </h4>
          </div>
          <div className="col-lg-2">
            <h4>
              <span id="buy-usd-std">
                {lbp_to_usd_stddev == null
                  ? "Rate not available"
                  : lbp_to_usd_stddev.toFixed(3)}
              </span>
            </h4>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="jumbotron bg-cover">
            <h1>Average Selling Rate</h1>
          </div>
        </div>
      </div>
      <div className="top-container">
      <div onChange={(start_date_graph,end_date_graph) => fetchGraph(start_date_graph.value,end_date_graph.value)}>
      <script>
        start_date_graph.max = new Date().toISOString().split("T")[0];
        end_date_graph.max = new Date().toISOString().split("T")[0];
      </script>
      <label for="start">Start date:</label>
      <input type="date" id="start_date_graph" name="start_date" min="2023-01-01" style={{margin: '10px'}}></input>
      <label for="start">End date:</label>
      <input type="date" id="end_date_graph" name="end_date" min="2023-01-01"></input>
      </div>
      <ResponsiveContainer width="120%" aspect={3}>
				<LineChart data={rates} margin={{ right: 300 }}>
					<CartesianGrid />
					<XAxis dataKey="time"
						interval={'preserveStartEnd'} />
					<YAxis></YAxis>
					<Legend />
					<Tooltip />
					<Line dataKey="Average USD to LBP rate"
						stroke="yellow" activeDot={{ r: 8 }} />
				</LineChart>
			</ResponsiveContainer>
      </div>
      
    </div>
  );
}

export default Statistics;