export default function FormField({ label, name, error, ...inputProps }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} className={error ? 'invalid' : ''} {...inputProps} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}