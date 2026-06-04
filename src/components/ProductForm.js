function ProductForm({
  handleSubmit,
  name,
  setName,
  quantity,
  setQuantity,
  price,
  setPrice
}) {

  return (
    <>
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Add Product
        </button>

      </form>

      <hr />
    </>
  );
}

export default ProductForm;