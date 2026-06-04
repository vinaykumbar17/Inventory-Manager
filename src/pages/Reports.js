import { useState, useEffect } from "react";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import { db } from "../firebase/firebase";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Products.css";
import "../styles/Sidebar.css";
import "../styles/Reports.css";

function Reports() {

  const [bills, setBills] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  useEffect(() => {

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

    return () => {

      unsubscribeBills();

      unsubscribeProducts();
    };

  }, []);

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

  const averageRevenue =
    totalBills > 0
      ? totalRevenue / totalBills
      : 0;

  const soldProducts =
    bills.reduce(
      (total, bill) =>
        total +
        (bill.items || []).reduce(
          (sum, item) =>
            sum +
            Number(
              item.billQuantity || 0
            ),
          0
        ),
      0
    );

  const unsoldProducts =
    products.reduce(
      (total, product) =>
        total +
        Number(
          product.quantity || 0
        ),
      0
    );

  const dailyRevenueData =
    bills.map(
      (bill, index) => ({
        day:
          `Day ${index + 1}`,
        revenue:
          Number(
            bill.totalAmount || 0
          )
      })
    );

  const monthMap = {};

  bills.forEach((bill) => {

    if (!bill.createdAt?.toDate) {
      return;
    }

    const date =
      bill.createdAt.toDate();

    const key =
      `${date.getFullYear()}-${date.getMonth()}`;

    const monthLabel =
      date.toLocaleDateString(
        "en-IN",
        {
          month: "short"
        }
      );

    const soldCount =
      (bill.items || []).reduce(
        (sum, item) =>
          sum +
          Number(
            item.billQuantity || 0
          ),
        0
      );

    if (!monthMap[key]) {

      monthMap[key] = {
        month: monthLabel,
        revenue: 0,
        sold: 0
      };
    }

    monthMap[key].revenue +=
      Number(
        bill.totalAmount || 0
      );

    monthMap[key].sold +=
      soldCount;
  });

  const monthlyData =
    Object.entries(monthMap)
      .sort((a, b) =>
        a[0].localeCompare(
          b[0]
        )
      )
      .slice(-6)
      .map(
        ([, value]) => ({
          ...value,
          unsold:
            unsoldProducts
        })
      );

  return (
    <>

      <Sidebar />

      <div className="container page-content">

        <Navbar />

        <h1>
          Analytics Reports
        </h1>

        <div className="reports-cards">

          <div className="report-card">

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

          </div>

          <div className="report-card">

            <h3>
              Total Bills
            </h3>

            <p>
              {totalBills}
            </p>

          </div>

          <div className="report-card">

            <h3>
              Average Sale
            </h3>

            <p>
              ₹
              {
                averageRevenue.toFixed(
                  0
                )
              }
            </p>

          </div>

          <div className="report-card">

            <h3>
              Sold Products
            </h3>

            <p>
              {soldProducts}
            </p>

          </div>

          <div className="report-card">

            <h3>
              Unsold Stock
            </h3>

            <p>
              {unsoldProducts}
            </p>

          </div>

        </div>

        <div
          className="chart-box"
        >

          <h2>
            Daily Revenue Analytics
          </h2>

          <ResponsiveContainer
            width="100%"
            height="85%"
          >

            <AreaChart
              data={
                dailyRevenueData
              }
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="day"
              />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#38bdf8"
                fill="#38bdf8"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

        <div
          className="chart-box"
        >

          <h2>
            Monthly Sales Analytics
          </h2>

          <ResponsiveContainer
            width="100%"
            height="85%"
          >

            <LineChart
              data={monthlyData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
              />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#38bdf8"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="sold"
                stroke="#22c55e"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="unsold"
                stroke="#ef4444"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </>
  );
}

export default Reports;