export default async function obtenerGrupoAlumno(id_grupo: number){
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const datosHorario = await fetch(`${baseUrl}/grupos/${id_grupo}`)
    const resultadoConsulta = await datosHorario.json()
    console.log(resultadoConsulta)
    return resultadoConsulta;
  };
