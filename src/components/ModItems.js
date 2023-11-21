import React, { useState, useEffect } from "react";
import { fs } from "../config/Config";
import {
  getDocs,
  collection,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export const ModItems = () => {
  const [products, setProducts] = useState([]);

  // Fetch the products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollectionRef = collection(fs, "products");
      const productDocs = await getDocs(productsCollectionRef);
      const productList = productDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  // Update product information
  const updateProduct = async (id, updatedProduct) => {
    const productDocRef = doc(fs, "products", id);
    await updateDoc(productDocRef, updatedProduct);
    console.log("Product updated successfully");
  };

  // Delete product
  const deleteProduct = async (id) => {
    const productDocRef = doc(fs, "products", id);
    await deleteDoc(productDocRef);
    console.log("Product deleted successfully");
    setProducts(products.filter((product) => product.id !== id)); // Remove the product from the local state as well
  };

  // Handler for form submission
  const handleUpdate = (product, e) => {
    e.preventDefault();
    updateProduct(product.id, {
      title: e.target.title.value,
      description: e.target.description.value,
      price: Number(e.target.price.value),
    });
  };

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <form onSubmit={(e) => handleUpdate(product, e)}>
            <input name="title" defaultValue={product.title} />
            <input name="description" defaultValue={product.description} />
            <input name="price" type="number" defaultValue={product.price} />
            <button type="submit">Update</button>
          </form>
          <button onClick={() => deleteProduct(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};
