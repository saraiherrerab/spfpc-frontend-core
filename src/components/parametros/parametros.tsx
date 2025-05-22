import { useEffect, useState } from 'react';
import './parametros.css';

interface ParametrosProps {
    parametroTitulo1: string;
    parametroTitulo2: string;
}

export default function Parametros({ parametroTitulo1, parametroTitulo2 }: ParametrosProps) {

    const [colorMensaje, setColorMensaje] = useState<string>("")

    useEffect(() => {
        if(parametroTitulo2){
        switch(parametroTitulo2){
            case "NO CURSADO":
                setColorMensaje("negro")
            break;
            case "NO APROBADO":
                setColorMensaje("rojo")
            break;
            case "APROBADO":
                setColorMensaje("verde")
            break;
            case "EN RPOCESO":
                setColorMensaje("azul")
            break;
            default: 
                setColorMensaje("negro")
            break;
        }
    }
    },[parametroTitulo2]);

    

    return (
        <div className="parametros-container">
            <p className="parametroTitulo1 parametros-texto">{parametroTitulo1}</p>
            <p className={`parametroTitulo2 parametros-texto ${colorMensaje}`}>{parametroTitulo2}</p>
        </div>
    );
}
