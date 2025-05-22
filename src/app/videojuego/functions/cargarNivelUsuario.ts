export default async function cargarEvaluacionEstudiante(id_usuario: number, id_nivel : number, estatus: string){
      try {
        const response = await fetch(`http://localhost:5555/niveles/${id_nivel}/usuario/${id_usuario}/agregar/estatus/${estatus}`, {
          method: 'POST',
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
        console.error("Error al agregar nivel:", error);
      }
}