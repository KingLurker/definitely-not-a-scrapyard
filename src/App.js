import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Signup } from "./components/Signup";
import { Login } from "./components/Login";
import { NotFound } from "./components/NotFound";
import { AddProduct } from "./components/AddProduct";
import { Cart } from "./components/Cart";
import { ModUsers } from "./components/ModUsers";
import { ModCoupons } from "./components/ModCoupons";
import { ModItems } from "./components/ModItems";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound></NotFound>}></Route>

        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/addproduct" element={<AddProduct></AddProduct>}></Route>
        <Route path="/cart" element={<Cart></Cart>}></Route>
        <Route path="/modifyusers" element={<ModUsers></ModUsers>}></Route>
        <Route path="/modifyitems" element={<ModItems></ModItems>}></Route>
        <Route path="/coupons" element={<ModCoupons></ModCoupons>}></Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
