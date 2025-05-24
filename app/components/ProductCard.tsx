import React from "react";
import AddToCart from "./AddToCart";

const ProductCard = () => {
  return (
    <div className="p-5 my-5 bg-slate-950 text-white text-xl hover:bg-sky-300">
      <AddToCart />
    </div>
  );
};

export default ProductCard;
