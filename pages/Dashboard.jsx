import Sidebar from '../components/Sidebar';
export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar activeMenu="dashboard"/>
      <main className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">แดชบอร์ดผู้ดูแลระบบ</h1>
        <p>สรุปภาพรวมข้อมูลต่าง ๆ เช่น ผู้ใช้งาน จำนวนกิจกรรม และอื่น ๆ</p>
      </main>
    </div>
  );
}