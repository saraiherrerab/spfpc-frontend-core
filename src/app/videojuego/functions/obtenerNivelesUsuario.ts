export default async function obtenerNivelesUsuario(id_usuario: number){
      try {
        const response = await fetch('http://localhost:5555/niveles/usuario/' + id_usuario, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // CORS: solo es necesario en el servidor, pero puedes incluir el header Origin si necesario
          },
          mode: 'cors', // Habilita CORS
        });

        const result = await response.json();
        return result
      } catch (error) {
        console.error("Error al actualizar las notas:", error);
      }
}