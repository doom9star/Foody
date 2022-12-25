import produce from "immer";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import { AskRating, RenderRating } from "../components/Rating";
import { CAxios } from "../constants";
import { useCtx } from "../state";
import {
  IOrder,
  IRestaurant,
  MenuType,
  OrderStatus,
  RestaurantStatus,
} from "../types";
import { isObject } from "../utils";

function DetailRestaurant() {
  const [loading, setLoading] = useState(true);
  const [showOrders, setShowOrders] = useState(false);
  const [restaurant, setRestaurant] = useState<IRestaurant>();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [comment, setComment] = useState("");

  const { user, setCart, cart } = useCtx();
  const { id } = useParams();
  const navigate = useNavigate();

  const postComment = useCallback(() => {
    CAxios.post("/comment", {
      body: comment,
      restaurantId: restaurant?.id,
    }).then(({ data }) => {
      if (isObject(data)) {
        setRestaurant((prev) =>
          produce(prev, (draft) => {
            if (draft) {
              draft.comments = [
                { ...data, restaurant, commentator: user } as any,
              ].concat(draft.comments);
            }
          })
        );
        setComment("");
      }
    });
  }, [comment, restaurant, user]);

  const addToCart = useCallback(
    (itemId: number) => {
      if (
        !cart ||
        JSON.stringify(cart) === "{}" ||
        !cart.items.find((oi) => oi.item.id === itemId)
      ) {
        CAxios.post("/cart", { itemId, restaurantId: restaurant?.id }).then(
          ({ data }) => {
            if (isObject(data)) {
              setCart(data);
            }
          }
        );
      }
    },
    [restaurant, setCart, cart]
  );

  const isClosed = useMemo(() => {
    return restaurant && restaurant.status === RestaurantStatus.CLOSED;
  }, [restaurant]);

  const isOwner = useMemo(() => {
    return restaurant?.owner.id === user?.id;
  }, [restaurant, user]);

  const getOrders = useCallback(() => {
    CAxios.get("/order/restaurant/" + restaurant?.id, {
      params: { id: restaurant?.id },
    }).then(({ data }) => {
      if (isObject(data)) setOrders(data);
    });
  }, [restaurant]);

  useEffect(() => {
    CAxios.get(`/restaurant/one/${id}`, { params: { id } }).then(({ data }) => {
      setRestaurant(data);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  if (loading) return <div>Loading...</div>;

  if (!restaurant) {
    navigate(-1);
    return null;
  }

  return (
    <div>
      <NavBar addBack />
      {isOwner && (
        <div style={{ margin: "1rem", display: "flex" }}>
          <button onClick={() => setShowOrders(!showOrders)}>
            {showOrders ? "Hide Orders" : "Show Orders"}
          </button>
          {showOrders && (
            <div style={{ marginLeft: "1rem" }}>
              <button onClick={getOrders}>reload</button>
            </div>
          )}
        </div>
      )}
      {showOrders && (
        <div>
          {orders.length === 0 ? (
            <h6>No Orders yet!</h6>
          ) : (
            <table style={{ margin: "1rem" }}>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Items</th>
                <th>Date Of Order</th>
                <th>Status</th>
              </tr>
              {orders.map((o, idx) => (
                <tr
                  key={o.id}
                  style={{ backgroundColor: "rgb(230, 230, 230)" }}
                >
                  <td style={{ padding: "3rem" }}>{o.id}</td>
                  <td style={{ padding: "3rem" }}>{o.user.name}</td>
                  <td style={{ padding: "3rem" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "2rem",
                      }}
                    >
                      {o.items.map((oi) => (
                        <div key={oi.id}>
                          <span style={{ margin: "1rem" }}>{oi.item.name}</span>
                          <span style={{ margin: "1rem" }}>
                            ₹ {oi.item.price}
                          </span>
                          <span>{oi.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "3rem" }}>{o.createdAt}</td>
                  <td style={{ padding: "3rem" }}>
                    <select
                      value={o.status}
                      onChange={(e) => {
                        CAxios.put("/order/status", {
                          orderId: o.id,
                          status: e.target.value,
                        }).then(({ data }) => {
                          if (isObject(data)) {
                            setOrders((prev) =>
                              produce(prev, (draft) => {
                                draft[idx] = data;
                              })
                            );
                          }
                        });
                      }}
                    >
                      <option value={OrderStatus.ORDERED}>
                        {OrderStatus.ORDERED}
                      </option>
                      <option value={OrderStatus.PREPARING}>
                        {OrderStatus.PREPARING}
                      </option>
                      <option value={OrderStatus.DELIVERING}>
                        {OrderStatus.DELIVERING}
                      </option>
                      <option value={OrderStatus.DELIVERED}>
                        {OrderStatus.DELIVERED}
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </table>
          )}
        </div>
      )}
      <div style={{ height: "400px", position: "relative" }}>
        {isClosed && (
          <div
            style={{
              backgroundColor: "red",
              color: "white",
              position: "absolute",
              zIndex: 3,
              padding: "0.5rem 2rem",
            }}
          >
            <h3>Closed</h3>
          </div>
        )}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            position: "absolute",
            opacity: 0.4,
            zIndex: 1,
          }}
        />
        <img
          src="/noBanner.png"
          alt="noBanner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
        <h1
          style={{
            position: "absolute",
            left: "45%",
            top: "50%",
            color: "whitesmoke",
            zIndex: 2,
          }}
        >
          {restaurant.name}
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <p>
          Address: <h5>{restaurant.address}</h5>
        </p>
        <p>
          Contact: <h5>{restaurant.contact.join(" , ")}</h5>
        </p>
        <RenderRating ratings={restaurant.ratings} />
        {isOwner && (
          <p>
            <button onClick={() => navigate(`/home/restaurant/${id}/edit`)}>
              Edit
            </button>
          </p>
        )}
      </div>
      <p style={{ textAlign: "center" }}>
        <h4>Menu</h4>
      </p>
      <div style={{ padding: "1rem" }}>
        {restaurant.menuType === MenuType.SINGLE ? (
          <>
            {restaurant.categories[0].items.map((i) => (
              <div
                key={i.id}
                style={{ height: "60px", display: "flex", margin: "1rem" }}
              >
                <img
                  src="/noBanner.png"
                  alt="itemimage"
                  style={{ height: "100%" }}
                />
                <h4 style={{ marginLeft: "1rem" }}>{i.name}</h4>
                <h4 style={{ marginLeft: "auto" }}>₹{i.price}</h4>
                {!isClosed && (
                  <button
                    style={{
                      width: "100px",
                      height: "40px",
                      margin: "1rem",
                    }}
                    onClick={() => addToCart(i.id)}
                  >
                    Add to cart
                  </button>
                )}
              </div>
            ))}
          </>
        ) : (
          <>
            {restaurant.categories.map((c) => (
              <div key={c.id}>
                <h3>{c.name}</h3>
                <div>
                  {c.items.map((i) => (
                    <div
                      key={i.id}
                      style={{
                        height: "60px",
                        display: "flex",
                        margin: "1rem",
                      }}
                    >
                      <img
                        src="/noBanner.png"
                        alt="itemimage"
                        style={{ height: "100%" }}
                      />
                      <h4 style={{ marginLeft: "1rem" }}>{i.name}</h4>
                      <h4 style={{ marginLeft: "auto" }}>₹{i.price}</h4>
                      {!isClosed && (
                        <button
                          style={{
                            width: "100px",
                            height: "40px",
                            margin: "1rem",
                          }}
                          onClick={() => addToCart(i.id)}
                        >
                          Add to cart
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div style={{ padding: "1rem" }}>
        <AskRating
          restaurantId={restaurant.id}
          onRated={(rating) =>
            setRestaurant((prev) =>
              produce(prev, (draft) => {
                if (draft) {
                  draft.ratings[rating - 1]++;
                }
              })
            )
          }
        />
      </div>
      <div style={{ padding: "1rem" }}>
        <h3>Comments</h3>
        <div>
          <textarea
            cols={50}
            rows={5}
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={postComment}>Submit</button>
        </div>
        {restaurant.comments.map((c) => (
          <div style={{ display: "flex" }} key={c.id}>
            <div>
              <img
                src="/noBanner.png"
                alt="profile"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            </div>
            <div>
              <h4>{c.commentator.name}</h4>
              <p>{c.body}</p>
              <p style={{ textAlign: "right" }}>{c.createdAt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetailRestaurant;
