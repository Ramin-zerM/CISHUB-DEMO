import { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import styles from '../styles/Scanner.module.css'; // สร้างไฟล์ CSS แยก

// import แบบ dynamic เพื่อให้ทำงานเฉพาะฝั่ง client
const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false });

const Scanner = () => {
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const router = useRouter();

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      console.log('Scanned QR:', data);
      // TODO: ดำเนินการกับ QR ที่สแกนได้
    }
  };

  const handleError = (err) => {
    console.error('QR Scan Error:', err);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/AdminLogin')}>
          ←
        </button>
        <h1>User Check-in Scanner</h1>
      </div>

      <div className={styles.scannerBox}>
        {!cameraAllowed ? (
          <div className={styles.permissionPopup}>
            <p>Please allow camera access to enable<br />QR Code scanning.<br />If you agree, click ‘Allow’ to continue.</p>
            <button className={styles.allowBtn} onClick={() => setCameraAllowed(true)}>
              📷 Allow
            </button>
          </div>
        ) : (
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
        )}
      </div>

      <div className={styles.footer}>
        <p>Check-in</p>
        <button onClick={() => setScanResult(null)} className={styles.refreshBtn}>🔄</button>
      </div>
    </div>
  );
};

export default Scanner;
