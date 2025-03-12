import { useEffect, useState } from "react";

const Header = ({ onLogout }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setUser(null); // Clear user state
    onLogout(); // Call logout function passed from the parent
  };

  return (
    <header className="bg-success text-white text-center py-3 d-flex justify-content-between align-items-center px-3">
      <h1 className="m-0">Notes App</h1>
      {user ? (
        <div>
          <span className="me-3">Hello, {user.username}</span>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
