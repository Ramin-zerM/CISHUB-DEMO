import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const StudentDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.log('No id in query');
      return;
    }
    const getStudentData = async () => {
      try {
        console.log('Fetching doc id:', id);
        const studentRef = doc(db, 'users', id);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          console.log('Student data:', studentSnap.data());
          setStudent(studentSnap.data());
        } else {
          console.log('No student found for id:', id);
          setStudent(null);
        }
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };
    getStudentData();
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteDoc(doc(db, 'users', id));
        alert('Student deleted');
        router.push('/users');
      } catch (err) {
        console.error('Error deleting student:', err);
        alert('Error deleting student');
      }
    }
  };

  const handleSuspend = async () => {
    try {
      const studentRef = doc(db, 'users', id);
      await updateDoc(studentRef, { status: 'Suspended' });
      alert('Student suspended');
      setStudent({ ...student, status: 'Suspended' });
    } catch (err) {
      console.error('Error suspending student:', err);
      alert('Error suspending student');
    }
  };

  if (loading) return <div style={{ marginTop: 50, textAlign: 'center' }}>Loading...</div>;
  if (!student) return <div style={{ textAlign: 'center', marginTop: 40 }}>Data empty</div>;


  const {
    firstName = '?',
    lastName = '?',
    email = '?',
    studentId: sid = '?',
    createdAt,
    status = '?',
    points = '?',
    history = [],
  } = student;

  let createdDate = '?';
  if (createdAt) {
    const date = createdAt.seconds
      ? new Date(createdAt.seconds * 1000)
      : new Date(createdAt);
    createdDate = date.toLocaleString('en-GB', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 12 }}>
      <h2>Student</h2>
      <div style={{ background: '#f6f8ff', borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 16 }}>
              {firstName} {lastName}
            </div>
            <div style={{ color: '#555' }}>{email}</div>
            <div style={{ color: 'green', marginTop: 2 }}>
              🟢 {status}
            </div>
          </div>
          <div style={{ background: '#facc15', borderRadius: 20, padding: '4px 10px', fontWeight: 'bold' }}>
            {points} Points
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <span style={{ fontWeight: 'bold' }}>Student ID</span>
          <span>{sid}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <span style={{ fontWeight: 'bold' }}>Full Name</span>
          <span>{firstName} {lastName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <span style={{ fontWeight: 'bold' }}>Email</span>
          <span>{email}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <span style={{ fontWeight: 'bold' }}>Created At</span>
          <span>{createdDate}</span>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <button
            onClick={handleDelete}
            style={{ background: 'red', color: '#fff', borderRadius: 6, border: 'none', padding: '8px 16px' }}
          >
            🗑 Delete
          </button>
          <button
            onClick={handleSuspend}
            style={{ background: '#ccc', borderRadius: 6, border: 'none', padding: '8px 16px' }}
          >
            🚫 Suspend
          </button>
        </div>
      </div>

      <h3>Point History</h3>
      {history.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888' }}>No point history available</div>
      ) : (
        history.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: '#f9fafb',
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
              borderLeft: '4px solid #22c55e'
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>{item.date || '?'}</div>
              <div style={{ color: '#444' }}>{item.title || '?'}</div>
            </div>
            <div style={{ fontWeight: 'bold', color: 'green', alignSelf: 'center' }}>
              +{item.points || '?'} Points
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentDetail;
