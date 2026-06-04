import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { db } from "../firebase/firebase";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Dashboard.css";
import "../styles/Sidebar.css";

function Dashboard() {

  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [bills, setBills] =
    useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    const unsubscribeProducts =
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

    const unsubscribeBills =
      onSnapshot(
        collection(db, "bills"),
        (snapshot) => {

          const billsList =
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

          setBills(billsList);
        }
      );

    return () => {

      unsubscribeProducts();

      unsubscribeBills();
    };

  }, []);

  const filteredProducts =
    products.filter(
      (product) =>
        product.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const lowStockProducts =
    products.filter(
      (product) =>
        Number(product.quantity) < 5
    );

  const outOfStockProducts =
    products.filter(
      (product) =>
        Number(product.quantity) === 0
    );

  const totalRevenue =
    bills.reduce(
      (total, bill) =>
        total +
        Number(
          bill.totalAmount || 0
        ),
      0
    );

  const totalBills =
    bills.length;

  const averageBillValue =
    totalBills > 0
      ? totalRevenue / totalBills
      : 0;

  const todayString =
    new Date().toDateString();

  const todaysBills =
    bills.filter((bill) => {

      if (!bill.createdAt?.toDate) {
        return false;
      }

      return (
        bill.createdAt
          .toDate()
          .toDateString() ===
        todayString
      );
    });

  const todayRevenue =
    todaysBills.reduce(
      (sum, bill) =>
        sum +
        Number(
          bill.totalAmount || 0
        ),
      0
    );

  const chartData = [
    {
      name: "Available",
      value:
        products.length -
        lowStockProducts.length
    },
    {
      name: "Low Stock",
      value:
        lowStockProducts.length
    }
  ];

  const COLORS = [
    "#22c55e",
    "#ef4444"
  ];

  const productSales = {};

  bills.forEach((bill) => {

    bill.items?.forEach((item) => {

      if (
        productSales[item.name]
      ) {

        productSales[item.name] +=
          item.billQuantity;

      } else {

        productSales[item.name] =
          item.billQuantity;
      }
    });
  });

  const topProducts =
    Object.entries(productSales)
      .sort((a, b) =>
        b[1] - a[1]
      )
      .slice(0, 5);

  const latestBills =
    [...bills]
      .sort((a, b) => {

        const aTime =
          a.createdAt?.toDate
            ? a.createdAt
                .toDate()
                .getTime()
            : 0;

        const bTime =
          b.createdAt?.toDate
            ? b.createdAt
                .toDate()
                .getTime()
            : 0;

        return bTime - aTime;

      })
      .slice(0, 6);

  return (
    <>

      <Sidebar />

      <div className="container page-content">

        <Navbar />

        <section className="dashboard-header">

          <div>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              style={{
                padding: "10px",
                width: "300px",
                borderRadius: "8px",
                border:
                  "1px solid #ccc"
              }}
            />

          </div>

          <div>

            <h1>
              Smart Dashboard
            </h1>

            <p>
              Real-time inventory,
              billing, and stock
              health overview.
            </p>

          </div>

          <div className="dashboard-actions">

            <button
              className="action-btn"
              onClick={() =>
                navigate(
                  "/billing"
                )
              }
            >
              Create Bill
            </button>

            <button
              className="action-btn secondary"
              onClick={() =>
                navigate(
                  "/products"
                )
              }
            >
              Add Product
            </button>

          </div>

        </section>

        <div className="dashboard-grid-cards">

          <div className="metric-card">

            <h3>
              Total Products
            </h3>

            <p>
              {
                filteredProducts.length
              }
            </p>

            <small>
              Active SKUs in catalog
            </small>

          </div>

          <div className="metric-card warning">

            <h3>
              Low Stock
            </h3>

            <p>
              {
                lowStockProducts.length
              }
            </p>

            <small>
              {
                outOfStockProducts.length
              }{" "}
              out of stock
            </small>

          </div>

          <div className="metric-card">

            <h3>
              Total Bills
            </h3>

            <p>
              {totalBills}
            </p>

            <small>
              Avg bill:
              ₹
              {
                averageBillValue.toFixed(
                  0
                )
              }
            </small>

          </div>

          <div className="metric-card success">

            <h3>
              Total Revenue
            </h3>

            <p>
              ₹
              {
                totalRevenue.toFixed(
                  0
                )
              }
            </p>

            <small>
              Today:
              ₹
              {
                todayRevenue.toFixed(
                  0
                )
              }
            </small>

          </div>

        </div>

        <div className="dashboard-panels">

          <section className="panel chart-panel">

            <h2>
              Inventory Analytics
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  dataKey="value"
                  label
                >

                  {
                    chartData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[index]
                          }
                        />
                      )
                    )
                  }

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </section>

          <section className="panel">

            <h2>
              Priority Restock
            </h2>

            <div className="priority-list">

              {
                lowStockProducts.length === 0
                  ? (
                      <p className="empty-state">
                        No products need urgent restock.
                      </p>
                    )
                  : (
                      lowStockProducts
                        .sort(
                          (a, b) =>
                            Number(
                              a.quantity || 0
                            ) -
                            Number(
                              b.quantity || 0
                            )
                        )
                        .slice(0, 6)
                        .map(
                          (
                            product
                          ) => (

                            <div
                              key={product.id}
                              className="priority-item"
                            >

                              <span>
                                {
                                  product.name
                                }
                              </span>

                              <span className="badge">
                                Qty:
                                {" "}
                                {
                                  product.quantity
                                }
                              </span>

                            </div>
                          )
                        )
                    )
              }

            </div>

          </section>

        </div>

        <div className="dashboard-panels">

          <section className="panel">

            <div className="panel-title-row">

              <h2>
                Recent Transactions
              </h2>

              <button
                className="text-btn"
                onClick={() =>
                  navigate(
                    "/bill-history"
                  )
                }
              >
                View all
              </button>

            </div>

            <table>

              <thead>

                <tr>

                  <th>
                    Customer
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {
                  latestBills.length === 0
                    ? (
                        <tr>

                          <td
                            colSpan="3"
                            className="empty-state"
                          >
                            No transactions available.
                          </td>

                        </tr>
                      )
                    : (
                        latestBills.map(
                          (bill) => (

                            <tr
                              key={bill.id}
                            >

                              <td>
                                {
                                  bill.customerName ||
                                  "Customer"
                                }
                              </td>

                              <td>
                                ₹
                                {
                                  Number(
                                    bill.totalAmount || 0
                                  ).toFixed(0)
                                }
                              </td>

                              <td>
                                {
                                  bill.createdAt?.toDate
                                    ? bill.createdAt
                                        .toDate()
                                        .toLocaleDateString()
                                    : "-"
                                }
                              </td>

                            </tr>
                          )
                        )
                      )
                }

              </tbody>

            </table>

          </section>

          <section className="panel">

            <h2>
              Top Selling Products
            </h2>

            <table>

              <thead>

                <tr>

                  <th>
                    Product
                  </th>

                  <th>
                    Quantity Sold
                  </th>

                </tr>

              </thead>

              <tbody>

                {
                  search.trim() !== ""
                    ? (
                        filteredProducts.length === 0
                          ? (
                              <tr>

                                <td
                                  colSpan="2"
                                  className="empty-state"
                                >
                                  No products found
                                </td>

                              </tr>
                            )
                          : (
                              filteredProducts.map(
                                (product) => (

                                  <tr
                                    key={product.id}
                                  >

                                    <td>
                                      {
                                        product.name
                                      }
                                    </td>

                                    <td>
                                      {
                                        productSales[
                                          product.name
                                        ] || 0
                                      }
                                    </td>

                                  </tr>
                                )
                              )
                            )
                      )
                    : (
                        topProducts.length === 0
                          ? (
                              <tr>

                                <td
                                  colSpan="2"
                                  className="empty-state"
                                >
                                  Sales data is not available yet.
                                </td>

                              </tr>
                            )
                          : (
                              topProducts.map(
                                (
                                  [name, qty],
                                  index
                                ) => (

                                  <tr
                                    key={index}
                                  >

                                    <td>
                                      {name}
                                    </td>

                                    <td>
                                      {qty}
                                    </td>

                                  </tr>
                                )
                              )
                            )
                      )
                }

              </tbody>

            </table>

          </section>

        </div>

      </div>

    </>
  );
}

export default Dashboard;