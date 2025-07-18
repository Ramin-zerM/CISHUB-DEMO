import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Sidebar from '../components/Sidebar';
import { IoFilterSharp } from "react-icons/io5";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const router = useRouter();
  const filterRef = useRef();

  const getYearFromStudentID = (studentId) => {
    if (!studentId || studentId.length < 2) return '?';
    const prefix = studentId.substring(0, 2);
    const map = { '65': 4, '66': 3, '67': 2, '68': 1 };
    return map[prefix] || '?';
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const data = snapshot.docs.map(doc => {
          const raw = doc.data();
          const year = getYearFromStudentID(raw.studentId);
          const name = raw.firstName && raw.lastName ? `${raw.firstName} ${raw.lastName}` : raw.name;
          return {
            id: doc.id,
            ...raw,
            name,
            year,
          };
        });
        setUsers(data);
        setFiltered(data);
      } catch (error) {
        console.log('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleFilterClick = () => setShowFilter(v => !v);

  const handleFilterSelect = (key) => {
    setFilterBy(key);
    setShowFilter(false);
  };

  const onSearch = (e) => {
    const text = e.target.value;
    setSearch(text);
    let filteredData = users;
    if (filterBy === 'name') {
      filteredData = users.filter(user => user.name?.toLowerCase().includes(text.toLowerCase()));
    } else if (filterBy === 'studentId') {
      filteredData = users.filter(user => user.studentId?.includes(text));
    } else if (filterBy === 'email') {
      filteredData = users.filter(user => user.email?.toLowerCase().includes(text.toLowerCase()));
    } else if (filterBy === 'year') {
      filteredData = users.filter(user => String(user.year) === text);
    } else if (filterBy === 'status') {
      filteredData = users.filter(user => user.status?.toLowerCase().includes(text.toLowerCase()));
    } else {
      filteredData = users.filter(user =>
        user.name?.toLowerCase().includes(text.toLowerCase()) ||
        user.email?.toLowerCase().includes(text.toLowerCase()) ||
        user.studentId?.includes(text)
      );
    }
    setFiltered(filteredData);
  };

  return (
    <div style={{ display: "flex", background: "#f1f1f1", minHeight: "100vh" }}>
      <Sidebar activeMenu="users" />
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="text"
                placeholder="🔍 search"
                value={search}
                onChange={onSearch}
                style={{
                  border: "1px solid #D9D9D9",
                  borderRadius: 30,
                  padding: 10,
                  marginBottom: 0,
                  backgroundColor: "#D9D9D9",
                  width: 1000,
                  color: "#fff",
                  fontSize: 16,
                  marginLeft: 40,
                  paddingLeft: 20,
                }}
                className="users-search-input"
              />
              <button
                type="button"
                onClick={handleFilterClick}
                style={{
                  background: "#fff",
                  border: "1px solid #fff",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  marginLeft: 11,
                  zIndex: 2,
                }}
                ref={filterRef}
                aria-label="Filter"
              >
                <IoFilterSharp  color="#000" size={28} />
              </button>
            {showFilter && (
              <div
                style={{
                  position: "absolute",
                  top: 48,
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  zIndex: 10,
                  minWidth: 180,
                }}
              >
                {[
          { key: "all", label: "All" },
          { key: "name", label: "Name" },
          { key: "studentId", label: "Student ID" },
          { key: "email", label: "Email" },
          { key: "year", label: "Year" },
          { key: "status", label: "Status" },
        ].map(opt => (
          <div
            key={opt.key}
            onClick={() => handleFilterSelect(opt.key)}
            style={{
              padding: "10px 16px",
              cursor: "pointer",
              background: filterBy === opt.key ? "#f1f1f1" : "#fff",
              color: "#333",
            }}
          >
            {opt.label}
          </div>
        ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", fontWeight: "bold",marginTop:92, marginBottom: 10, marginLeft: 40, color: "#000" }}>
            <div style={{ flex: 2 }}>Student ID</div>
            <div style={{ flex: 2 }}>Name</div>
            <div style={{ flex: 3 }}>Email</div>
            <div style={{ flex: 1 }}>Year</div>
            <div style={{ flex: 2 }}>Status</div>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : filtered.length > 0 ? (
            filtered.map(item => (
              <div
                key={item.studentId}
                style={{ display: "flex", padding: "10px 0", borderBottom: "0.5px solid #ccc" , marginLeft: 40,}}
              >
                <span
                  style={{ flex: 2, color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}
                  onClick={() => router.push(`/StudentDetail?id=${item.id}`)}
                >
                  {item.studentId}
                </span>
                <span style={{ flex: 2 }}>{item.name}</span>
                <span style={{ flex: 3 }}>{item.email}</span>
                <span style={{ flex: 1 }}>{item.year}</span>
                <span style={{ flex: 2, color: "green" }}>● {item.status || "Active"}</span>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", marginTop: 20 }}>Data empty</div>
          )}
        </div>
    </div>
  </div>

  );
};

export default Users;

// Add this style block for the placeholder styling
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    .users-search-input::placeholder {
      color: #fff !important;
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
}
