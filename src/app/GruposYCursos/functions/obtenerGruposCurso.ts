export default async function obtenerGruposCurso( id_curso_seleccionado: number ) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const resultado= await fetch(`${baseUrl}/cursos/${id_curso_seleccionado}/grupos`,{
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