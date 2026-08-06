import { Routes, Route, Navigate } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle.jsx';
import TopNav from './components/TopNav.jsx';
import Landing from './pages/Landing.jsx';
import CreateRoom from './pages/CreateRoom.jsx';

function Soon({ name }) {
  return (
    <div className="relative min-h-screen p-16">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <ThemeToggle />
      <p className="mt-4 text-[var(--tx3)] font-mono text-sm">{name}</p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/new" element={<CreateRoom />} />
        <Route path="/signup" element={<Soon name="signup" />} />
        <Route path="/signin" element={<Soon name="signin" />} />
        <Route path="/new" element={<Soon name="new room" />} />
        <Route path="/rooms" element={<Soon name="my rooms" />} />
        <Route path="/room/:roomId" element={<Soon name="editor" />} />
        <Route path="/closed" element={<Soon name="room closed" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}