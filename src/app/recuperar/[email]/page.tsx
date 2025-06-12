"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CambiarContrasenaPage() {
  // Paso 3: Obtener los parámetros de la URL.
  const params = useParams();
  const Router = useRouter();
  
  // El email vendrá codificado en la URL (ej: 'test%40example.com').
  // Lo decodificamos para obtener el valor real.
  // Es importante manejar el caso de que params.email no sea un string.
  const email = typeof params.email === 'string' ? decodeURIComponent(params.email) : '';

  // Paso 4: Definir el estado para los campos del formulario y la UI.
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const aplicationUrl = process.env.NEXT_APLICATION_URL;

  // Usamos la interfaz para darle tipado fuerte a nuestros datos.
  const [data, setData] = useState(
    { 
      id_usuario: 0,
      clave_acceso: ""
    }
  );

  useEffect(() => {
    console.log(email)
    const fetchData = async (correo_usuario: string) => {
      try {
        // La URL de la API que quieres consumir.
        const response = await fetch(`${baseUrl}/usuario/correo/${correo_usuario}`);

        // Si la respuesta no es exitosa (ej: error 404 o 500), lanzamos un error.
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        // Convertimos la respuesta a formato JSON.
        const jsonData = await response.json();

        console.log(jsonData)

        // Actualizamos el estado con los datos recibidos.
        setData(jsonData);

      } catch (err: any) {
        // Si ocurre cualquier error en el bloque try, lo capturamos aquí.
        setError(err.message);

      }
    };

    fetchData(email)
  },[])

  // Paso 5: Función para manejar el envío del formulario.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita que la página se recargue.
    setError('');
    setSuccessMessage('');

    // Validación básica
    if (!password || !confirmPassword) {
      setError('Ambos campos son obligatorios.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.');
        return;
    }

    setIsLoading(true);

    // Aquí es donde harías la llamada a tu API para cambiar la contraseña.
    try {
      const response = await fetch(`${baseUrl}/usuario/cambiar/clave`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          { 
            id_usuario: data.id_usuario,
            clave_acceso: password 
          }
        ),
      });

      if (!response.ok) {
        // Si la API devuelve un error, lo mostramos.
        const data = await response.json();
        throw new Error(data.message || 'Ocurrió un error.');
      }

      // Si todo sale bien.
      setSuccessMessage('¡Contraseña actualizada con éxito!');
      setPassword('');
      setConfirmPassword('');
      Router.push("/")

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Paso 6: Renderizar el JSX del formulario.
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Cambiar Contraseña</h1>
      <p>Actualizando contraseña para: <strong>{email}</strong></p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Nueva Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
    </div>
  );
}