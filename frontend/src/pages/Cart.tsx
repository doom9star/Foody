import produce from "immer";
import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/Navbar";
import { CAxios } from "../constants";
import { useCtx } from "../state";
import { isObject } from "../utils";

function Cart() {
  const { cart, setCart } = useCtx();
  const [cartDestroyed, setCartDestroyed] = useState(false);
  const [cartOrdered, setCartOrdered] = useState(false);

  const alterQuantity = useCallback(
    (orderItemId: number, op: "incr" | "decr") => {
      CAxios.put("/cart", { orderItemId, op }).then(() => {
        setCart((prev) =>
          produce(prev, (draft) => {
            if (draft) {
              const oiidx = draft.items.findIndex(
                (oi) => oi.id === orderItemId
              );
              if (op === "incr") draft.items[oiidx].quantity++;
              else {
                if (draft.items[oiidx].quantity <= 1)
                  draft.items = draft.items.filter(
                    (oi) => oi.id !== orderItemId
                  );
                else draft.items[oiidx].quantity--;
              }
            }
          })
        );
      });
    },
    [setCart]
  );

  const placeOrder = useCallback(() => {
    CAxios.post("/order", { cartId: cart?.id }).then(({ data }) => {
      if (!data) setCartOrdered(true);
      else if (data.closed) setCartDestroyed(true);
      setCart(null);
    });
  }, [cart, setCart]);

  const clearCart = useCallback(() => {
    CAxios.delete("/cart").then(({ data }) => {
      if (!data) setCart((prev) => ({ ...prev!, items: [] }));
    });
  }, [setCart]);

  const deleteItem = useCallback(
    (id: number) => {
      CAxios.delete("/cart/item/" + id, { params: { id } }).then(({ data }) => {
        if (!data) {
          setCart((prev) =>
            produce(prev, (draft) => {
              if (draft) draft.items = draft.items.filter((oi) => oi.id !== id);
            })
          );
        }
      });
    },
    [setCart]
  );

  const total = useMemo(() => {
    return !isObject(cart) || JSON.stringify(cart) === "{}"
      ? 0
      : cart!.items.reduce((p, c) => p + c.quantity * c.item.price, 0);
  }, [cart]);

  return (
    <div>
      <NavBar addBack />
      <p style={{ textAlign: "center", color: "brown" }}>
        <h3>Food Cart</h3>
      </p>
      {cartDestroyed ? (
        <div
          style={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "25px",
              height: "25px",
              borderRadius: "50%",
              margin: "1rem",
              backgroundColor: "red",
            }}
          />
          <h4>Cart Destroyed!</h4>
          <p>
            One of the restaurants is closed / item might be unavailable. Try
            again later
          </p>
        </div>
      ) : cartOrdered ? (
        <div
          style={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "25px",
              height: "25px",
              borderRadius: "50%",
              margin: "1rem",
              backgroundColor: "green",
            }}
          />
          <h4>Cart Ordered!</h4>
          <p>
            Your cart has been successfully ordered! Please proceed to{" "}
            <Link to={"/home/orders"}> Orders </Link>
            page to track your orders
          </p>
        </div>
      ) : (
        <div style={{ padding: "2rem" }}>
          {!cart || JSON.stringify(cart) === "{}" || cart.items.length === 0 ? (
            <div>
              <h2>Start Shopping!</h2>
              <Link to={"/home"}>Shop</Link>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <table>
                <tr>
                  <th>SI NO</th>
                  <th>Name</th>
                  <th>Restaurant</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th></th>
                </tr>
                {cart.items.map((oi, idx) => (
                  <tr>
                    <td>{idx + 1}</td>
                    <td>{oi.item.name}</td>
                    <td>{oi.restaurant.name}</td>
                    <td>₹ {oi.item.price}</td>
                    <td style={{ display: "flex", alignItems: "center" }}>
                      {oi.quantity}{" "}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          margin: "0rem 1rem",
                        }}
                      >
                        <button onClick={() => alterQuantity(oi.id, "incr")}>
                          +
                        </button>
                        <button onClick={() => alterQuantity(oi.id, "decr")}>
                          -
                        </button>
                      </div>
                    </td>
                    <td>
                      <button onClick={() => deleteItem(oi.id)}>x</button>
                    </td>
                  </tr>
                ))}
              </table>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>Total: ₹ {total}</span>
                <div style={{ display: "flex" }}>
                  <button style={{ margin: "1rem" }} onClick={clearCart}>
                    Clear
                  </button>
                  <button style={{ margin: "1rem" }} onClick={placeOrder}>
                    Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;
