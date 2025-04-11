import React from 'react';
import Display from './Display';
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <Display />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;
