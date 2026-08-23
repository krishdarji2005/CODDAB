import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Home from "./Pages/Home/Home";
import JoinPage from "./Pages/JoinPage/JoinPage";
import EditorPage from "./Pages/EditorPage/EditorPage";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-heading)',
            border: '1px solid var(--border-strong)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent)',
              secondary: 'var(--bg-elevated)',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
    </>
  );
}

export default App;

