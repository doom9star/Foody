import React, { useState } from "react";
import NavBar from "../components/Navbar";
import { AllTab, MyTab, SearchTab } from "../components/Tabs";

enum Tabs {
  MY = "my",
  ALL = "all",
  SEARCH = "search",
}

function Home() {
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.ALL);

  return (
    <div>
      <NavBar />
      <div style={{ display: "flex" }}>
        <h5
          onClick={() => {
            if (activeTab !== Tabs.ALL) setActiveTab(Tabs.ALL);
          }}
          style={{
            marginRight: "2rem",
            textDecoration: activeTab === Tabs.ALL ? "underline" : "none",
            cursor: "pointer",
          }}
        >
          All Restaurants
        </h5>
        <h5
          onClick={() => {
            if (activeTab !== Tabs.MY) setActiveTab(Tabs.MY);
          }}
          style={{
            marginRight: "2rem",
            textDecoration: activeTab === Tabs.MY ? "underline" : "none",
            cursor: "pointer",
          }}
        >
          My Restaurants
        </h5>
        <h5
          onClick={() => {
            if (activeTab !== Tabs.SEARCH) setActiveTab(Tabs.SEARCH);
          }}
          style={{
            textDecoration: activeTab === Tabs.SEARCH ? "underline" : "none",
            cursor: "pointer",
          }}
        >
          Search
        </h5>
      </div>
      <div style={{ padding: "2rem" }}>
        {activeTab === Tabs.ALL ? (
          <AllTab />
        ) : activeTab === Tabs.MY ? (
          <MyTab />
        ) : (
          <SearchTab />
        )}
      </div>
    </div>
  );
}

export default Home;
