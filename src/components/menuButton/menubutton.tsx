import './menubutton.css';


interface MenuButtonProps {
  imageUrl: string;
  onClick: () => void; 
}

export default function MenuButton({  imageUrl , onClick }: MenuButtonProps) {

  console.log(imageUrl)
  return (
    <button className="menu-button" onClick={onClick}>
        <img src={imageUrl}  className="button-image"/>
    </button>
  );
}