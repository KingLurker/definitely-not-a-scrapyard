import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, fs } from "../config/Config";

export const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePass, setRetypePass] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((credentials) => {
        // Here we set user-related information, but avoid storing the password.
        // Firestore now uses setDoc and doc to interact with the database.
        setDoc(doc(fs, "users", credentials.user.uid), {
          Email: email,
          Password: password,
          // You can add more user details here (but NOT the password)
        })
          .then(() => {
            setSuccessMsg("Signup Successful. Redirecting to login...");
            setEmail("");
            setPassword("");
            setRetypePass("");
            setErrorMsg("");
            setTimeout(() => {
              setSuccessMsg("");
              navigate("/login");
            }, 3000);
          })
          .catch((error) => {
            setErrorMsg(error.message);
          });
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  return (
    <div className="container">
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <h1>Sign Up</h1>
      <hr></hr>
      {successMsg && (
        <>
          <div className="success-msg">{successMsg}</div>
          <br></br>
        </>
      )}
      <form className="form-group" autoComplete="off" onSubmit={handleSignup}>
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
        <label>Re-type Password</label>
        <input
          type="password"
          className="form-control"
          required
          onChange={(e) => setRetypePass(e.target.value)}
          value={retypePass}
        ></input>
        <br></br>
        <div className="btn-box">
          <span>
            Already have an account? Login{" "}
            <Link to="/login" className="link-offset-1">
              {"here."}
            </Link>
          </span>
          <button className="btn btn-success btn-md" style={{ float: "right" }}>
            SIGN UP
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
