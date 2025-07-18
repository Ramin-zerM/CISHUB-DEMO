import React, { useState } from 'react';
import styles from '../styles/UserLogin.module.css';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/HomeUser'); 
    } catch (error) {
      alert('Login failed. Please check credentials.');
    }
  };

  return (
    <div className={styles.container}>
      <h2><span className={styles.blue}>Login</span> <span className={styles.red}>CIS</span></h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} required />
        <p className={styles.forgot}>forgot password?</p>
        <button className={styles.btn}>Login</button>
        <p>You don’t have any account? <a href="/user-signup">Sign Up</a></p>
      </form>
    </div>
  );
};

export default UserLogin;
