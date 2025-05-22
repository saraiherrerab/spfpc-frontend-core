export default async function obtenerHorariosGrupo(id_grupo_seleccionado: number) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const resultado= await fetch(`${baseUrl}/horarios/grupo/` + id_grupo_seleccionado,{
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