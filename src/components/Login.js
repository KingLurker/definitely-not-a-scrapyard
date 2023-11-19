import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/Config";

export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setSuccessMsg("Login Successful. Redirecting to the home page...");
        setEmail("");
        setPassword("");
        setErrorMsg("");
        setTimeout(() => {
          setSuccessMsg("");
          navigate("/");
        }, 3000);
      })
      .catch((error) => setErrorMsg(error.message));
  };

  return (
    <div className="container">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <h1>Login</h1>
      <hr></hr>
      {successMsg && (
        <>
          <div className="success-msg">{successMsg}</div>
          <br></br>
        </>
      )}
      <form className="form-group" autoComplete="off" onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        ></input>
        <br></br>
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        ></input>
        <br></br>
        <div className="btn-box">
          <span>
            Don't have an account? Sign-up{" "}
            <Link to="/signup" className="link-offset-1">
              {" here."}
            </Link>
          </span>
          <button className="btn btn-success btn-md" style={{ float: "right" }}>
            LOGIN
          </button>
        </div>
      </form>
      {errorMsg && (
        <>
          <div className="error-msg">{errorMsg}</div>
          <br></br>
        </>
      )}
    </div>
  );
};
