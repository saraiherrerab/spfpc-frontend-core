export default async function obtenerGrupoAlumno(id_grupo: number){
    const datosHorario = await fetch(`http://localhost:5555/grupos/${id_grupo}`)
    const resultadoConsulta = await datosHorario.json()
    console.log(resultadoConsulta)
    return resultadoConsulta;
  };
