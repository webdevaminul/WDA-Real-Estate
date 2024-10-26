export default function InfoField({ label, value }) {
  return (
    <p>
      <span className="text-sm">{label}:</span>
      <span className="text-lg text-secondary font-serif"> {value || "No data"}</span>
    </p>
  );
}
