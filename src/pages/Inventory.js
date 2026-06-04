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

function Inventory() {

  const [products, setProducts] =
    useState([]);

  useEffect(() => {

    const unsubscribe =
      onSnapshot(
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

  const totalInventoryValue =
    products.reduce(
      (total, product) =>
        total +
        (
          product.price *
          product.quantity
        ),
      0
    );

  return (
    <>

      <Sidebar />

      <div className="container page-content">

        <Navbar />

        <h1>Inventory Management</h1>

        <div className="dashboard-cards">

          <div className="card">

            <h3>
              Total Products
            </h3>

            <p>
              {products.length}
            </p>

          </div>

          <div className="card">

            <h3>
              Inventory Value
            </h3>

            <p>
              ₹{totalInventoryValue}
            </p>

          </div>

        </div>

        <div className="product-grid">

          {
            products.map(
              (product) => (

                <div
                  key={product.id}
                  className="product-card"
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
                    {product.quantity}
                  </p>

                  <p>
                    Price:
                    {" "}
                    ₹{product.price}
                  </p>

                  <p>
                    Total Value:
                    {" "}
                    ₹
                    {
                      product.price *
                      product.quantity
                    }
                  </p>

                  {
                    product.quantity < 5 ? (

                      <span
                        style={{
                          background:
                            "red",
                          color:
                            "white",
                          padding:
                            "5px 10px",
                          borderRadius:
                            "5px"
                        }}
                      >
                        Low Stock
                      </span>

                    ) : (

                      <span
                        style={{
                          background:
                            "green",
                          color:
                            "white",
                          padding:
                            "5px 10px",
                          borderRadius:
                            "5px"
                        }}
                      >
                        In Stock
                      </span>
                    )
                  }

                </div>
              )
            )
          }

        </div>

      </div>

    </>
  );
}

export default Inventory;