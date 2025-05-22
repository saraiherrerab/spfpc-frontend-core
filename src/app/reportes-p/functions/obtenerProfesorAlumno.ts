export default async function obtenerProfesorAlumno(id_profesor: number){
    const datosHorario = await fetch(`http://localhost:5555/profesores/${id_profesor}`)
    const resultadoConsulta = await datosHorario.json()
    console.log(resultadoConsulta)
    return resultadoConsulta;
  };
