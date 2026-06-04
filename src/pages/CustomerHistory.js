import {
  useState,
  useEffect
} from "react";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import { db }
from "../firebase/firebase";

import Sidebar
from "../components/Sidebar";

import Navbar
from "../components/Navbar";

function CustomerHistory() {

  const [bills, setBills] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  useEffect(() => {

    const unsubscribe =
      onSnapshot(
        collection(db, "bills"),
        (snapshot) => {

          const billList =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setBills(billList);
        }
      );

    return () =>
      unsubscribe();

  }, []);

  const groupedCustomers = {};

  bills.forEach((bill) => {

    const customerName =
      bill.customerName ||
      "Unknown";

    if (
      !groupedCustomers[
        customerName
      ]
    ) {

      groupedCustomers[
        customerName
      ] = {

        customerName,

        customerPhone:
          bill.customerPhone ||
          "N/A",

        totalBills: 0,

        totalSpent: 0,

        totalProducts: 0,

        products: {}
      };
    }

    groupedCustomers[
      customerName
    ].totalBills += 1;

    groupedCustomers[
      customerName
    ].totalSpent +=
      Number(
        bill.totalAmount || 0
      );

    bill.items?.forEach(
      (item) => {

        groupedCustomers[
          customerName
        ].totalProducts +=
          Number(
            item.billQuantity || 0
          );

        if (
          groupedCustomers[
            customerName
          ].products[
            item.name
          ]
        ) {

          groupedCustomers[
            customerName
          ].products[
            item.name
          ] +=
            Number(
              item.billQuantity || 0
            );

        } else {

          groupedCustomers[
            customerName
          ].products[
            item.name
          ] =
            Number(
              item.billQuantity || 0
            );
        }
      }
    );
  });

  const customerList =
    Object.values(
      groupedCustomers
    ).filter(
      (customer) =>
        customer.customerName
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        customer.customerPhone
          .includes(search)
    );

  return (
    <>

      <Sidebar />

      <div className="container page-content">

        <Navbar />

        <h1>
          Customer History
        </h1>

        <input
          type="text"
          placeholder="Search Customer Name or Phone"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={{
            padding: "10px",
            width: "320px",
            marginBottom: "20px"
          }}
        />

        <table>

          <thead>

            <tr>

              <th>
                Customer
              </th>

              <th>
                Phone
              </th>

              <th>
                Total Bills
              </th>

              <th>
                Products Bought
              </th>

              <th>
                Total Products
              </th>

              <th>
                Total Spent
              </th>

            </tr>

          </thead>

          <tbody>

            {
              customerList.map(
                (
                  customer,
                  index
                ) => (

                  <tr
                    key={index}
                  >

                    <td>
                      {
                        customer.customerName
                      }
                    </td>

                    <td>
                      {
                        customer.customerPhone
                      }
                    </td>

                    <td>
                      {
                        customer.totalBills
                      }
                    </td>

                    <td>

                      {
                        Object.entries(
                          customer.products
                        ).map(
                          (
                            [name, qty]
                          ) => (

                            <div
                              key={name}
                            >

                              {name}
                              {" "}
                              (
                              {qty}
                              )

                            </div>
                          )
                        )
                      }

                    </td>

                    <td>
                      {
                        customer.totalProducts
                      }
                    </td>

                    <td>

                      ₹
                      {
                        customer.totalSpent.toFixed(
                          2
                        )
                      }

                    </td>

                  </tr>
                )
              )
            }

          </tbody>

        </table>

      </div>

    </>
  );
}

export default CustomerHistory;