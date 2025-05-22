
import './header.css'

interface HeaderProps {
    text: string;
    onClick: () => void; 
    text1: string;
    onClick1: () => void; 
    text2: string;
    onClick2: () => void; 
    text3: string;
    onClick3: () => void; 
    text4: string;
    onClick4: () => void; 
}
export default function Header({ text, onClick, text1, onClick1, text2, onClick2,text3, onClick3, text4, onClick4}: HeaderProps) {
    return (
        <>
        
        <div className='header-container'>
            <p className="header-logo" onClick={onClick}>
                    {text}
            </p>
            <div className='botones'>
                <p className="header-button" onClick={onClick1}>
                    {text1}
                </p>
                <p className="header-button" onClick={onClick2}>
                    {text2}
                </p>
                <p className="header-button" onClick={onClick3}>
                    {text3}
                </p>
                <p className="header-button" onClick={onClick4}>
                    {text4}
                </p>
            </div>
                
        </div>
        

        </>

        
    );
}