import { useState, useEffect } from "react";

import "../styles/Products.css";
import "../styles/Sidebar.css";

import DashboardCards from "../components/DashboardCards";
import ProductTable from "../components/ProductTable";
import SearchBar from "../components/SearchBar";
import RoleSelector from "../components/RoleSelector";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function Products() {

  const [name, setName] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [image, setImage] =
    useState("");

  const [editId, setEditId] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  const [role, setRole] =
    useState("admin");

  const [search, setSearch] =
    useState("");

  const [filterCategory,
    setFilterCategory] =
    useState("All");

  useEffect(() => {

    const unsubscribe =
      onSnapshot(
        collection(
          db,
          "products"
        ),
        (snapshot) => {

          const productList =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setProducts(
            productList
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);

  const filteredProducts =
    products.filter(
      (product) => {

        const matchesSearch =
          product.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =
          filterCategory ===
            "All" ||
          product.category ===
            filterCategory;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

  const lowStockProducts =
    products.filter(
      (product) =>
        Number(
          product.quantity
        ) < 5
    );

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !name ||
        !quantity ||
        !price ||
        !category
      ) {

        alert(
          "Please fill all fields"
        );

        return;
      }

      try {

        if (editId) {

          await updateDoc(
            doc(
              db,
              "products",
              editId
            ),
            {
              name,
              quantity:
                Number(quantity),
              price:
                Number(price),
              category,
              image
            }
          );

          alert(
            "Product Updated Successfully"
          );

        } else {

          await addDoc(
            collection(
              db,
              "products"
            ),
            {
              name,
              quantity:
                Number(quantity),
              price:
                Number(price),
              category,
              image,
              createdAt:
                new Date()
            }
          );

          alert(
            "Product Added Successfully"
          );
        }

        setName("");
        setQuantity("");
        setPrice("");
        setCategory("");
        setImage("");
        setEditId(null);

      } catch (error) {

        console.log(error);
      }
    };

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this product?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteDoc(
          doc(
            db,
            "products",
            id
          )
        );

        alert(
          "Product Deleted"
        );

      } catch (error) {

        console.log(error);
      }
    };

  const handleEdit =
    (product) => {

      setEditId(product.id);

      setName(product.name);

      setQuantity(
        product.quantity
      );

      setPrice(
        product.price
      );

      setCategory(
        product.category || ""
      );

      setImage(
        product.image || ""
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

  const cancelEdit = () => {

    setEditId(null);

    setName("");
    setQuantity("");
    setPrice("");
    setCategory("");
    setImage("");
  };

  return (
    <>

      <Sidebar />

      <div className="container page-content">

        <Navbar />

        <h1>
          Inventory Manager
        </h1>

        <RoleSelector
          role={role}
          setRole={setRole}
        />

        {
          role === "admin" && (

            <div
              className="product-form"
            >

              <h2>

                {
                  editId
                    ? "Edit Product"
                    : "Add Product"
                }

              </h2>

              <form
                onSubmit={
                  handleSubmit
                }
              >

                <input
                  type="text"
                  placeholder="Product Name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                />

                <br /><br />

                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value
                    )
                  }
                />

                <br /><br />

                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                />

                <br /><br />

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="Grocery">
                    Grocery
                  </option>

                  <option value="Dairy">
                    Dairy
                  </option>

                  <option value="Snacks">
                    Snacks
                  </option>

                  <option value="Beverages">
                    Beverages
                  </option>

                </select>

                <br /><br />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={image}
                  onChange={(e) =>
                    setImage(
                      e.target.value
                    )
                  }
                />

                <br /><br />

                {
                  image && (

                    <img
                      src={image}
                      alt="Preview"

                      onError={(e) => {

                        e.target.src =
                          "https://via.placeholder.com/140";

                      }}

                      style={{
                        width: "140px",
                        height: "140px",
                        objectFit:
                          "cover",
                        borderRadius:
                          "10px",
                        border:
                          "2px solid #38bdf8",
                        marginBottom:
                          "15px"
                      }}
                    />
                  )
                }

                <br />

                <button
                  type="submit"
                >

                  {
                    editId
                      ? "Update Product"
                      : "Add Product"
                  }

                </button>

                {
                  editId && (

                    <button
                      type="button"
                      onClick={
                        cancelEdit
                      }
                      style={{
                        marginLeft:
                          "10px"
                      }}
                    >
                      Cancel
                    </button>
                  )
                }

              </form>

            </div>
          )
        }

        <DashboardCards
          totalProducts={
            filteredProducts.length
          }
          lowStock={
            lowStockProducts.length
          }
        />

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <br />

        <select
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(
              e.target.value
            )
          }
        >

          <option value="All">
            All Categories
          </option>

          <option value="Grocery">
            Grocery
          </option>

          <option value="Dairy">
            Dairy
          </option>

          <option value="Snacks">
            Snacks
          </option>

          <option value="Beverages">
            Beverages
          </option>

        </select>

        <br /><br />

        <h2>
          Product List
        </h2>

        {
          filteredProducts.length === 0 ? (

            <p>
              No products found
            </p>

          ) : (

            <ProductTable
              products={
                filteredProducts
              }
              role={role}
              handleDelete={
                handleDelete
              }
              handleEdit={
                handleEdit
              }
            />

          )
        }

      </div>

    </>
  );
}

export default Products;