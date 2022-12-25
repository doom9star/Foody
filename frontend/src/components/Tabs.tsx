import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CAxios } from "../constants";
import { IRestaurant, RestaurantStatus } from "../types";

export function AllTab() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);

  useEffect(() => {
    CAxios.get("/restaurant/many/all", {
      params: {
        type: "all",
      },
    }).then(({ data }) => {
      setRestaurants(data);
    });
  }, [setRestaurants]);
  return (
    <div
      style={{
        padding: "2rem",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
      }}
    >
      {restaurants.map((r) => (
        <Link
          to={`/home/restaurant/${r.id}`}
          key={r.id}
          style={{
            width: "250px",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img src="/noBanner.png" alt="noBanner" style={{ width: "100%" }} />
          <h6
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                margin: "1rem",
                backgroundColor:
                  r.status === RestaurantStatus.OPEN ? "green" : "red",
              }}
            />
            <span>{r.name}</span>
          </h6>
        </Link>
      ))}
    </div>
  );
}

export function MyTab() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);

  useEffect(() => {
    CAxios.get("/restaurant/many/my", {
      params: { type: "my" },
    }).then(({ data }) => {
      setRestaurants(data);
    });
  }, [setRestaurants]);
  return (
    <div
      style={{
        padding: "2rem",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
      }}
    >
      {restaurants.map((r) => (
        <Link
          to={`/home/restaurant/${r.id}`}
          key={r.id}
          style={{
            width: "250px",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img src="/noBanner.png" alt="noBanner" style={{ width: "100%" }} />
          <h6
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                margin: "1rem",
                backgroundColor:
                  r.status === RestaurantStatus.OPEN ? "green" : "red",
              }}
            />
            <span>{r.name}</span>
          </h6>
        </Link>
      ))}
    </div>
  );
}
export function SearchTab() {
  const [query, setQuery] = useState("");
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (query.trim().length > 1) {
      setLoading(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        CAxios.get("/restaurant/many/search", {
          params: { type: "search", query },
        }).then(({ data }) => {
          setRestaurants(data);
          setLoading(false);
        });
      }, 2000);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setLoading(false);
    }
  }, [query]);

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
      <h3>Search for restaurants...</h3>
      <input
        type={"text"}
        placeholder={"Search"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.trim().length < 2 ? null : loading ? (
        <div>Loading...</div>
      ) : (
        restaurants.map((r) => (
          <Link
            to={`/home/restaurant/${r.id}`}
            key={r.id}
            style={{
              width: "250px",
              height: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <img src="/noBanner.png" alt="noBanner" style={{ width: "100%" }} />
            <h6>{r.name}</h6>
          </Link>
        ))
      )}
    </div>
  );
}
