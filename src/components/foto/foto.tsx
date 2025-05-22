import './foto.css';


interface FotoProps {
  imageUrl: string;
}

export default function Foto({  imageUrl  }: FotoProps) {
  return (
    <button className="foto-container">
        <img src={imageUrl}  className="foto"/>
    </button>
  );
}