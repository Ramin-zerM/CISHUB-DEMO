// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../lib/firebase"; 
import Sidebar from "../components/Sidebar";

const Home = () => {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserEmail(user.email);
      } else {
        window.location.href = "/admin-login"; 
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ display: "flex", background: "#f1f1f1", minHeight: "100vh" }}>
      <Sidebar activeMenu="home" />
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        minHeight: "100vh"
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "3rem",
          width: "100%",
          height: "100%",
          maxWidth: "1152px",
          maxHeight: "650px",
        }}>
          <h1 style={{ color: "#ff0066", fontSize: "2.5rem" }}>
            Welcome, {userEmail} 🥳
          </h1>
          <p style={{ color: "#ff3385", fontSize: "1.2rem" }}>
            How was your day?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
