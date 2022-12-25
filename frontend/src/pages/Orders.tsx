import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/Navbar";
import { CAxios } from "../constants";
import { ICart, OrderStatus } from "../types";
import { isObject } from "../utils";

function Orders() {
  const [carts, setCarts] = useState<ICart[]>([]);
  useEffect(() => {
    CAxios.get("/order").then(({ data }) => {
      if (isObject(data)) {
        setCarts(data);
      }
    });
  }, []);
  return (
    <div>
      <NavBar addBack />
      <h2>Orders</h2>
      {carts.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>No Orders</h3>
          <h5>Start Shopping!</h5>
          <Link to={"/home"}>Shop</Link>
        </div>
      ) : (
        <table>
          <th>Order ID</th>
          <th>Items</th>
          <th>Date of Order</th>
          <th>Status</th>

          {carts.map((c) => (
            <tr key={c.id} style={{ backgroundColor: "rgb(230, 230, 230)" }}>
              <td style={{ padding: "3rem" }}>{c.id}</td>
              <td style={{ padding: "3rem" }}>
                {c.orders.map((o) => (
                  <div
                    key={o.id}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <h6>{o.restaurant.name}</h6>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "2rem",
                      }}
                    >
                      {o.items.map((oi) => (
                        <div>
                          <span style={{ margin: "1rem" }}>{oi.item.name}</span>
                          <span style={{ margin: "1rem" }}>
                            ₹ {oi.item.price}
                          </span>
                          <span>{oi.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <span>{o.status}</span>
                  </div>
                ))}
              </td>
              <td style={{ padding: "3rem" }}>{c.createdAt}</td>
              <td style={{ padding: "3rem" }}>
                {c.orders.every((_o) => _o.status === OrderStatus.ORDERED)
                  ? "ORDERED"
                  : c.orders.some(
                      (_o) =>
                        _o.status === OrderStatus.PREPARING ||
                        _o.status === OrderStatus.DELIVERING
                    )
                  ? "PROCESSING"
                  : "DELIVERED"}
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}

export default Orders;
