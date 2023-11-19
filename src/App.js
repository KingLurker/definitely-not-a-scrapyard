import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Signup } from "./components/Signup";
import { Login } from "./components/Login";
import { NotFound } from "./components/NotFound";
import { AddProduct } from "./components/AddProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound></NotFound>}></Route>

        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/addproduct" element={<AddProduct></AddProduct>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
