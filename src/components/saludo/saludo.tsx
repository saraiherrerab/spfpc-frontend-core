import './saludo.css';


interface SaludoProps {
  usuario: string;
}

export default function Saludo({  usuario }: SaludoProps) {
  return (
    <span className='saludo'>Hola, {usuario} ¿Qué necesitas hoy para hacer tu día más fácil?</span>

    )
}