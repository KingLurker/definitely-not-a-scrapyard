import React, { useState, useEffect } from "react";
import { fs } from "../config/Config";
import {
  getDocs,
  collection,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export const ModCoupons = () => {
  const [coupons, setCoupons] = useState([]);

  // Fetch the coupons from Firestore
  useEffect(() => {
    const fetchCoupons = async () => {
      const couponsCollectionRef = collection(fs, "coupons");
      const couponDocs = await getDocs(couponsCollectionRef);
      const couponList = couponDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCoupons(couponList);
    };

    fetchCoupons();
  }, []);

  // Update coupon information
  const updateCoupon = async (id, updatedcoupon) => {
    const couponDocRef = doc(fs, "coupons", id);
    await updateDoc(couponDocRef, updatedcoupon);
    console.log("coupon updated successfully");
  };

  // Delete coupon
  const deleteCoupon = async (id) => {
    const couponDocRef = doc(fs, "coupons", id);
    await deleteDoc(couponDocRef);
    console.log("coupon deleted successfully");
    setCoupons(coupons.filter((coupon) => coupon.id !== id)); // Remove the coupon from the local state as well
  };

  // Handler for form submission
  const handleUpdate = (coupon, e) => {
    e.preventDefault();
    console.log(coupon);
    updateCoupon(coupon.id, {
      code: e.target.code.value,
      discount: Number(e.target.discount.value),
    });
  };

  return (
    <div className="moditems">
      {coupons.map((coupon) => (
        <div key={coupon.id} className="moditems-item">
          <form onSubmit={(e) => handleUpdate(coupon, e)}>
            <input name="code" defaultValue={coupon.code} />
            <input
              name="discount"
              type="number"
              defaultValue={coupon.discount}
            />
            <button type="submit" className="button-update">Update</button>
            <button
              type="button"
              className="button-delete"
              onClick={() => deleteCoupon(coupon.id)}
            >
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
  
};
