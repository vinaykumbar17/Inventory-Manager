import { useState, useEffect } from "react";

import {
  doc,
  setDoc,
  onSnapshot
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Products.css";
import "../styles/Sidebar.css";

function Settings() {

  const [shopName, setShopName] =
    useState("");

  const [ownerName, setOwnerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [syncStatus, setSyncStatus] =
    useState("Connected");

  useEffect(() => {
    const docRef = doc(
      db,
      "settings",
      "shopSettings"
    );

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data =
            docSnap.data();
          setShopName(
            data.shopName || ""
          );
          setOwnerName(
            data.ownerName || ""
          );
          setPhone(
            data.phone || ""
          );
          setAddress(
            data.address || ""
          );
          setSyncStatus(
            "Real-time sync active"
          );
        } else {
          setSyncStatus(
            "No settings saved yet"
          );
        }
      },
      () => {
        setSyncStatus(
          "Sync disconnected"
        );
      }
    );

    return () => unsubscribe();

  }, []);

  const saveSettings = async () => {

    try {

      await setDoc(
        doc(
          db,
          "settings",
          "shopSettings"
        ),
        {
          shopName,
          ownerName,
          phone,
          address
        }
      );

      alert(
        "Settings Saved Successfully"
      );

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <>

      <Sidebar />

      <div className="container page-content">

        <Navbar />

        <h1>Settings</h1>
        <p>{syncStatus}</p>

        <input
          type="text"
          placeholder="Shop Name"
          value={shopName}
          onChange={(e) =>
            setShopName(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Owner Name"
          value={ownerName}
          onChange={(e) =>
            setOwnerName(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
        />

        <br /><br />

        <textarea
          placeholder="Shop Address"
          value={address}
          onChange={(e) =>
            setAddress(
              e.target.value
            )
          }
          rows="4"
          cols="40"
        />

        <br /><br />

        <button onClick={saveSettings}>
          Save Settings
        </button>

      </div>

    </>
  );
}

export default Settings;