import './foto.css';
import Image from 'next/image'

interface FotoProps {
  imageUrl: string;
}

export default function Foto({  imageUrl  }: FotoProps) {
  return (
    <button className="foto-container">
        <Image src={imageUrl}  className="foto" alt="Picture of the author" width={500} height={500}/>
    </button>
  );
}