import React from "react";
import "./nombre.css";

interface NombreProps {
    tituloN: string;
    nombre: string;
  }

export default function Nombre({ tituloN, nombre }: NombreProps) {
    return (
            <div className="nombre-section">
                <span className="tituloNombre">{tituloN}</span>
                <span className="Nombre">{nombre}</span>
            </div>

    );
}