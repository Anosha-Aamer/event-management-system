export function Spinner({ text = 'Loading...' }) {
  return (
    <div className="center-box">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="error-box">
      <p>{message}</p>
      {onRetry && <button className="btn" onClick={onRetry}>Try again</button>}
    </div>
  );
}