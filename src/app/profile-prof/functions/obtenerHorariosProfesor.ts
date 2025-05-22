export default async function obtenerHorariosProfesor(id_profesor: number){
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const datosHorario = await fetch(`${baseUrl}/horarios/profesor/${id_profesor}`)
    const resultadoConsulta = await datosHorario.json()
    console.log(resultadoConsulta)
    return resultadoConsulta
};

