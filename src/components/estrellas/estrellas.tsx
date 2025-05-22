import "./estrellita.css";

interface EstrellasProps {
  valores: boolean[]; // Array de 3 valores booleanos
}

export default function Estrellas({ valores }: EstrellasProps) {
  const tooltips = ["Primera estrella", "Segunda estrella", "Tercera estrella"];

  return (
    <div className="estrellas-container">
      {valores.map((valido, index) => (
        <div key={index} className="tooltip-wrapper">
          <span className={`estrella ${valido ? "activa" : ""}`}>
            ★
          </span>
          {valido && <div className="tooltip-text">{tooltips[index]}</div>}
        </div>
      ))}
    </div>
  );
}

