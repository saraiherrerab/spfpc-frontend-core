

  'use client';

import { useEffect, useState } from "react";
import './styles.css';
import '../../login.css'

import Notas from "../../../components/dnotas/dnotas";
import Foto from "../../../components/foto/foto";
import Datos from "../../../components/dbasicos/dbasicos";
import Nombre from "../../../components/nombre/nombre";
import { useParams } from 'next/navigation'; // Importa useParams
import { useRouter } from "next/navigation";
import obtenerHorariosAlumno from "../functions/obtenerHorariosAlumno";
import Horario from "../interfaces/horario.interface";
import Curso from "../interfaces/curso.interface";
import obtenerCursoAlumno from "../functions/obtenerCursoAlumno";
import obtenerGrupoAlumno from "../functions/obtenerGrupoAlumno";
import Grupo from "../interfaces/grupo.interface";
import obtenerProfesorAlumno from "../functions/obtenerProfesorAlumno";
import Header from "../../../components/header-p/header"

interface Estudiante {
  id_usuario: number,
  telefono: string,
  nombre: string,
  apellido: string,
  correo: string,
  edad: number,
  foto: string,
  usuario: string,
  clave_acceso: string,
  cedula: string,
  id_estudiante: number,
  condicion_medica: string,
  eficiencia_algoritmica: number,
  reconocimiento_patrones: boolean, 
  abstraccion: boolean,
  asociacion: boolean,
  construccion_algoritmos: boolean,
  p_actividades_completadas: number,
  tipo_premiacion: string,
  id_grupo: number,
  rol: string
}

export default function Profile() {
  const params = useParams(); // Usa el hook useParams para acceder a los params
  const profileId = params.id;
  console.log("ID de la ruta dinámica:", profileId);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [usuario, setUsuario] = useState<Estudiante>(
    {
      id_usuario: 0,
      telefono: "",
      nombre: "",
      apellido: "",
      correo: "",
      edad: 0,
      foto: "",
      usuario: "",
      clave_acceso: "",
      cedula: "",
      id_estudiante: 0,
      condicion_medica: "",
      eficiencia_algoritmica: 0,
      reconocimiento_patrones: false,
      abstraccion: false,
      asociacion: false,
      construccion_algoritmos: false,
      p_actividades_completadas: 0,
      tipo_premiacion: "",
      id_grupo: 0,
      rol: ""
    }
  );
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [cursoAlumno, setCursoAlumno] = useState<Curso>({
    id_curso: 0,
    nombre_curso: ""
  })
  const [grupoAlumno, setGrupoAlumno] = useState<Grupo>({
    id_grupo: 0,
    nombre_grupo: "",
    id_curso: 0,
    id_profesor_grupo: 0
  })

  const [profesorAlumno,setProfesorAlumno] = useState({
    id_usuario: 0,
    telefono: "",
    nombre: "",
    apellido: "",
    correo: "",
    edad: 0,
    foto: "",
    usuario: "",
    clave_acceso: "",
    cedula: "",
    id_profesor: 0,
    curriculum: "",
    formacion: ""
  })


  const [descargandoImagen, setDescargandoImagen] = useState(false);
  const [imagenDescargadaUrl, setImagenDescargadaUrl] = useState<string | null>(null);

  async function descargarImagenPerfil(nombreArchivo: string) {
    setDescargandoImagen(true);
    const urlDescarga = `/descargar/imagen/${nombreArchivo}`;

    try {
      const response = await fetch(`${baseUrl}${urlDescarga}`);
      console.log(response);

      if (!response.ok){

        try {
            setDescargandoImagen(false);
            console.log("IMAGEN VACIA")
            const fotoVacia = await fetch('/imagenvacia.png');
        
            if (!fotoVacia.ok) {
                throw new Error('No se pudo obtener la imagen.');
            }
        
            const imagenBlob = await fotoVacia.blob();
        
            // Ahora tienes la imagen en la variable `imagenBlob`
            console.log('Imagen obtenida correctamente:', imagenBlob);
            const archivo = new File([imagenBlob], 'imagenvacia.png', { type: imagenBlob.type });
            // Crear un objeto File a partir del Blob
            
            setImagenDescargadaUrl('imagenvacia.png')
        
            return;
        } catch (error) {
            console.error('Error al obtener la imagen:', error);
            return;
        }
        
      }

      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      setImagenDescargadaUrl(urlBlob);
      setDescargandoImagen(false);
      console.log('Imagen de perfil descargada y URL creada.');

    } catch (error) {
      console.error('Error al realizar la petición de descarga:', error);
      alert('Error al realizar la petición de descarga.');
      setDescargandoImagen(false);
    }
  }


  const [ informacionGrupoSinHorario, setInformacionGrupoSinHorario ] = useState<{
      apellido: string,
      id_curso: number,
      id_grupo: number,
      id_profesor: number,
      nombre: string,
      nombre_curso: string,
      nombre_grupo: string
  }[]>(
    [
      {
        apellido: "",
        id_curso: 0,
        id_grupo: 0,
        id_profesor: 0,
        nombre: "",
        nombre_curso: "",
        nombre_grupo: ""
        }
    ]
  )

  const obtenerDatosUsuario = async () => {
    
    const datosEstudiante = await fetch(`${baseUrl}/estudiantes/` + profileId)
    const resultadoConsulta = await datosEstudiante.json()
    console.log(resultadoConsulta)
    const responseRol = await fetch(`${baseUrl}/rol`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_usuario: resultadoConsulta.id_usuario })
    });
    const dataRol = await responseRol.json();
    console.log(dataRol.obtener_rol_usuario)

    try {

      if(resultadoConsulta.id_grupo){
        const resultadoHorarios = await obtenerHorariosAlumno(resultadoConsulta.id_grupo)
        console.log(resultadoHorarios)
        setHorarios ([...resultadoHorarios])
      }else{
        setHorarios ([])
      }

      
      
    } catch (error) {

      console.log(error)
      
    }

    console.log(horarios)

    setUsuario({...resultadoConsulta, rol: dataRol.obtener_rol_usuario})

    const informacionCurso = await obtenerCursoAlumno(resultadoConsulta.id_grupo)
    setCursoAlumno(informacionCurso)

    const informacionGrupo = await obtenerGrupoAlumno(resultadoConsulta.id_grupo)
    setGrupoAlumno(informacionGrupo)

    if(informacionGrupo){
      const informacionProfesor = await obtenerProfesorAlumno(informacionGrupo.id_profesor_grupo)
      setProfesorAlumno(informacionProfesor)
    }else{
      setProfesorAlumno({
        id_usuario: 0,
        telefono: "",
        nombre: "",
        apellido: "",
        correo: "",
        edad: 0,
        foto: "",
        usuario: "",
        clave_acceso: "",
        cedula: "",
        id_profesor: 0,
        curriculum: "",
        formacion: ""
      })
    }

    

    await descargarImagenPerfil(`User-${resultadoConsulta.id_usuario}.png`);

    }

  
  useEffect(() => {
    obtenerDatosUsuario();
    return () => {
      if (imagenDescargadaUrl) {
        window.URL.revokeObjectURL(imagenDescargadaUrl);
      }
    };
  }, []);

  const Router = useRouter();

  return (
    <>
    <Header>
    </Header>
    <div className="perfil body_profile">
            <div className="datosUsario">
              {imagenDescargadaUrl ? (
              <Foto imageUrl={imagenDescargadaUrl} />
            ) : (
              <p>{descargandoImagen ? 'Cargando imagen...' : 'Cargando imagen...'}</p>
            )}
            <div className="titulo">
            <Nombre tituloN={(usuario.rol != null || usuario.rol != "" ) ? usuario.rol : ""} nombre={usuario.nombre + " " + usuario.apellido}></Nombre>
            </div>
            <Datos titulo="Cedula" descripcion={ usuario.cedula }></Datos>
            <Datos titulo="Edad" descripcion={ usuario.edad.toString() }></Datos>
            <button onClick={()=>Router.push("/reportes-p/" + profileId)}>Ver Reportes</button>
          </div>
          <div className="datosBloques">
                          <div className="fila">
                              <div className="notas">
                                  <Notas titulo="Contacto" descripcionN={
                                      [
                                          {titulo: "Teléfono", descripcion: usuario.telefono},
                                          {titulo: "Correo", descripcion: usuario.correo},
                                      ]}></Notas>
                              </div>
          
                              <div className="notas">
                                  <Notas titulo="Situación Médica" descripcionN={[{titulo: "", descripcion: usuario.condicion_medica}]}></Notas>
                              </div>
                          </div>
          
                          <div className="fila fila_espacio_fondo">
                              <div className="notas">
                                <div className="notas-section">
                                  <h2 className="tituloNotas"><strong>Curso: </strong> {(cursoAlumno.id_curso !== 0) ? cursoAlumno.nombre_curso : "No está inscrito en un curso"}</h2>
                                  <h2 className="tituloNotas"><strong>{( grupoAlumno && grupoAlumno.id_grupo !== 0) ? grupoAlumno.nombre_grupo: "No tiene grupo"}</strong></h2>
                                  <p><strong>Profesor: </strong>{(profesorAlumno.id_usuario !== 0) ? profesorAlumno.nombre + " " + profesorAlumno.apellido : "No tiene un profesor asignado"}</p>
                                  
                                  
                                </div>
                              </div>
                              <div className="notas">
                                <div className="notas-section">
                                    <h2 className="tituloNotas"><strong>Horarios: </strong></h2>
                                    {
                                      horarios && horarios.length > 0
                                      ? 
                                      horarios.map((horario: Horario, index: number) => (
                                              <p key={index}>{`${horario.dia_semana} desde ${horario.hora_inicio} hasta las ${horario.hora_fin}`}</p>
                                      ))
                                      : 
                                      null
                                  }
                                  {
                                    horarios.length  === 0  &&
                                    <p>{`El estudiante no tiene un horario asignado`}</p>
                                  }
                                  </div>
                                
                              </div>
                          </div>
                      </div> 
    </div>
    </>
  );
}