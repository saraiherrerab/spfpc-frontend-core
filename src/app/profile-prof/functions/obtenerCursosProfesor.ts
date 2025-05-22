export default async function obtenerCursosProfesor(id_profesor: number){
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const datosCursos = await fetch(`${baseUrl}/cursos/profesor/${id_profesor}`)
    const resultadoConsulta = await datosCursos.json()
    console.log(resultadoConsulta)
    return resultadoConsulta;
};