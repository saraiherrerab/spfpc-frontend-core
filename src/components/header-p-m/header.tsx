
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import './header.css'

interface Usuario {
  id_usuario: number;
  telefono: string;
  nombre: string;
  apellido: string;
  correo: string;
  edad: number;
  foto: string;
  usuario: string;
  clave_acceso: string;
  cedula: string;
  id_profesor: number;

};

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

const defaultUsuario: Usuario = {
  id_usuario: 0,
  telefono: "",
  nombre: "",
  apellido: "",
  correo: "",
  edad: 0,
  foto: "",
  usuario: "",
  clave_acceso: "",
  cedula: "",
  id_profesor: 0,

};



export default function Header() {
     const [usuario, setUsuario] = useState<Usuario>(defaultUsuario);
     const router = useRouter();
    
      useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario");
    
        if (usuarioGuardado) {
          try {
            const informacionUsuario: Usuario = JSON.parse(usuarioGuardado);
            setUsuario(informacionUsuario);
          } catch (error) {
            console.error("Error al parsear el usuario desde localStorage:", error);
            setUsuario(defaultUsuario); // fallback en caso de error
          }
        } else {
          setUsuario(defaultUsuario);
        }
      }, []);
    
    
    
   
  return (
    <div className='header-container'>
      <p className="header-logo" onClick={() => router.push("/menu")}>
        MULTIPLAYER
      </p>
      <div className='botones'>
        <p className="header-button" onClick={() => router.push("/videojuego")}>
          Panel de Juegos
        </p>
        <p className="header-button" onClick={() => router.push("/menu")}>
          Menu
        </p>
        <p className="header-button" onClick={() => router.push("/profile-prof/" + usuario.id_usuario)}>
          Mi perfil
        </p>
        <p className="header-button" onClick={() => router.push("/")}>
          Salir
        </p>
      </div>
    </div>
  );
}
