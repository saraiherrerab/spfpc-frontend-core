'use client'
import { useEffect, useRef, useState } from "react";
import './styles.css';
import { useRouter } from "next/navigation";
import MenuButton from "../../components/menuButton/menubutton";
import Saludo  from "../../components/saludo/saludo";



interface UsuarioInterface {
  apellido: string
  cedula: string
  clave_acceso: string
  correo: string
  edad: number
  foto: string
  id_usuario: number
  nombre: string
  rol: string
  telefono: string
  usuario: string
}

export default function Amenu() {
  const Router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [usuario, setUsuario] = useState<UsuarioInterface>(
    {
      apellido: "",
      cedula: "",
      clave_acceso: "",
      correo: "",
      edad: 0,
      foto: "",
      id_usuario: 0,
      nombre: "",
      rol: "",
      telefono: "",
      usuario: "",
    }
  )

  useEffect( () => {
    const usuarioJSON = localStorage.getItem('usuario');

    if (usuarioJSON) {
      const usuario = JSON.parse(usuarioJSON);
      console.log(usuario); // Ahora es un objeto usable
      setUsuario({...usuario})
      console.log(usuario)
    }
  }, [])
  
  return <>
    
    <div className="menu background_menu">
      <img src="/boton-salir.png" alt="Salir" className="boton-salir"  onClick={()=>Router.push("/")}/>
      <Saludo usuario="admin"></Saludo>
      <div className="contenedor">
      <div className= "MButtonsContainer">

              <div className="descripcion">
                  <MenuButton imageUrl='./educacion-fisica.png' onClick={()=>Router.push("/Aadmins-lista")}/>
                  <span>MIS DATOS</span>
              </div>
              <div className="descripcion">
                  <MenuButton imageUrl='./game-console.png' onClick={()=>Router.push("/videojuego")}/>
                  <span>JUEGOS</span>
              </div>
              <div className="descripcion">
                  <MenuButton imageUrl='./student.png' onClick={()=>Router.push("/Aestudiantes-lista")}/>
                  <span>ESTUDIANTES</span>
              </div>
              <div className="descripcion">
                  <MenuButton imageUrl='./teacher.png' onClick={()=>Router.push("/Aprofesores-lista")}/>
                  <span>PROFESORES</span>
              </div>
              
              <div className="descripcion">
                  <MenuButton imageUrl='./grupo.png' onClick={()=>Router.push("/GruposYCursos")}/>
                  <span>Cursos</span>
              </div>

              
              
      </div>
      </div>
    </div>
    
  </>
    
  }