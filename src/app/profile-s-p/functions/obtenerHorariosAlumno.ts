export default async function obtenerHorariosAlumno(id_grupo: number){
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const datosHorario = await fetch(`${baseUrl}/horarios/grupo/${id_grupo}`)
    const resultadoConsulta = await datosHorario.json()
    console.log(resultadoConsulta)
    return resultadoConsulta;
  } catch (error) {
    console.error("Hubo un problema en la función obtenerHorariosAlumno()")
    return []
  }

  };
