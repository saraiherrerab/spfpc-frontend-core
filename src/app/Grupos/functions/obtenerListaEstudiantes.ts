import Estudiante from "../interfaces/estudiante.interface";

export default async function obtenerEstudiantes() : Promise<Estudiante[]>{
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const resultado= await fetch(`${baseUrl}/estudiantes`,{
                method: 'GET', // Método especificado
                mode: 'cors',   // Habilita CORS
                headers: {
                  'Content-Type': 'application/json'
                }
        });
        const resultado_json= await resultado.json();
        console.log(resultado_json);
        return resultado_json

}