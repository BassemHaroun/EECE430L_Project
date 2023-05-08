import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Transactions from './Transactions';
import Home from './Home';
import Statistics from './Statistics';
import { NavLink, BrowserRouter, Route, Routes} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

//Done with the help of stackoverflow, javatpoint and geeksforgeeks.com as sources
root.render(
  <div>
    <BrowserRouter basename='/'>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/transactions' element={<Transactions/>}/>
      <Route path='/statistics' element={<Statistics/>}/>
    </Routes>
  </BrowserRouter>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
