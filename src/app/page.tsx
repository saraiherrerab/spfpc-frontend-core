'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import './login.css';
import Imagen from "../components/imageRight/imageRight";
import Swal from "sweetalert2";

export default function Page() {

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const validarUsuario = async (usuario_val: string, clave_acceso_val: string) => {
    try {
      console.log(usuario_val)
      console.log(clave_acceso_val)
      const response = await fetch(`${baseUrl}/validar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario: usuario_val, clave_acceso: clave_acceso_val })
      });
  
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
  
      if (data) {
        // Lógica si el usuario fue encontrado

        const responseRol = await fetch(`${baseUrl}/rol`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id_usuario: data.id_usuario })
        });
        const dataRol = await responseRol.json();
        console.log(dataRol.obtener_rol_usuario)
        if(dataRol.obtener_rol_usuario === "ADMINISTRADOR"){
          Router.push("./Amenu")
        }else if(dataRol.obtener_rol_usuario === "PROFESOR"){
          Router.push("./menu")
        }else if(dataRol.obtener_rol_usuario === "ESTUDIANTE"){
          Router.push("./videojuego")
        }else{
          Router.push("./")
        }

        const usuario = data;
        usuario.rol = dataRol.obtener_rol_usuario
        // Guardar en localStorage
        localStorage.setItem('usuario', JSON.stringify(usuario));

      } else {
        // Lógica si no se encontró el usuario
        Swal.fire({
          icon: "error",
          title: "Error en la validación de usuario",
          text: "El usuario o contraseña son incorrectos"
        });
      }
    } catch (error) {
      console.error('Error al validar usuario:', error);
    }
  }

  const [usuario, setUsuario] = useState('');
  const [claveAcceso, setClaveAcceso] = useState('');


  const Router = useRouter();
    return <>
      <div className="login-container">
        <div className="form-container">
          <div className="input-container">
              <img
                  src="./login-decoracion.png"
                  alt="Decoración Login"
                  className="login-decorativo"
                />
                <p className="titulo-login">Bienvenido explorador, al reino de multiplayer</p>

          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={claveAcceso}
            onChange={(e) => setClaveAcceso(e.target.value)}
          />
          <button type="submit" onClick={() => validarUsuario(usuario,claveAcceso)}>Iniciar sesión</button>
          </div>
        </div>
        <Imagen/>
      </div>
      
    </>
    
  }