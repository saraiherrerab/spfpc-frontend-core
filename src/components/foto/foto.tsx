import { useEffect } from 'react';
import './foto.css';
import Image from 'next/image'

interface FotoProps {
  imageUrl: string;
}

export default function Foto({  imageUrl  }: FotoProps) {
  useEffect(() => {
    console.log('Contenido de imageUrl:', imageUrl);
  }, [imageUrl]);

  return (
    <button className="foto-container">
        <Image src={(imageUrl==='imagenvacia.png')?'/'+imageUrl:imageUrl}  className="foto" alt="Picture of the author" width={500} height={500}/>
    </button>
  );
}