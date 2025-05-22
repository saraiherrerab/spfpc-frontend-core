'use client'
import { useEffect, useRef, useState } from "react";
import './styles.css';
import { useRouter } from "next/navigation";
import MenuButton from "../../components/menuButton/menubutton";
import Saludo  from "../../components/saludo/saludo";

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

export default function Menu() {
  const Router = useRouter();

// Define el tipo de usuario si no lo tienes ya


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


  const [usuario, setUsuario] = useState<Usuario>(defaultUsuario);

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


    return <>
      <canvas id="menu" style={{ width: "100vw", height: "100vh", position:"relative" }} />
      
      <div className="menu">
        <img src="/boton-salir.png" alt="Salir" className="boton-salir"  onClick={()=>Router.push("/")}/>
        <Saludo usuario="profesor"></Saludo>
        <div className="contenedor">
        <div className= "MButtonsContainer">
                <div className="descripcion">
                    <MenuButton imageUrl='./game-console.png' onClick={()=>Router.push("/videojuego")}/>
                    <span>JUEGOS</span>
                </div>
                
                <div className="descripcion">
                    <MenuButton imageUrl='./student.png' onClick={()=>Router.push("/Pestudiantes-lista")}/>
                    <span>ESTUDIANTES</span>
                </div>
                
                <div className="descripcion">
                    <MenuButton imageUrl='./teacher.png' onClick={()=>Router.push("/profile-prof/"+usuario.id_usuario)}/>
                    <span>MI PERFIL</span>
                </div>
                
        </div>
        </div>
      </div>
     
    </>
    
  }