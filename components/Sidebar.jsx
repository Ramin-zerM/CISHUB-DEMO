// src/components/Sidebar.jsx
import React from "react";
import { FaHome, FaTachometerAlt, FaUsers, FaCalendarAlt, FaUserCog, FaSignOutAlt, FaDesktop } from "react-icons/fa";
import { MdDocumentScanner } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import styles from "../styles/Sidebar.module.css"; 
import Link from 'next/link';

const Sidebar = ({ activeMenu }) => {
  const handleLogout = () => {
    signOut(auth).catch(err => alert("Logout failed: " + err.message));
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles["sidebar-logo"]}>
        <span style={{ color: "red" }}>L</span>
        <span style={{ color: "orange" }}>O</span>
        <span style={{ color: "green" }}>G</span>
        <span style={{ color: "deepskyblue" }}>O</span>
      </div>
      <ul className={styles["sidebar-menu"]}>
        <li className={`${styles["sidebar-item"]} ${activeMenu === "home" ? styles.active : ""}`}>
        <Link href="/Home" className={styles.link}><FaHome /> Home</Link>
      </li>
      <li className={`${styles["sidebar-item"]} ${activeMenu === "dashboard" ? styles.active : ""}`}>
        <Link href="/Dashboard" className={styles.link}><FaTachometerAlt /> Dashboard</Link>
      </li>
      <li className={`${styles["sidebar-item"]} ${activeMenu === "users" ? styles.active : ""}`}>
        <Link href="/Users" className={styles.link}><FaUsers /> Users</Link>
      </li>
      <li className={`${styles["sidebar-item"]} ${activeMenu === "events" ? styles.active : ""}`}>
        <Link href="/Events" className={styles.link}><FaCalendarAlt /> Events</Link>
      </li>
      <li className={`${styles["sidebar-item"]} ${activeMenu === "admin" ? styles.active : ""}`}>
        <Link href="/Admin" className={styles.link}><FaUserCog /> Admin</Link>
      </li>
        <li className={styles["scanner"]}><MdDocumentScanner /></li>
        <li className={`${styles.logout} ${styles.link}`} onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
