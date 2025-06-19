
export default async function obtenerCursoAlumno(id_grupo: number){
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const datosHorario = await fetch(`${baseUrl}/grupos/curso/${id_grupo}`,{
      method: 'GET', // Método de la solicitud (GET, POST, PUT, DELETE, etc.)
      mode: 'cors',  // **Política CORS: 'cors' permite solicitudes a otros orígenes**
      headers: {
        'Content-Type': 'application/json', // Tipo de contenido que esperamos enviar/recibir
        'Accept': 'application/json'       // Especifica el tipo de respuesta deseada
        // 'Authorization': 'Bearer YOUR_TOKEN' // Ejemplo de cabecera de autorización, si es necesario
      }
    })
    const resultadoConsulta = await datosHorario.json()
    console.log(resultadoConsulta)
    return resultadoConsulta;
  };
