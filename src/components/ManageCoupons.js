import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { fs } from "../config/Config"; // Ensure 'db' is your initialized Firestore instance
import { ModCoupons } from "./ModCoupons";

export const ManageCoupons = () => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadError, setUploadError] = useState("");

  const handleAddProducts = async (e) => {
    e.preventDefault();
    try {
      // Add new document in Firestore
      await addDoc(collection(fs, "coupons"), {
        code,
        discount: Number(discount),
      });

      setSuccessMsg("Product added successfully");
      setCode("");
      setDiscount("");
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (error) {
      setUploadError(error.message);
    }
  };
  return (
    <div className="container">
      <br></br>
      <br></br>
      <h1>Create Coupons</h1>
      <hr></hr>
      {successMsg && (
        <>
          <div className="success-msg">{successMsg}</div>
          <br></br>
        </>
      )}
      <form
        autoComplete="off"
        className="form-group"
        onSubmit={handleAddProducts}
      >
        <label>Coupon Code</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setCode(e.target.value)}
          value={code}
        ></input>
        <br></br>
        <br></br>
        <label>Coupon Discount</label>
        <input
          type="number"
          className="form-control"
          required
          onChange={(e) => setDiscount(e.target.value)}
          value={discount}
        ></input>
        <br></br>
        <br></br>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-success btn-md">
            SUBMIT
          </button>
        </div>
      </form>
      {uploadError && (
        <>
          <br></br>
          <div className="error-msg">{uploadError}</div>
        </>
      )}
      <br></br>
      <div>
        <ModCoupons></ModCoupons>
      </div>
    </div>
  );
};
