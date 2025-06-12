import './menubutton.css';
import Image from 'next/image'

interface MenuButtonProps {
  imageUrl: string;
  onClick: () => void; 
}

export default function MenuButton({  imageUrl , onClick }: MenuButtonProps) {

  console.log(imageUrl)
  return (
    <button className="menu-button" onClick={onClick}>
        <Image src={imageUrl}  className="button-image" alt="Picture of the author" width={500} height={500}/>
    </button>
  );
}