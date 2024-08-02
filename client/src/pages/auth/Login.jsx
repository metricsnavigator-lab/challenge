import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../../api/apiConfig';
import useAuth from '../../hooks/useAuth';

export default function Login() {
  const { setAccessToken, setCSRFToken, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || '/';
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function onEmailChange(event) {
    setEmail(event.target.value);
  }

  function onPasswordChange(event) {
    setPassword(event.target.value);
  }

  async function onSubmitForm(event) {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('auth/login', JSON.stringify({
        email,
        password,
      }));

      if (response.status === 200) {
        const accessToken = response?.data?.access_token;
        const csrfToken = response.headers["x-csrftoken"];

        if (accessToken && csrfToken) {
          setAccessToken(accessToken);
          setCSRFToken(csrfToken);
          setIsLoggedIn(true);
          setLoading(false);
          navigate(fromLocation, { replace: true });
        } else {
          setError('Invalid response from server.');
          setLoading(false);
        }
      } else {
        setError('Login failed. Please check your credentials and try again.');
        setLoading(false);
      }
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
      setLoading(false);
      console.error('Login error:', error);
    }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={onSubmitForm}>
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            autoComplete="off"
            className="form-control"
            id="email"
            value={email}
            onChange={onEmailChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            autoComplete="off"
            className="form-control"
            id="password"
            value={password}
            onChange={onPasswordChange}
          />
        </div>
        <div className="mb-3">
          {error && <p className="text-danger">{error}</p>}
          <button disabled={loading} className="btn btn-success" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}