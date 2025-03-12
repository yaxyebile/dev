import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/login";
import Signup from "./components/signup";
import Header from "./components/header";
import Form from "./components/form";
import Main from "./components/main";

const App = () => {
  const [refreshNotes, setRefreshNotes] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );
  

  const handleNoteAdded = () => {
    setRefreshNotes((prev) => !prev);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div className="container mt-5">
        <div className="card shadow-sm">
          {isAuthenticated && <Header onLogout={handleLogout} />}
          <div className="card-body">
            <Routes>
              <Route
                path="/login"
                element={
                  isAuthenticated ? <Navigate to="/" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />
                }
              />
              <Route
                path="/signup"
                element={
                  isAuthenticated ? <Navigate to="/" replace /> : <Signup setIsAuthenticated={setIsAuthenticated} />
                }
              />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <>
                      <h2 className="text-center">Dashboard</h2>
                      <p className="text-muted text-center">Your Notes Overview</p>
                      <Form onNoteAdded={handleNoteAdded} />
                      <Main refreshNotes={refreshNotes} />
                    </>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
