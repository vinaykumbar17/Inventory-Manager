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

function BillHistory() {

  const [bills, setBills] = useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    const unsubscribe = onSnapshot(
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

    return () => unsubscribe();

  }, []);

  return (
    <>

      <Sidebar />

      <div className="container page-content">

        <Navbar />

        <h1>Bill History</h1>

        <input
          type="text"
          placeholder="Search Customer"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <br /><br />

        <div className="responsive-table">
        <table>

          <thead>

            <tr>

              <th>Bill ID</th>

              <th>Customer</th>

              <th>Products</th>

              <th>Total Amount</th>

              <th>Date</th>

            </tr>

          </thead>

          <tbody>

            {
              bills
                .filter((bill) =>
                  bill.customerName
                    ?.toLowerCase()
                    .includes(
                      search.toLowerCase()
                    )
                )
                .map((bill) => (

                  <tr key={bill.id}>

                    <td>{bill.id}</td>

                    <td>
                      {bill.customerName}
                    </td>

                    <td>

                      {
                        bill.items.map(
                          (
                            item,
                            index
                          ) => (

                            <div
                              key={index}
                            >

                              {item.name}
                              {" "}
                              x
                              {" "}
                              {
                                item.billQuantity
                              }

                            </div>
                          )
                        )
                      }

                    </td>

                    <td>
                      ₹{bill.totalAmount}
                    </td>

                    <td>

                      {
                        bill.createdAt
                          ?.toDate()
                          .toLocaleString()
                      }

                    </td>

                  </tr>
                ))
            }

          </tbody>

        </table>
        </div>

      </div>

    </>
  );
}

export default BillHistory;