import React, { useState } from 'react';
import ProjectList from './components/ProjectList';
import AddProject   from './components/AddProject';
import Login        from './components/Login';
import Register     from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth }  from './context/AuthContext';
import './App.css';

function App() {
  // -------- authentication ----------
  const { isAuthenticated, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // -------- main-page state ----------
  const [page, setPage]   = useState('projects');
  const [refresh, setRefresh] = useState(0);

  const handleProjectAdded = () => {
    setPage('projects');
    setRefresh(r => r + 1);
  };

  /* ------------- IF USER NOT SIGNED-IN ------------- */
  if (!isAuthenticated) {
    return showRegister ? (
      <Register onToggleMode={() => setShowRegister(false)} />
    ) : (
      <Login    onToggleMode={() => setShowRegister(true)}  />
    );
  }

  /* ------------- AUTHENTICATED UI ------------- */
  return (
    <div className="App">
      {/* ---------------- Header ---------------- */}
      <header style={{
        background: 'linear-gradient(135deg,#007bff 0%,#0056b3 100%)',
        color:'#fff',padding:'30px 20px',textAlign:'center',
        boxShadow:'0 4px 6px rgba(0,0,0,.1)'
      }}>
        <h1 style={{margin:'0 0 10px',fontSize:'2.5rem',fontWeight:'bold'}}>
          🤝 Community Connect
        </h1>
        <p style={{margin:'0 0 30px',fontSize:'1.2rem',opacity:.9}}>
          Connecting Volunteers with Community Projects
        </p>

        {/* ------------- Navigation ------------- */}
        <nav style={{display:'flex',justifyContent:'center',flexWrap:'wrap'}}>
          <button
            onClick={() => setPage('projects')}
            style={navBtnStyle(page==='projects')}
          >
            🔍 Browse Projects
          </button>
          <button
            onClick={() => setPage('add')}
            style={navBtnStyle(page==='add')}
          >
            ➕ Add Project
          </button>
          <button
            onClick={logout}
            style={navBtnStyle(false)}
          >
            🚪 Log out
          </button>
        </nav>
      </header>

      {/* ---------------- Main ---------------- */}
      <main style={{minHeight:'calc(100vh - 200px)',background:'#f8f9fa'}}>
        <ProtectedRoute> {/* blocks render while auth-check running */}
          {page==='projects' && <ProjectList key={refresh} />}
          {page==='add'      && <AddProject onProjectAdded={handleProjectAdded} />}
        </ProtectedRoute>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer style={{
        background:'#343a40',color:'#fff',textAlign:'center',
        padding:'20px',marginTop:'40px'
      }}>
        <p style={{margin:0,fontSize:'14px'}}>
          © 2025 Community Connect –  Capstone | Made with ❤️
        </p>
      </footer>
    </div>
  );
}

/* ---------- small helper for nav button style ---------- */
const navBtnStyle = active => ({
  backgroundColor: active ? '#fff' : 'transparent',
  color:          active ? '#007bff' : '#fff',
  border:         '2px solid #fff',
  padding:        '12px 24px',
  margin:         '0 10px 10px 10px',
  borderRadius:   '8px',
  cursor:         'pointer',
  fontSize:       '16px',
  fontWeight:     'bold',
  transition:     'all .3s ease'
});

export default App;
