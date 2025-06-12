'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import './login.css';
import Imagen from "../components/imageRight/imageRight";
import Swal from "sweetalert2";
import Image from 'next/image'
export default function Page() {

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const aplicationUrl = process.env.NEXT_PUBLIC_APLICATION_URL;

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
  // Nuevo estado para controlar la vista (login o recuperación)
  const [isRecovering, setIsRecovering] = useState(false);
  const [mostrarClave, setMostrarClave] = useState(false);
  const toggleMostrarClave = () => {
    setMostrarClave(!mostrarClave);
  };

  // Nuevo estado para el campo de recuperación (correo o usuario)
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');

  // --- Nueva función para manejar la recuperación de contraseña ---
  const handlePasswordRecovery = async (identifier: string) => {
    if (!identifier) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor, ingresa tu usuario o correo electrónico."
      });
      return;
    }

    try {
      // **AQUÍ VA TU LÓGICA DE API**
      // Se asume un endpoint como /recuperar-clave que espera un email o usuario
      console.log(`Iniciando recuperación para: ${identifier}`);
      const response = await fetch(`${baseUrl}/enviar-correo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {
            "to": identifier,
            "subject": "Restablecer tu contraseña",
            "text": `Para continuar, haz clic en el siguiente enlace: ${aplicationUrl}/recuperar/${identifier}`
          }
        )
      });

      if (!response.ok) {
        throw new Error("El servidor no pudo procesar la solicitud");
      }
      

      // Si la petición es exitosa, muestra un mensaje genérico
      await Swal.fire({
        icon: "success",
        title: "Petición Enviada",
        text: "Si existe una cuenta asociada, recibirás un correo con las instrucciones para recuperar tu contraseña."
      });

      // Regresa a la vista de login
      setIsRecovering(false);
      setRecoveryIdentifier('');

    } catch (error) {
      console.error('Error en la recuperación:', error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo completar la solicitud. Por favor, inténtalo más tarde."
      });
    }
  }


  const Router = useRouter();
  // --- Renderizado del Componente ---
  return (
    <div className="login-container">
      <div className="form-container">
        <div className="input-container">
          <Image
            src="/login-decoracion.png"
            alt="Decoración Login"
            className="login-decorativo"
            width={200}
            height={150}
          />

          {isRecovering ? (
            // --- Interfaz de Recuperación de Contraseña ---
            <>
              <p className="titulo-login">Recupera tu acceso</p>
              <p className="recovery-instructions">
                Ingresa tu usuario o correo electrónico para continuar.
              </p>
              <input
                type="text"
                placeholder="Usuario o Correo electrónico"
                value={recoveryIdentifier}
                onChange={(e) => setRecoveryIdentifier(e.target.value)}
              />
              <button type="button" onClick={() => handlePasswordRecovery(recoveryIdentifier)}>
                Enviar Instrucciones
              </button>
              <a href="#" className="back-to-login" onClick={() => setIsRecovering(false)}>
                &larr; Volver a iniciar sesión
              </a>
            </>
          ) : (
            // --- Interfaz de Login (Corregida) ---
            <>
              <p className="titulo-login">Bienvenido explorador, al reino de multiplayer</p>
              
              
              {/*// <-- 1. Contenedor con posicionamiento relativo -->*/}
              <div style={{ width: '100%', display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  style={{ width: '100%', padding: '12px 40px 12px 12px' }}
                />
                <input
                  type={mostrarClave ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={claveAcceso}
                  onChange={(e) => setClaveAcceso(e.target.value)}
                  // 1. Aumentamos el padding para dar espacio suficiente al ícono
                  style={{ width: '100%', padding: '12px 40px 12px 12px' }}
                />
                <span
                    onClick={toggleMostrarClave}
                    // 2. Aquí está la corrección clave para el ícono
                    style={{
                        position: 'absolute', 
                        cursor: 'pointer',
                        fontSize: '18px',
                        top: "60.8%",
                        right: "60%"
                    }}
                >
                    {mostrarClave ? 
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
                      <path d="M0 0h24v24H0V0z" fill="none"/>
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg> 
                    : 
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
                      <path d="M0 0h24v24H0V0z" fill="none"/>
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>}
                </span>
            </div>

              <button type="submit" onClick={() => validarUsuario(usuario, claveAcceso)}>
                Iniciar sesión
              </button>
              <a href="#" className="forgot-password" onClick={() => setIsRecovering(true)}>
                ¿Olvidaste tu contraseña?
              </a>
            </>
          )}
        </div>
      </div>
      <Imagen />
    </div>
  );
    
  }