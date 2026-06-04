import { useState, useEffect } from "react";

import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc
} from "firebase/firestore";

import jsPDF from "jspdf";

import { db } from "../firebase/firebase";

import {
  sendWhatsAppAlert
} from "../utils/sendWhatsApp";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Products.css";
import "../styles/Sidebar.css";

function Billing() {

  const [products, setProducts] =
    useState([]);

  const [customers, setCustomers] =
    useState([]);

  const [
    selectedCustomer,
    setSelectedCustomer
  ] = useState("");

  const [
    selectedProduct,
    setSelectedProduct
  ] = useState("");

  const [quantity, setQuantity] =
    useState("");

  const [billItems, setBillItems] =
    useState([]);

  const [total, setTotal] =
    useState(0);

  const [shopSettings,
    setShopSettings] =
    useState({});

  const gstRate = 18;

  const gstAmount =
    (total * gstRate) / 100;

  const finalAmount =
    total + gstAmount;

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

    const unsubscribeCustomers =
      onSnapshot(
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

    const unsubscribeSettings =
      onSnapshot(
        doc(
          db,
          "settings",
          "shopSettings"
        ),
        (docSnap) => {

          if (docSnap.exists()) {

            setShopSettings(
              docSnap.data()
            );

          } else {

            setShopSettings({});
          }
        }
      );

    return () => {

      unsubscribeProducts();

      unsubscribeCustomers();

      unsubscribeSettings();
    };

  }, []);

  const selectedCustomerData =
    customers.find(
      (customer) =>
        customer.name ===
        selectedCustomer
    ) || {};

  const addToBill = () => {

    const product =
      products.find(
        (p) =>
          p.id === selectedProduct
      );

    if (!selectedCustomer) {

      alert(
        "Please select customer"
      );

      return;
    }

    if (!product) {

      alert(
        "Please select product"
      );

      return;
    }

    if (
      !quantity ||
      Number(quantity) <= 0
    ) {

      alert(
        "Enter valid quantity"
      );

      return;
    }

    if (
      Number(quantity) >
      Number(product.quantity)
    ) {

      alert(
        "Not enough stock"
      );

      return;
    }

    const itemTotal =
      Number(product.price) *
      Number(quantity);

    const existingItem =
      billItems.find(
        (item) =>
          item.id === product.id
      );

    if (existingItem) {

      const updatedItems =
        billItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                billQuantity:
                  item.billQuantity +
                  Number(quantity),

                itemTotal:
                  (
                    item.billQuantity +
                    Number(quantity)
                  ) *
                  item.price
              }
            : item
        );

      setBillItems(updatedItems);

      const updatedTotal =
        updatedItems.reduce(
          (sum, item) =>
            sum + item.itemTotal,
          0
        );

      setTotal(updatedTotal);

    } else {

      setBillItems([
        ...billItems,
        {
          ...product,
          billQuantity:
            Number(quantity),
          itemTotal
        }
      ]);

      setTotal(
        (prevTotal) =>
          prevTotal + itemTotal
      );
    }

    setQuantity("");

    setSelectedProduct("");
  };

  const removeItem =
    (indexToRemove) => {

      const updatedItems =
        billItems.filter(
          (_, index) =>
            index !== indexToRemove
        );

      setBillItems(updatedItems);

      const updatedTotal =
        updatedItems.reduce(
          (sum, item) =>
            sum + item.itemTotal,
          0
        );

      setTotal(updatedTotal);
    };

  const generateBill =
    async () => {

      if (
        billItems.length === 0
      ) {

        alert(
          "No items added"
        );

        return;
      }

      try {

        for (const item of billItems) {

          const newQuantity =
            Number(item.quantity) -
            Number(item.billQuantity);

          await updateDoc(
            doc(
              db,
              "products",
              item.id
            ),
            {
              quantity:
                newQuantity
            }
          );

          if (
            newQuantity <= 5 &&
            newQuantity > 0
          ) {

            sendWhatsAppAlert(
`🏪 Inventory Manager Alert

⚠ LOW STOCK WARNING

📦 Product:
${item.name}

📉 Remaining Quantity:
${newQuantity}

💰 Product Price:
₹${item.price}

🕒 ${new Date().toLocaleString()}

⚡ Please restock soon.`
            );
          }

          if (
            newQuantity === 0
          ) {

            sendWhatsAppAlert(
`🚨 OUT OF STOCK ALERT

📦 Product:
${item.name}

❌ Stock Quantity:
0

🕒 ${new Date().toLocaleString()}

⚡ Immediate restock required.`
            );
          }
        }

        await addDoc(
          collection(db, "bills"),
          {
            customerName:
              selectedCustomerData.name || "",

            customerPhone:
              selectedCustomerData.phone || "",

            items: billItems,

            subtotal: total,

            gst: gstAmount,

            totalAmount:
              finalAmount,

            createdAt:
              new Date()
          }
        );

        sendWhatsAppAlert(
`🧾 BILL GENERATED

👤 Customer:
${selectedCustomer}

📞 Phone:
${selectedCustomerData.phone || "N/A"}

💵 Subtotal:
₹${total.toFixed(2)}

🧾 GST (${gstRate}%):
₹${gstAmount.toFixed(2)}

💰 Final Total:
₹${finalAmount.toFixed(2)}

🕒 ${new Date().toLocaleString()}

✅ Bill generated successfully.`
        );

        alert(
          "Bill Generated Successfully"
        );

        setBillItems([]);

        setTotal(0);

        setSelectedCustomer("");

        setSelectedProduct("");

        setQuantity("");

      } catch (error) {

        console.log(error);

        alert(
          "Failed to generate bill"
        );
      }
    };

  const printBill = () => {

    if (
      billItems.length === 0
    ) {

      alert(
        "No items to print"
      );

      return;
    }

    let billContent = `
${shopSettings.shopName || "Inventory Manager"}

Owner:
${shopSettings.ownerName || ""}

Phone:
${shopSettings.phone || ""}

Address:
${shopSettings.address || ""}

================================
BILL RECEIPT
================================

Customer:
${selectedCustomer}

Phone:
${selectedCustomerData.phone || ""}

Date:
${new Date().toLocaleString()}

================================
`;

    billItems.forEach((item) => {

      billContent += `
Product: ${item.name}
Quantity: ${item.billQuantity}
Price: Rs. ${item.price}
Total: Rs. ${item.itemTotal}

`;
    });

    billContent += `
================================

Subtotal:
Rs. ${total.toFixed(2)}

GST (${gstRate}%):
Rs. ${gstAmount.toFixed(2)}

Final Total:
Rs. ${finalAmount.toFixed(2)}

Thank You! Visit Again
`;

    const printWindow =
      window.open(
        "",
        "",
        "width=400,height=600"
      );

    printWindow.document.write(`
      <pre style="
        font-size:16px;
        padding:20px;
        font-family:monospace;
      ">
${billContent}
      </pre>
    `);

    printWindow.document.close();

    printWindow.print();
  };

  const downloadPDF = () => {

    if (
      billItems.length === 0
    ) {

      alert(
        "No items in bill"
      );

      return;
    }

    const pdf =
      new jsPDF();

    let y = 20;

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(20);

    pdf.text(
      shopSettings?.shopName ||
      "Inventory Manager",
      20,
      y
    );

    y += 15;

    pdf.setFontSize(12);

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      `Customer: ${selectedCustomer}`,
      20,
      y
    );

    y += 10;

    pdf.text(
      `Phone: ${selectedCustomerData.phone || ""}`,
      20,
      y
    );

    y += 10;

    pdf.text(
      `Date: ${new Date().toLocaleString()}`,
      20,
      y
    );

    y += 20;

    billItems.forEach((item) => {

      pdf.text(
        `${item.name} | Qty: ${item.billQuantity} | ₹${item.itemTotal}`,
        20,
        y
      );

      y += 10;
    });

    y += 10;

    pdf.text(
      `Subtotal: ₹${total.toFixed(2)}`,
      20,
      y
    );

    y += 10;

    pdf.text(
      `GST (${gstRate}%): ₹${gstAmount.toFixed(2)}`,
      20,
      y
    );

    y += 10;

    pdf.text(
      `Final Total: ₹${finalAmount.toFixed(2)}`,
      20,
      y
    );

    y += 20;

    pdf.text(
      "Thank You! Visit Again",
      20,
      y
    );

    pdf.save(
      `Invoice_${Date.now()}.pdf`
    );
  };

  return (
    <>

      <Sidebar />

      <div className="container page-content">

        <Navbar />

        <h1>
          Billing System
        </h1>

        <select
          value={selectedCustomer}
          onChange={(e) =>
            setSelectedCustomer(
              e.target.value
            )
          }
        >

          <option value="">
            Select Customer
          </option>

          {
            customers.map(
              (customer) => (

                <option
                  key={customer.id}
                  value={customer.name}
                >
                  {customer.name}
                </option>
              )
            )
          }

        </select>

        <br /><br />

        <select
          value={selectedProduct}
          onChange={(e) =>
            setSelectedProduct(
              e.target.value
            )
          }
        >

          <option value="">
            Select Product
          </option>

          {
            products.map(
              (product) => (

                <option
                  key={product.id}
                  value={product.id}
                  disabled={
                    Number(product.quantity) === 0
                  }
                >

                  {
                    Number(product.quantity) === 0
                      ? "❌ "
                      : Number(product.quantity) < 5
                      ? "⚠ "
                      : "✅ "
                  }

                  {product.name}
                  {" "}
                  (Stock:
                  {product.quantity})

                </option>
              )
            )
          }

        </select>

        <br /><br />

        <input
          type="number"
          placeholder="Enter Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(
              e.target.value
            )
          }
        />

        <br /><br />

        <button onClick={addToBill}>
          Add to Bill
        </button>

        <hr />

        <h2>
          Bill Summary
        </h2>

        <div className="responsive-table">

          <table>

            <thead>

              <tr>

                <th>
                  Product
                </th>

                <th>
                  Quantity
                </th>

                <th>
                  Price
                </th>

                <th>
                  Total
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {
                billItems.map(
                  (
                    item,
                    index
                  ) => (

                    <tr key={index}>

                      <td>
                        {item.name}
                      </td>

                      <td>
                        {
                          item.billQuantity
                        }
                      </td>

                      <td>
                        ₹{item.price}
                      </td>

                      <td>
                        ₹{item.itemTotal}
                      </td>

                      <td>

                        <button
                          onClick={() =>
                            removeItem(index)
                          }
                          style={{
                            background:
                              "red",
                            color:
                              "white",
                            border:
                              "none",
                            padding:
                              "5px 10px",
                            borderRadius:
                              "5px",
                            cursor:
                              "pointer"
                          }}
                        >
                          Remove
                        </button>

                      </td>

                    </tr>
                  )
                )
              }

            </tbody>

          </table>

        </div>

        <div
          style={{
            marginTop: "20px",
            fontSize: "18px"
          }}
        >

          <p>
            Subtotal:
            ₹{total.toFixed(2)}
          </p>

          <p>
            GST ({gstRate}%):
            ₹{gstAmount.toFixed(2)}
          </p>

          <h2>
            Final Total:
            ₹{finalAmount.toFixed(2)}
          </h2>

        </div>

        <button
          onClick={generateBill}
        >
          Generate Bill
        </button>

        <button
          onClick={printBill}
          style={{
            marginLeft: "10px"
          }}
        >
          Print Bill
        </button>

        <button
          onClick={downloadPDF}
          style={{
            marginLeft: "10px"
          }}
        >
          Download PDF
        </button>

      </div>

    </>
  );
}

export default Billing;