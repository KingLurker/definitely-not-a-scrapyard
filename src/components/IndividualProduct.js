import React from "react";

export const IndividualProduct = ({ individualProduct, addToCart }) => {
  const handeAddToCart = () => {
    addToCart(individualProduct);
  };

  return (
    <div className="product">
      <div className="product-img">
        <img src={individualProduct.url} alt="product-img"></img>
      </div>
      <div className="product-text title">{individualProduct.title}</div>
      <div className="product-text description">
        {individualProduct.description}
      </div>
      <div className="product-text price">{individualProduct.price}</div>
      <div className="btn btn-danger btn-md cart-btn" onClick={handeAddToCart}>
        ADD TO CART
      </div>
    </div>
  );
};
