import './input.css'
interface InputProps {
    placeholder: string;
}
export default function Input({placeholder}:InputProps) {
    return <>
        <input type="text" placeholder={placeholder}></input>
    </>
}


