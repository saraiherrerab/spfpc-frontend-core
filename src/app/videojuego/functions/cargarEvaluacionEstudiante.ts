import Evaluacion_Estudiante from "../interfaces/informacion_estudiante.interface";

export default async function cargarEvaluacionEstudiante(datos: Evaluacion_Estudiante){
      try {
        const response = await fetch('http://localhost:5555/estudiantes/establecer/notas', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // CORS: solo es necesario en el servidor, pero puedes incluir el header Origin si necesario
          },
          body: JSON.stringify(datos),
          mode: 'cors', // Habilita CORS
        });

        const result = await response.json();
        return result
      } catch (error) {
        console.error("Error al actualizar las notas:", error);
      }
}