import { useState } from 'react';
import { useRouter } from 'next/router'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth,db } from '../lib/firebase'; 
import styles from '../styles/AdminLogin.module.css';
import Image from 'next/image';
import LoginPopup from '../components/LoginPopup'; 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // เพิ่ม state นี้
  const [error, setError] = useState('');
  const [popup, setPopup] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const q = query(collection(db, 'admin'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const adminData = querySnapshot.docs[0].data();
        const role = adminData.role;
        setPopup({
          success: true,
          message: 'Login Success!',
          subMessage: `Logged in as ${role}`,
        });

        setTimeout(() => {
          setPopup(null);
          if (role === 'admin') {
            router.push('/Home');
          } else if (role === 'staff') {
            router.push('/Scanner');
          } else {
            setPopup({
              success: false,
              message: 'Login Failed!',
              subMessage: 'User role not recognized.',
            });
          }
        }, 1500);
      } else {
        setPopup({
          success: false,
          message: 'Login Failed!',
          subMessage: 'User data not found in Firestore.',
        });
      }
    } catch (err) {
      setPopup({
        success: false,
        message: 'Login Failed!',
        subMessage: 'Invalid Email or Password',
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo} style={{ position: 'relative', width: '100%', height: '150px' }}>
          <Image src="/image/logo.png" alt="Logo" fill style={{ objectFit: 'contain' }} />
        </div>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Email "
            />
          </div>
          <div className={styles.inputGroup} style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Password "
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#888',
                fontSize: 14,
                padding: 0
              }}
              tabIndex={-1}
            >
              {showPassword ? 'ซ่อน' : 'แสดง'}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
      {popup && (
        <LoginPopup
          success={popup.success}
          message={popup.message}
          subMessage={popup.subMessage}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
};

export default AdminLogin;
