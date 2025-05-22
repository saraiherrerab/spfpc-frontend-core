import './notita.css';

interface NotitaProps {
    NotitaTitulo1: string;
    NotitaTitulo2: string;
}

export default function Notita({ NotitaTitulo1, NotitaTitulo2 }: NotitaProps) {

    return (
        <div className="notita-container">
            <p className="notitaTitulo">Profesor: {NotitaTitulo1}</p>
            <p className="notitaTitulo">Nivel: {NotitaTitulo2}</p>
        </div>
    );
}
