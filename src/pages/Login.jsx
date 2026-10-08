import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/auth/authSlice';
import FormField from '../components/FormField';

export default function Login() {
  const dispatch = useDispatch();
  const authError = useSelector((s) => s.auth.error);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = {};
    if (!form.email.trim()) v.email = 'Email is required.';
    if (!form.password) v.password = 'Password is required.';
    setErrors(v);
    if (Object.keys(v).length === 0) dispatch(login(form));
    // On success GuestRoute redirects automatically
  };

  return (
    <div className="auth-box">
      <h1>Welcome back</h1>
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
        <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
        {authError && <p className="field-error">{authError}</p>}
        <button className="btn btn-primary btn-block" type="submit">Log in</button>
      </form>
      <p className="muted center">No account? <Link to="/register">Sign up</Link></p>
    </div>
  );
}