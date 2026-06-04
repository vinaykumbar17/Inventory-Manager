function ProductTable({
  products,
  role,
  handleDelete,
  handleEdit
}) {

  return (

    <div className="product-grid">

      {
        products.map(
          (product) => (

            <div
              key={product.id}
              className="product-card"
            >

              <div
                style={{
                  width: "140px",
                  height: "140px",
                  margin:
                    "0 auto 15px",
                  borderRadius:
                    "12px",
                  overflow:
                    "hidden",
                  background:
                    "#0f172a",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center"
                }}
              >

                <img
                  src={
                    product.image
                      ? product.image
                      : "https://via.placeholder.com/140"
                  }

                  alt={product.name}

                  onError={(e) => {

                    e.target.src =
                      "https://via.placeholder.com/140";

                  }}

                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit:
                      "cover"
                  }}
                />

              </div>

              <h3>
                {product.name}
              </h3>

              <p>
                Category:
                {" "}
                {
                  product.category ||
                  "N/A"
                }
              </p>

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
                Stock Value:
                {" "}
                ₹
                {
                  Number(
                    product.price || 0
                  ) *
                  Number(
                    product.quantity || 0
                  )
                }
              </p>

              {
                Number(
                  product.quantity
                ) === 0 ? (

                  <p
                    style={{
                      color:
                        "#ef4444",
                      fontWeight:
                        "bold"
                    }}
                  >
                    ❌ Out Of Stock
                  </p>

                ) : Number(
                    product.quantity
                  ) < 5 ? (

                  <p
                    style={{
                      color:
                        "#f59e0b",
                      fontWeight:
                        "bold"
                    }}
                  >
                    ⚠ Low Stock
                  </p>

                ) : (

                  <p
                    style={{
                      color:
                        "#22c55e",
                      fontWeight:
                        "bold"
                    }}
                  >
                    ✔ In Stock
                  </p>
                )
              }

              {
                role === "admin" && (

                  <div
                    style={{
                      marginTop:
                        "15px"
                    }}
                  >

                    <button
                      onClick={() =>
                        handleEdit(
                          product
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          product.id
                        )
                      }
                      style={{
                        marginLeft:
                          "10px"
                      }}
                    >
                      Delete
                    </button>

                  </div>
                )
              }

            </div>
          )
        )
      }

    </div>
  );
}

export default ProductTable;