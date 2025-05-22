'use client'
import { useEffect, useRef, useState } from "react";
import './styles.css';
import { useRouter } from "next/navigation";
import Notas  from "../../../components/dnotas/dnotas";
import Foto from "../../../components/foto/foto";
import Datos from  "../../../components/dbasicos/dbasicos";
import Nombre from "../../../components/nombre/nombre";
import { useParams } from 'next/navigation'; // Importa useParams
import Profesor from "../interfaces/profesor.interface";
import Horarios from "../interfaces/horario.interface";
import Cursos from "../interfaces/curso.interface";
import obtenerHorariosProfesor from "../functions/obtenerHorariosProfesor";
import obtenerCursosProfesor from "../functions/obtenerCursosProfesor";
import Header from "../../../components/header-p/header"

export default function Profileprof() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = useParams(); // Usa el hook useParams para acceder a los params
    const profileId = params.id;
    console.log("ID de la ruta dinámica:", profileId);
  
    const [usuario, setUsuario] = useState<Profesor>(
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
            id_profesor: 0,
            curriculum: "",
            formacion: ""
        }
    );

    const [horarios, setHorarios] = useState<Horarios[]>([])
    const [cursos, setCursos] = useState<Cursos[]>([])

    const [descargandoImagen, setDescargandoImagen] = useState(false);
    const [imagenDescargadaUrl, setImagenDescargadaUrl] = useState<string | null>(null);

    const [descargandoCurriculum, setDescargandoCurriculum] = useState(false);
    const [curriculumDescargadaUrl, setCurriculumDescargadaUrl] = useState<string | null>(null);
    const [tieneCurriculum, setTieneCurriculum] = useState<Boolean>(false)
  
    async function descargarImagenPerfil(nombreArchivo: string, tieneFoto: boolean) {
      setDescargandoImagen(true);
      const urlDescarga = `/descargar/imagen/${nombreArchivo}`;
  
      try {

        if(tieneFoto){
          const response = await fetch(`${baseUrl}${urlDescarga}`);
          console.log(response);
    
          if (!response.ok) {
            let errorMessage = 'Error desconocido';
            try {
              const errorData = await response.json();
              errorMessage = errorData.mensaje || errorMessage;
            } catch (e) {
              console.error('La respuesta de error no era JSON:', e);
            }
            console.error('Error al descargar la imagen:', errorMessage);
            alert(`Error al descargar la imagen: ${errorMessage}`);
            setDescargandoImagen(false);
            return;
          }
    
          const blob = await response.blob();
          const urlBlob = window.URL.createObjectURL(blob);
          setImagenDescargadaUrl(urlBlob);
          setDescargandoImagen(false);
          console.log('Imagen de perfil descargada y URL creada.');
        }else{
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
        }
        
  
      } catch (error) {
        console.error('Error al realizar la petición de descarga:', error);
        alert('Error al realizar la petición de descarga.');
        setDescargandoImagen(false);
      }
    }

    async function descargarCurriculumPerfil(nombreArchivo: string) {
      setDescargandoCurriculum(true);
      const urlDescarga = `/descargar/pdf/${nombreArchivo}`;
    
      try {
        const response = await fetch(`${baseUrl}${urlDescarga}`);
        if (!response.ok) {
          let errorMessage = 'Error desconocido';
          try {
            const errorData = await response.json();
            errorMessage = errorData.mensaje || errorMessage;
          } catch (e) {
            console.error('La respuesta de error no era JSON:', e);
          }
          console.error('Error al descargar el archivo:', errorMessage);
          alert(`Error al descargar el archivo: ${errorMessage}`);
          setDescargandoCurriculum(false);
          
          return;
        }
    
        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
    
        // ✅ Descargar automáticamente
        const link = document.createElement('a');
        link.href = urlBlob;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        link.remove();
    
        // Opcional: para vista previa si quieres
        setCurriculumDescargadaUrl(urlBlob);
    
        console.log('Archivo PDF descargado.');
      } catch (error) {
        console.error('Error al realizar la petición de descarga:', error);
        alert('Error al realizar la petición de descarga.');
      } finally {
        setDescargandoCurriculum(false);
      }
    }
  
    const obtenerDatosUsuario = async () => {
      
      const datosProfesor = await fetch(`${baseUrl}/profesores/` + profileId)
      const resultadoConsulta = await datosProfesor.json()
      console.log(resultadoConsulta)
      setUsuario({...resultadoConsulta})
      await descargarImagenPerfil(`User-${resultadoConsulta.id_usuario}.png`, (resultadoConsulta.foto) ? true : false);

      const informacionHorarios = await obtenerHorariosProfesor(resultadoConsulta.id_usuario);
      setHorarios([...informacionHorarios])

      const informacionCursos = await obtenerCursosProfesor(resultadoConsulta.id_usuario);
      setCursos([...informacionCursos])
      
    };

  
  useEffect(() => {
    obtenerDatosUsuario();
    return () => {
      if (imagenDescargadaUrl) {
        window.URL.revokeObjectURL(imagenDescargadaUrl);
      }
    };
  }, []);

  const descargarCVprofesor  = async () => {
    console.log("descargarCVprofesor")
    await descargarCurriculumPerfil(`User-${profileId}.pdf`)

  }

  const Router = useRouter();

    return (
      <>
       <Header></Header>
                      
                  
        <div className="perfil body_profile">
          
            <div className="datosUsario">
                    {imagenDescargadaUrl ? (
                    <Foto imageUrl={imagenDescargadaUrl} />
                  ) : (
                    <p>{descargandoImagen ? 'Cargando imagen...' : 'Cargando imagen...'}</p>
                  )}
                  <div className="titulo">
                  <Nombre tituloN="PROFESOR" nombre={usuario.nombre + " " + usuario.apellido}></Nombre>
                  </div>
                  <Datos titulo="Cedula" descripcion={ usuario.cedula }></Datos>
                  <Datos titulo="Edad" descripcion={ usuario.edad.toString() }></Datos>
                  <button onClick={() => descargarCVprofesor() } disabled = {(usuario.curriculum) ? false : true}>Descargar Curriculum</button>
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
                        <Notas titulo="Formación" descripcionN={[{titulo: "", descripcion: usuario.formacion}]}></Notas>
                    </div>
                </div>

                <div className="fila fila_espacio_fondo">
                    <div className="notas">
                        <Notas titulo="Cursos" descripcionN={[{titulo: "", descripcion: ""}]}  cursos_profesor={cursos}></Notas>
                    </div>
                    <div className="notas">
                        <Notas titulo="Horario" descripcionN={[{titulo: "", descripcion: ""}]} horarios_profesor={horarios}></Notas>
                    </div>
                </div>
            </div> 
        </div>
      </>
    )
            
    
  }