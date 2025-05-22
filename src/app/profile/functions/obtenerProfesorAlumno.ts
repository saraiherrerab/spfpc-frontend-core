export default async function obtenerProfesorAlumno(id_profesor: number){
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const datosHorario = await fetch(`${baseUrl}/profesores/${id_profesor}`)
    const resultadoConsulta = await datosHorario.json()
    console.log(resultadoConsulta)
    return resultadoConsulta;
  };
