import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import BillHistory from "./pages/BillHistory";
import Settings from "./pages/Settings";
import Customers from "./pages/Customers";
import CustomerHistory from "./pages/CustomerHistory";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bill-history"
          element={
            <ProtectedRoute>
              <BillHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />

        <Route
  path="/customer-history"
  element={
    <CustomerHistory />
  }
/>
        
      </Routes>

    </BrowserRouter>
  );
}

export default App;