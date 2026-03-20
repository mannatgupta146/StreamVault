import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';
import './Auth.scss';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
      dispatch(reset());
    }
    
    // If a non-admin enters this page while logged in, log them out immediately
    if (user && user.role !== 'admin') {
      dispatch(logout());
      dispatch(reset());
    }
  }, [user, isError, message, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  if (isLoading) return <div className="page fade-in"><h1>Authenticating Admin...</h1></div>;

  return (
    <div className="auth-page admin-auth-page fade-in">
      <AuthBackground />
      <div className="auth-form-wrapper">
        <div className="auth-box admin-auth-box" style={{ borderTop: "4px solid #e50914" }}>
        <h2 style={{ color: "white" }}>Admin Portal</h2>
        <p style={{ textAlign: "center", marginBottom: "2rem", color: "#999", fontSize: "0.9rem" }}>
          Restricted Access. Authorized Personnel Only.
        </p>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Admin Email"
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Admin Password"
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-auth btn-admin-auth">
            Access Dashboard
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
