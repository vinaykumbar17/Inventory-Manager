import { useState, useEffect }
from "react";

import {
  NavLink,
  useLocation
} from "react-router-dom";

import "../styles/Sidebar.css";

function Sidebar() {

  const [open, setOpen] =
    useState(false);

  const location =
    useLocation();

  useEffect(() => {

    setOpen(false);

  }, [location.pathname]);

  const navItems = [

    {
      to: "/dashboard",
      label: "Dashboard",
      icon: "📊"
    },

    {
      to: "/products",
      label: "Products",
      icon: "📦"
    },

    {
      to: "/inventory",
      label: "Inventory",
      icon: "🏬"
    },

    {
      to: "/billing",
      label: "Billing",
      icon: "🧾"
    },

    {
      to: "/bill-history",
      label: "Bill History",
      icon: "📜"
    },

    {
      to: "/customer-history",
      label: "Customer History",
      icon: "👤"
    },

    {
      to: "/customers",
      label: "Customers",
      icon: "👥"
    },

    {
      to: "/reports",
      label: "Reports",
      icon: "📈"
    },

    {
      to: "/alerts",
      label: "Alerts",
      icon: "⚠"
    },

    {
      to: "/settings",
      label: "Settings",
      icon: "⚙"
    }

  ];

  return (
    <>

      <button
        className="menu-btn"
        onClick={() =>
          setOpen(!open)
        }
      >

        ☰

      </button>

      {
        open && (

          <div
            className="sidebar-backdrop"
            onClick={() =>
              setOpen(false)
            }
          />

        )
      }

      <div
        className={
          open
            ? "sidebar active"
            : "sidebar"
        }
      >

        <h2>
          Inventory Manager
        </h2>

        {
          navItems.map(
            (item) => (

              <NavLink
                key={item.to}
                to={item.to}
                className={({
                  isActive
                }) =>
                  isActive
                    ? "active-link"
                    : ""
                }
              >

                <span
                  style={{
                    marginRight:
                      "10px"
                  }}
                >
                  {item.icon}
                </span>

                {item.label}

              </NavLink>
            )
          )
        }

      </div>

    </>
  );
}

export default Sidebar;