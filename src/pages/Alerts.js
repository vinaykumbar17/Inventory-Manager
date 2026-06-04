import { useState, useEffect } from "react";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Products.css";
import "../styles/Sidebar.css";

function Alerts() {

  const [products, setProducts] =
    useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {

        const productList =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setProducts(productList);
      }
    );

    return () => unsubscribe();

  }, []);

  const lowStockProducts =
  products.filter(
    (product) =>
      product.quantity <= 5
  );

  return (
    <>

      <Sidebar />

      <div className="container page-content">

        <Navbar />

        <h1>Low Stock Alerts</h1>

        {
          lowStockProducts.length === 0 ? (

            <h3>
              ✅ No low stock alerts
            </h3>

          ) : (

            <div
              className="product-grid"
            >

              {
                lowStockProducts.map(
                  (product) => (

                    <div
                      key={product.id}
                      className="product-card"
                      style={{
  border:
    product.quantity === 0
      ? "2px solid red"
      : product.quantity <= 2
      ? "2px solid orange"
      : "2px solid gold"
}}
                    >

                      <img
                        src={
                          product.image ||
                          "https://via.placeholder.com/120"
                        }
                        alt={product.name}
                        width="120"
                        height="120"
                        style={{
                          objectFit:
                            "cover",
                          borderRadius:
                            "10px"
                        }}
                      />

                      <br /><br />

                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        Quantity:
                        {" "}
                        {
                          product.quantity
                        }
                      </p>

                      <p>
                        Price:
                        {" "}
                        ₹{product.price}
                      </p>

                      <p
  style={{
    color:
      product.quantity === 0
        ? "red"
        : product.quantity <= 2
        ? "orange"
        : "#b8860b",

    fontWeight:
      "bold"
  }}
>

  {
    product.quantity === 0
      ? "❌ Out Of Stock"
      : product.quantity <= 2
      ? "⚠ Critical Stock"
      : "⚡ Low Stock"
  }

</p>

                    </div>
                  )
                )
              }

            </div>
          )
        }

      </div>

    </>
  );
}

export default Alerts;