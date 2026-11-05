import { useNavigate } from "react-router-dom";

export default function BotonVolver() {
  const navigate = useNavigate();

  function volver() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  return (
    <button className="back-button" onClick={volver}>
      ← Volver
    </button>
  );
}
