import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../features/auth/authSlice';
import FormField from '../components/FormField';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const dispatch = useDispatch();
  const authError = useSelector((s) => s.auth.error);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email address.';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      dispatch(register({ name: form.name, email: form.email, password: form.password }));
    }
  };

  return (
    <div className="auth-box">
      <h1>Create account</h1>
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
        <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
        <FormField label="Confirm password" name="confirm" type="password" value={form.confirm} onChange={handleChange} error={errors.confirm} />
        {authError && <p className="field-error">{authError}</p>}
        <button className="btn btn-primary btn-block" type="submit">Register</button>
      </form>
      <p className="muted center">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}