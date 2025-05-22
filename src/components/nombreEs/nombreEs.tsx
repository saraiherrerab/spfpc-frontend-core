import './nombreEs.css';

interface NombreEsProps {
    Nombre: string;
    Apellido: string;

}

export default function NombreEs({ Nombre, Apellido }: NombreEsProps) {

    return (
        <div className="nombre-container">
            <p className="nombreTitulo">{Nombre}</p>
            <p className="nombreTitulo">{Apellido}</p>
        </div>
    );
}
