import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./components/Route";
import { CAxios } from "./constants";
import Cart from "./pages/Cart";
import DetailRestaurant from "./pages/DetailRestaurant";
import EditRestaurant from "./pages/EditRestaurant";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NewRestaurant from "./pages/NewRestaurant";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import { useCtx } from "./state";
import { isObject } from "./utils";

function Router() {
  const { setUser } = useCtx();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CAxios.get("/auth").then(({ data }) => {
      if (isObject(data)) {
        setUser(data);
      }
      setLoading(false);
    });
  }, [setUser]);

  if (loading) return <div>Loading....</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/home/new-restaurant"
          element={
            <PrivateRoute>
              <NewRestaurant />
            </PrivateRoute>
          }
        />
        <Route
          path="/home/restaurant/:id"
          element={
            <PrivateRoute>
              <DetailRestaurant />
            </PrivateRoute>
          }
        />
        <Route
          path="/home/restaurant/:id/edit"
          element={
            <PrivateRoute>
              <EditRestaurant />
            </PrivateRoute>
          }
        />
        <Route
          path="/home/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/home/my_orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
