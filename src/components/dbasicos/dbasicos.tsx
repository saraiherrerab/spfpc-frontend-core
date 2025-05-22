import React from "react";
import "./dbasicos.css";

interface DatosProps {
    titulo: string;
    descripcion: string;
  }

export default function Datos({ titulo, descripcion }: DatosProps) {
    return (
            <div className="datos-section">
                <span className="tituloDatos">{titulo}</span>
                <span className="descripcion">{descripcion}</span>
            </div>

    );
}