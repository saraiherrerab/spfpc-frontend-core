export default async function eliminarEstudiateDeGrupo(id_estudiante_seleccionado: number) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
    const resultado= await fetch(`${baseUrl}/grupos/estudiante/${id_estudiante_seleccionado}/eliminar`,{
                method: 'DELETE', // Método especificado
                mode: 'cors',   // Habilita CORS
                headers: {
                  'Content-Type': 'application/json'
                }
    });
    const resultado_json= await resultado.json();
    console.log(resultado_json);
    return resultado_json
}