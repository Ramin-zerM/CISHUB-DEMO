import React, { useState } from 'react';
import styles from '../styles/UserSignup.module.css';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const UserSignup = () => {
  const [form, setForm] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [agree, setAgree] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree || form.password !== form.confirmPassword) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        studentId: form.studentId,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        createdAt: new Date(),
      });

      router.push('/user-login'); // เปลี่ยนเป็น router.push
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2><span className={styles.red}>Sign Up</span> <span className={styles.blue}>CIS</span></h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input name="studentId" placeholder="student ID" onChange={handleChange} required />
        <input name="firstName" placeholder="first name" onChange={handleChange} required />
        <input name="lastName" placeholder="last name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="password" onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="confirm password" onChange={handleChange} required />
        <label>
          <input type="checkbox" onChange={(e) => setAgree(e.target.checked)} />
          I agree to the <a href="#">Terms and Conditions</a>.
        </label>
        <button type="submit" disabled={!agree} className={agree ? styles.btn : styles.btnDisabled}>Sign Up</button>
        <p><a href="/user-login">Login</a></p>
      </form>
    </div>
  );
};

export default UserSignup;
