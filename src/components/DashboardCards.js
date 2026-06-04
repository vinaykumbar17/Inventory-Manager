function DashboardCards({ totalProducts, lowStock }) {

  return (
    <div className="dashboard-cards">

      <div className="card">
        <h3>Total Products</h3>
        <p>{totalProducts}</p>
      </div>

      <div className="card">
        <h3>Low Stock</h3>
        <p>{lowStock}</p>
      </div>

    </div>
  );
}

export default DashboardCards;