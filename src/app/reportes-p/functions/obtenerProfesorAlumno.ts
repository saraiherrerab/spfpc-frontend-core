export default async function obtenerProfesorGrupo(id_profesor: number){
    const datosHorario = await fetch(`http://localhost:5555/grupos/profesores/${id_profesor}`)
    const resultadoConsulta = await datosHorario.json()
    console.log(resultadoConsulta)
    return resultadoConsulta;
  };
