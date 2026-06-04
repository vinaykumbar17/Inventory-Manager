import { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Products.css";
import "../styles/Sidebar.css";

function Customers() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [customers, setCustomers] =
    useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "customers"),
      (snapshot) => {

        const customerList =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setCustomers(customerList);
      }
    );

    return () => unsubscribe();

  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!name || !phone) {

      alert("Please fill all fields");

      return;
    }

    try {

      await addDoc(
        collection(db, "customers"),
        {
          name,
          phone,
          createdAt: new Date()
        }
      );

      alert("Customer Added");

      setName("");
      setPhone("");

    } catch (error) {

      console.log(error);
    }
  };

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this customer?"
      );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(db, "customers", id)
      );

      alert("Customer Deleted");

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <>

      <Sidebar />

      <div className="container page-content">

        <Navbar />

        <h1>Customers</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <br /><br />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          <br /><br />

          <button type="submit">
            Add Customer
          </button>

        </form>

        <hr />

        <h2>Customer List</h2>

        <div className="responsive-table">
        <table>

          <thead>

            <tr>

              <th>Name</th>

              <th>Phone</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {
              customers.map((customer) => (

                <tr key={customer.id}>

                  <td>{customer.name}</td>

                  <td>{customer.phone}</td>

                  <td>

                    <button
                      onClick={() =>
                        handleDelete(
                          customer.id
                        )
                      }
                    >
                      Delete
                    </button>

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

export default Customers;