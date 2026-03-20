import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import AuthBackground from '../components/AuthBackground';
import './Auth.scss';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }
    if (isSuccess || user) {
      if (user && user.role === 'admin') {
        window.location.href = '/admin'; // Redirect admins to dashboard
      } else {
        window.location.href = '/'; // Redirect normal users to home
      }
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, dispatch]);

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

  if (isLoading) return <div className="page fade-in"><h1>Loading...</h1></div>;

  return (
    <div className="auth-page fade-in">
      <AuthBackground />
      <div className="auth-form-wrapper">
        <div className="auth-box">
        <h2>Sign In To StreamVault</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Email Address"
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
              placeholder="Password"
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-auth">
            Sign In
          </button>
        </form>
        <p className="auth-redirect">
          New to StreamVault? <a href="/register">Sign up now.</a>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
