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
                <div className="campo-usuario">
                  <input
                    type="text"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </div>

                <div className="campo-clave">
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input
                        type={mostrarClave ? 'text' : 'password'}
                        placeholder="Clave"
                        value={claveAcceso}
                        onChange={(e) => setClaveAcceso(e.target.value)}
                        />
                        <img
                        src={mostrarClave ? '/icons/ojito-abierto.png' : '/icons/ojito-cerrado.png'}
                        alt="Mostrar/Ocultar Clave"
                        onClick={() => setMostrarClave(prev => !prev)}
                        style={{
                            position: 'absolute',
                            right: '0px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                            opacity: 0.7
                        }}
                        />
                    </div>
                    </div>

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