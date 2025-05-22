'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import './styles.css';
import Header from "../../components/header/header";
import { useRouter } from "next/navigation";
import TimePicker from 'react-time-picker';
import 'react-clock/dist/Clock.css';

import Swal from 'sweetalert2'

interface Cursos {
    id_curso: number,
    nombre_curso: string
}

interface Horarios {
    dia_semana: string,
    hora_fin: string,
    hora_inicio: string,
    id_curso: number,
    id_horario?: number,
    id_profesor: number,
    id_grupo: number
}

interface Profesor {
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
    id_profesor: number,
    curriculum: string,
    formacion: string
}

interface HorarioCurso {
    apellido: string | null;
    dia_semana: string | null;
    hora_fin: string | null;
    hora_inicio: string | null;
    id_curso: number | null;
    id_grupo: number | null;
    id_horario: number | null;
    id_profesor: number | null;
    nombre: string | null;
    nombre_curso: string | null;
    nombre_grupo: string | null;
}


export default function ProfesoresLista() {
    const Router = useRouter();

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      
    const [profesores, setProfesores] = useState<Profesor[]>([]);
    const [profesoresFiltrados, setProfesoresFiltrados] = useState<Profesor[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
    const [subiendo, setSubiendo] = useState(false);
    const [nuevaFoto, setNuevaFoto] = useState<boolean>(false);
    const [nuevoCurriculum, setNuevoCurriculum] = useState<boolean>(false);
    const [correoValido, setCorreoValido] = useState(true);
    const [cedulaValida, setCedulaValida] = useState(true);
    const [telefonoValido, setTelefonoValido] = useState(true);
    const [correoValidoEdit, setCorreoValidoEdit] = useState(true);
    const [telefonoValidoEdit, setTelefonoValidoEdit] = useState(true);
    const [cedulaValidaEdit, setCedulaValidaEdit] = useState(true);
    const [claveValidaEdit, setClaveValidaEdit] = useState(true);

    const validarContrasena = (clave: string): boolean => {
                // Al menos una mayúscula, una minúscula, un número, un carácter especial, mínimo 8 caracteres
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                return regex.test(clave);
                };

    const [contrasenaValida, setContrasenaValida] = useState(true);

    async function obtenerProfesores() : Promise<Profesor[]>{
        const resultado= await fetch(`${baseUrl}/profesores`,{
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

    async function obtenerInformacionProfesor(id_profesor: number) : Promise<Profesor>{
        const resultado= await fetch(`${baseUrl}/profesores/` + id_profesor,{
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

    // Este useEffect se ejecuta una sola vez al montar el componente
    useEffect(() => {
        const cargarProfesores = async () => {
            const respuesta = await obtenerProfesores();
            setProfesores(respuesta);
        };
    
        cargarProfesores();
    }, []);
    
    useEffect(() => {
        filtrarProfesores();
    }, [searchTerm, profesores]);
    
 

    const [profesorEditando, setProfesorEditando] = useState<Profesor | null>(null);

    const [habilitarGuardado, setHabilitarGuardado] = useState<boolean>(true);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nuevoProfesor, setNuevoProfesor] = useState<Profesor>({
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
    });

    const [imagenDescargadaUrl, setImagenDescargadaUrl] = useState<string | null>(null);
    const [descargandoImagen, setDescargandoImagen] = useState(false);

    const [curriculumDescargadaUrl, setCurriculumDescargadaUrl] = useState<string | null>(null);
    const [descargandoCurriculum, setDescargandoCurriculum] = useState(false);
    const [curriculum, setCurriculum] = useState<File | null>(null);
    const [tieneCurriculum, setTieneCurriculum] = useState<boolean>(true);
    const [mostrarClave, setMostrarClave] = useState(false);

    const validarFormulario = (): boolean => {
        console.log("Validando Entradas de nuevo profesor")

        const { nombre, apellido, usuario, clave_acceso } = nuevoProfesor;

        const camposValidos = [nombre, apellido, usuario, clave_acceso].every(
            (valor) => valor !== undefined && valor.trim() !== ''
        );

        console.log(camposValidos)

        return !camposValidos;
    }

    useEffect(() => {
        setHabilitarGuardado(validarFormulario())
    }, [nuevoProfesor]);

    const filtrarProfesores = () => {
        const results = profesores.filter(profesores =>
            (profesores.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (profesores.apellido?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (profesores.usuario?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
        setProfesoresFiltrados(results);
    };
      
    const onEditar = async (profesor: any) => {
        console.log(profesor)
        setProfesorEditando({ ...profesor });
        await descargarImagenPerfil(`User-${profesor.id_profesor}.png`)
        await descargarCurriculumPerfil(`User-${profesor.id_profesor}.pdf`)
        
    };

    const onGuardarEdicion = async () => {
        
        try {
            if (!profesorEditando) return;

            console.log(profesorEditando)

            Swal.fire({
                title: 'Procesando...',
                text: 'Por favor espera',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                  Swal.showLoading();
                }
            });

            const response = await fetch(`${baseUrl}/profesores`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profesorEditando),
            });

            const resultadoConsulta = await response.json()
            console.log(resultadoConsulta)

            // Simulamos una función asíncrona (puedes reemplazar esto con tu fetch, por ejemplo)
            await new Promise(resolve => setTimeout(resolve, 1000)); // Espera de 1 segundos

            if(nuevaFoto){
                console.log("subiendo foto")
                setSubiendo(true)
                const formData = new FormData();
                let nuevoArchivo = null
                
                
                if (fotoPerfil) {

                    nuevoArchivo = new File([fotoPerfil], `User-${profesorEditando.id_usuario.toString()}.png`, { type: fotoPerfil.type, lastModified: fotoPerfil.lastModified });

                    formData.append('archivo', nuevoArchivo); // Agregar archivo solo si no es null
                    formData.append('id_usuario', profesorEditando.id_usuario.toString());

                    try {
                        const response = await fetch(`${baseUrl}/cargar/archivo/imagen`, {
                            method: 'POST',
                            body: formData,
                        });
        
                        const data = await response.json();
        
                        // Simulamos una función asíncrona (puedes reemplazar esto con tu fetch, por ejemplo)
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Espera de 1 segundos
        
                        if (response.ok) {
                            Swal.fire({ icon: 'success', title: 'Éxito', text: data.mensaje });
                            // Opcional: Actualizar el estado local con la nueva URL de la foto
                            console.log('URL de la foto subida:', data.archivo.url);
                        } else {
                            Swal.fire({ icon: 'error', title: 'Error', text: data.mensaje || 'Error al subir la imagen.' });
                        }
                        } catch (error) {
                        console.error('Error al enviar la petición:', error);
                        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al conectar con el servidor.' });
                        } finally {
                            setSubiendo(false);
                        }
                  }

            }

            if(nuevoCurriculum){

                console.log("subiendo curriculum")
                setSubiendo(true)
                const formData = new FormData();
                let nuevoArchivo = null
                if (curriculum) {

                    nuevoArchivo = new File([curriculum], `User-${profesorEditando.id_usuario.toString()}.pdf`, { type: curriculum.type, lastModified: curriculum.lastModified });

                    formData.append('archivo', nuevoArchivo); // Agregar archivo solo si no es null
                    formData.append('id_usuario', profesorEditando.id_usuario.toString());

                    try {
                        const response = await fetch(`${baseUrl}/cargar/archivo/pdf`, {
                            method: 'POST',
                            body: formData,
                        });
        
                        const data = await response.json();
        
                        // Simulamos una función asíncrona (puedes reemplazar esto con tu fetch, por ejemplo)
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Espera de 1 segundos
        
                        if (response.ok) {
                            Swal.fire({ icon: 'success', title: 'Éxito', text: data.mensaje });
                            // Opcional: Actualizar el estado local con la nueva URL de la foto
                            console.log('URL del curriculum subido:', data.archivo.url);
                        } else {
                            Swal.fire({ icon: 'error', title: 'Error', text: data.mensaje || 'Error al subir curriculum.' });
                        }
                        } catch (error) {
                        console.error('Error al enviar la petición:', error);
                        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al conectar con el servidor.' });
                        } finally {
                            setSubiendo(false);
                        }
                  }
            }

            // Si todo sale bien, cerramos el loading y mostramos éxito
            Swal.fire({
                title: '¡Operación exitosa!',
                text: 'La acción se completó correctamente.',
                icon: 'success'
              });

            const updatedList = profesores.map((profesor:Profesor) =>
                profesor.id_profesor === profesorEditando.id_profesor
                  ? { ...profesorEditando }  // Solo cambiamos el atributo necesario
                  : profesor
            );



            setProfesores(updatedList);
            setProfesoresFiltrados(updatedList);
            setProfesorEditando(null);
  
        } catch (error) {
            console.error("Error en la petición:", error);
        }
            
    };
    
    const onEliminar = async (id_profesor: number) => {
    
        try {

            Swal.fire({
                title: "¿Estás seguro que quieres eliminar al profesor?",
                text: "Los cambios no son reversibles",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33000",
                cancelButtonColor: "#0053d3",
                confirmButtonText: "Borrar",
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    // Sleep de 1 segundo para que se vea la animación
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Haces el fetch dentro de preConfirm
                    const response = await fetch(`${baseUrl}/profesores`, {
                    method: 'DELETE',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: id_profesor }),
                    });

                    const resultadoConsulta = await response.json();
                    return resultadoConsulta;
                }
                }).then((result) => {
                if (result.isConfirmed) {
                    console.log("Resultado de la consulta:", result.value);

                    const arrayActualizado = profesores.filter(profesor => profesor.id_usuario !== id_profesor);
                    setProfesores(arrayActualizado);
                    setProfesoresFiltrados(arrayActualizado);

                    Swal.fire({
                    title: "El profesor ha sido borrado",
                    text: "La eliminación se ha ejecutado exitosamente",
                    icon: "success"
                    });
                }
                });


           

        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };  

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          if (file.type === 'image/png') {
            setNuevoProfesor({...nuevoProfesor, foto: file.name})
            setFotoPerfil(file);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Por favor, selecciona solo archivos con formato PNG.',
            }).then(() => {
              e.target.value = '';
              setFotoPerfil(null);
            });
          }
        } else {
          setFotoPerfil(null);
        }
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          if (file.type === 'application/pdf') {
            setNuevoProfesor({...nuevoProfesor, curriculum: file.name})
            setCurriculum(file);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Por favor, selecciona solo archivos con formato PDF.',
            }).then(() => {
              e.target.value = '';
              setCurriculum(null);
            });
          }
        } else {
            setCurriculum(null);
        }
    }

    const onAgregarProfesor = async () => {
        
        const nuevo = { ...nuevoProfesor };

        Swal.fire({
            title: 'Procesando...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            }
        });

          try {

            
            const response = await fetch(`${baseUrl}/profesores`, {
                method: 'POST',
                mode: 'cors',   // Habilita CORS
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevo),
            });

            // Simulamos una función asíncrona (puedes reemplazar esto con tu fetch, por ejemplo)
            await new Promise(resolve => setTimeout(resolve, 1000)); // Espera de 1 segundos
    
            console.log(response)
    
            const resultadoConsulta = await response.json()
            console.log(resultadoConsulta)

            if(nuevo.foto){
                console.log("subiendo foto")
                setSubiendo(true)
                const formData = new FormData();
                let nuevoArchivo = null
                
                setFotoPerfil(nuevoArchivo);
                
                if (fotoPerfil) {

                    nuevoArchivo = new File([fotoPerfil], `User-${resultadoConsulta.id_usuario.toString()}.png`, { type: fotoPerfil.type, lastModified: fotoPerfil.lastModified });

                    formData.append('archivo', nuevoArchivo); // Agregar archivo solo si no es null
                    formData.append('id_usuario', resultadoConsulta.id_usuario.toString());

                    try {
                        const response = await fetch(`${baseUrl}/cargar/archivo/imagen`, {
                            method: 'POST',
                            body: formData,
                        });
        
                        const data = await response.json();
        
                        // Simulamos una función asíncrona (puedes reemplazar esto con tu fetch, por ejemplo)
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Espera de 1 segundos
        
                        if (response.ok) {
                            Swal.fire({ icon: 'success', title: 'Éxito', text: data.mensaje });
                            // Opcional: Actualizar el estado local con la nueva URL de la foto
                            console.log('URL de la foto subida:', data.archivo.url);
                        } else {
                            Swal.fire({ icon: 'error', title: 'Error', text: data.mensaje || 'Error al subir la imagen.' });
                        }
                        } catch (error) {
                        console.error('Error al enviar la petición:', error);
                        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al conectar con el servidor.' });
                        } finally {
                            setSubiendo(false);
                        }
                  }
                
            }

            if(nuevo.curriculum){
                console.log("subiendo curriculum")

                const formData = new FormData();
                let nuevoArchivo = null
                
                if (curriculum) {

                    nuevoArchivo = new File([curriculum], `User-${resultadoConsulta.id_usuario.toString()}.pdf`, { type: curriculum.type, lastModified: curriculum.lastModified });

                    formData.append('archivo', nuevoArchivo); // Agregar archivo solo si no es null
                    formData.append('id_usuario', resultadoConsulta.id_usuario.toString());

                    try {
                        const response = await fetch(`${baseUrl}/cargar/archivo/pdf`, {
                            method: 'POST',
                            body: formData,
                        });
        
                        const data = await response.json();
        
                        // Simulamos una función asíncrona (puedes reemplazar esto con tu fetch, por ejemplo)
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Espera de 1 segundos
        
                        if (response.ok) {
                            Swal.fire({ icon: 'success', title: 'Éxito', text: data.mensaje });
                            // Opcional: Actualizar el estado local con la nueva URL de la foto
                            console.log('URL del curriculum subido:', data.archivo.url);
                        } else {
                            Swal.fire({ icon: 'error', title: 'Error', text: data.mensaje || 'Error al subir la curriculum.' });
                        }
                        } catch (error) {
                        console.error('Error al enviar la petición:', error);
                        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al conectar con el servidor.' });
                        } finally {
                            setSubiendo(false);
                        }
                  }
                
            }
    
            if(response.status === 200){


                const informacionProfesor = await obtenerInformacionProfesor(resultadoConsulta.id_usuario)
                console.log(informacionProfesor)

                setProfesoresFiltrados([...profesoresFiltrados, informacionProfesor]);
                setProfesores([...profesores, informacionProfesor])
                setMostrarFormulario(false); // Asegúrate de que el formulario se cierre después de guardar
                setNuevoProfesor({
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
                });
            }
            
        
            // Si todo sale bien, cerramos el loading y mostramos éxito
            Swal.fire({
              title: '¡Operación exitosa!',
              text: 'La acción se completó correctamente.',
              icon: 'success'
            });
            
          } catch (error) {
            // Si algo falla, podrías mostrar otro modal de error
            Swal.fire({
              title: '¡Error!',
              text: 'Ocurrió un problema al procesar la acción.',
              icon: 'error'
            });
          }
        
        
        
    };
    
    const handleTitleClick = () => {
        window.location.reload();
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value); // Esto ya dispara useEffect que filtra
    };

    const handleSearchClick = () => {
        filtrarProfesores();
    };

    const mostrarFormularioAgregar = () => {
        console.log("Mostrar formulario para agregar")
        setMostrarFormulario(true);
        setProfesorEditando(null); // Asegúrate de que no se muestre el formulario de edición al mismo tiempo
    };

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
                setFotoPerfil(archivo)
            
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
          setFotoPerfil(new File([blob], nombreArchivo, { type: blob.type }));
          console.log('Imagen de perfil descargada y URL creada.');
    
        } catch (error) {
          console.error('Error al realizar la petición de descarga:', error);
          console.log(error)
          setDescargandoImagen(false);
        }
    }

    async function descargarCurriculumPerfil(nombreArchivo: string) {
        setDescargandoImagen(true);
        const urlDescarga = `/descargar/pdf/${nombreArchivo}`;
    
        try {
          const response = await fetch(`${baseUrl}${urlDescarga}`);
          console.log(response);
    
          if (!response.ok){

            try {
                setTieneCurriculum(false);
                setCurriculumDescargadaUrl("");
                setDescargandoCurriculum(false);
                return;
            } catch (error) {
                console.error('Error al obtener la imagen:', error);
                return;
            }
            
          }

          const blob = await response.blob();
          const urlBlob = window.URL.createObjectURL(blob);
          setCurriculumDescargadaUrl(urlBlob);
          setDescargandoCurriculum(false);
          console.log('Curriculum de perfil descargado y URL creada.');
    
        } catch (error) {
          console.error('Error al realizar la petición de descarga:', error);
          console.log(error)
          setDescargandoCurriculum(false);
        }
    }

    const [mostrarAside, setMostrarAside] = useState(false);
    const [profesorSeleccionado, setProfesorSeleccionado] = useState<Profesor>(
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
    const [cursosProfesor,setCursosProfesor] = useState<any[]>([])
    const [horarios, setHorarios] = useState<Horarios[]>([])
    const [cursos, setCursos] = useState<Cursos[]>([])
    const [cursosFaltantes, setCursosFaltantes] = useState<Cursos[]>([])
    const [mostrarAsideHorarios, setMostrarAsideHorarios] = useState(false);
    const [cursoSeleccionado, setCursoSeleccionado] = useState<Cursos>({
        id_curso: 0,
        nombre_curso: ""
    });

    const [agregarCurso, setAgregarCurso] = useState<Boolean>(false);
    const [agregarHorario, setAgregarHorario] = useState<Boolean>(false);
    const [mostrarTablaCursos, setMostrarTablaCursos] = useState<Boolean>(true);
    const [mostrarTablaHorarios, setMostrarTablaHorarios] = useState<Boolean>(true);

    
    const [seguidorEvento, setSeguidorEvento] = useState<Number>(0);

    interface DatosHorario {
        id_horario: number;
        id_profesor: number;
        nombre: string;
        apellido: string;
        dia_semana: string;
        hora_inicio: string;
        hora_fin: string;
        id_curso: number;
        nombre_curso: string;
        id_grupo: number;
        nombre_grupo: string;
    }

    const [horariosCursoSeleccionado, setHorariosCursoSeleccionado] = useState<DatosHorario[]>([]);
    const [cursoFaltanteSeleccionado, setCursoFaltanteSeleccionado] = useState<Cursos>({
        id_curso: 0,
        nombre_curso: ""
      });

    const obtenerHorariosCurso = async (id_profesor_seleccionado: number, id_curso_seleccionado: number) => {
        const datosCursos = await fetch(`${baseUrl}/profesores/${id_profesor_seleccionado}/horarios/curso/${id_curso_seleccionado}`)
        const resultadoConsulta = await datosCursos.json()
        console.log(resultadoConsulta)
        setHorariosCursoSeleccionado([...resultadoConsulta])

    }

    interface Grupos {
        id_grupo: number,
        nombre_grupo: string,
        id_curso: number
    }

    const [gruposAlumnos, setGruposAlumnos] = useState<Grupos[]>([])
    const [editandoHorario,setEditandoHorario] = useState(false)

    const obtenerGrupos = async (id_curso_seleccionado:number) => {
        const datosCursos = await fetch(`${baseUrl}/grupos/curso/${id_curso_seleccionado}`)
        const resultadoConsulta = await datosCursos.json()
        console.log(resultadoConsulta)
        setGruposAlumnos([...resultadoConsulta])

    }

    

    const gestionarGrupos = async (id_usuario: number) => {

        const obtenerHorariosProfesor = async (id_profesor_seleccionado: number) => {
      
            const datosHorario = await fetch(`${baseUrl}/profesores/${id_profesor_seleccionado}/horarios/`)
            const resultadoConsulta = await datosHorario.json()
            console.log(resultadoConsulta)
            setHorarios([...resultadoConsulta])
        
        };
    
        const obtenerCursosProfesor = async (id_profesor_seleccionado: number) => {
          
            const datosCursos = await fetch(`${baseUrl}/profesores/cursos/inscritos/${id_profesor_seleccionado}`)
            const resultadoConsulta = await datosCursos.json()
            console.log(resultadoConsulta)
            setCursosProfesor([...resultadoConsulta])
        };

        const obtenerCursosFaltantesProfesor = async (id_profesor_seleccionado: number) => {
          
            const datosCursos = await fetch(`${baseUrl}/profesores/cursos/faltantes/${id_profesor_seleccionado}/datos`)
            const resultadoConsulta = await datosCursos.json()
            console.log(resultadoConsulta)
            setCursosFaltantes([...resultadoConsulta])
        };

        

        console.log(id_usuario)

        const informacionProfesor = profesores.filter( (profesor: Profesor) => profesor.id_profesor === id_usuario )[0]
        console.log(informacionProfesor)

        setProfesorSeleccionado({...informacionProfesor})

        await obtenerHorariosProfesor(informacionProfesor.id_usuario)
        const resultadoCursosProfesor = await obtenerCursosProfesor(informacionProfesor.id_usuario)
        await obtenerCursosFaltantesProfesor(informacionProfesor.id_usuario)
        
        setMostrarAside(true);
        
    }

    const eliminarCursoProfesor =async (id_profesor_seleccionado: number, id_curso_seleccionado: number) => {
        const datosHorario = await fetch(`${baseUrl}/profesores/${id_profesor_seleccionado}/curso/${id_curso_seleccionado}/eliminar`, {
            method: 'DELETE', // Método especificado
            mode: 'cors',   // Habilita CORS
            headers: {
              'Content-Type': 'application/json'
            }
        })
        const resultadoConsulta = await datosHorario.json()
        console.log(resultadoConsulta)
        setCursos([...cursos.filter(curso => curso.id_curso !== id_curso_seleccionado)])
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        // Aquí puedes agregar la lógica para enviar tus datos con React (por ejemplo, usando fetch o axios)

        const datosCursos = await fetch(`${baseUrl}/profesores/curso`,{
            method: 'POST', // Método especificado
            mode: 'cors',   // Habilita CORS
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id_profesor: profesorSeleccionado.id_profesor, id_curso: cursoFaltanteSeleccionado.id_curso})
        })
        const resultadoConsulta = await datosCursos.json()
        console.log(resultadoConsulta)
        console.log('Formulario enviado sin recargar la página');
        setCursos([...cursos,cursoFaltanteSeleccionado])
        setSeguidorEvento(0)
    };

    const handleSubmitHorario = async (event: FormEvent) => {
        event.preventDefault();
        // Aquí puedes agregar la lógica para enviar tus datos con React (por ejemplo, usando fetch o axios)

        console.log(horarioSeleccionado)
        console.log(profesorSeleccionado)
        console.log(cursoSeleccionado)

        if(!editandoHorario){

            console.log("CREANDO")

            const informacionHorario: Horarios = {
                dia_semana: horarioSeleccionado.dia_semana as string,
                hora_fin: horarioSeleccionado.hora_fin as string,
                hora_inicio: horarioSeleccionado.hora_inicio  as string, 
                id_curso: cursoSeleccionado?.id_curso,
                id_profesor: profesorSeleccionado.id_profesor,
                id_grupo: horarioSeleccionado.id_grupo as number
            }
            
            const response = await fetch(`${baseUrl}/profesores/agregar/horario/curso`, {
                method: 'POST',
                mode: 'cors',   // Habilita CORS
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(informacionHorario)
            });
    
            const resultado_asignacion = await response.json()
    
            await obtenerHorariosCurso(profesorSeleccionado.id_profesor,cursoSeleccionado?.id_curso)
    
            console.log(resultado_asignacion)

        }else{

            console.log("EDITANDO")

            const response = await fetch(`${baseUrl}/profesores/editar/horario/curso`, {
                method: 'PUT',
                mode: 'cors',   // Habilita CORS
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        id_horario:horarioSeleccionado.id_horario,
                        id_grupo: horarioSeleccionado.id_grupo,
                        dia_semana: horarioSeleccionado.dia_semana as string,
                        hora_fin: horarioSeleccionado.hora_fin as string,
                        hora_inicio: horarioSeleccionado.hora_inicio  as string, 
                    }
                )
            });

            const resultado_asignacion = await response.json()
    
            await obtenerHorariosCurso(profesorSeleccionado.id_profesor,cursoSeleccionado?.id_curso)

            console.log(resultado_asignacion)

        }

        setHorarioSeleccionado({
            apellido: "",
            dia_semana: "",
            hora_fin: "",
            hora_inicio: "",
            id_curso: 0,
            id_grupo: 0,
            id_horario: 0,
            id_profesor: 0,
            nombre: "",
            nombre_curso: "",
            nombre_grupo: "",
        })
        setSeguidorEvento(2)
        console.log('Formulario enviado sin recargar la página');
    };

    const eliminarHorarioProfesor = async (id_horario_seleccionado: number) => {

        const response = await fetch(`${baseUrl}/profesores/eliminar/horario/curso`, {
            method: 'DELETE',
            mode: 'cors',   // Habilita CORS
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_horario: id_horario_seleccionado
            })
        });

        const resultado_asignacion = await response.json()

        await obtenerHorariosCurso(profesorSeleccionado.id_profesor,cursoSeleccionado?.id_curso)

        console.log(resultado_asignacion)

        
        setSeguidorEvento(2)
        console.log('Formulario enviado sin recargar la página');
    };

    const editarHorarioProfesor = async (id_horario_seleccionado: number) => {

        const horario_seleccionado = horariosCursoSeleccionado.filter( (horario) => horario.id_horario === id_horario_seleccionado)[0]

        console.log(horario_seleccionado)

        setHorarioSeleccionado({...horario_seleccionado})

        setEditandoHorario(true)
        setSeguidorEvento(3)

        console.log('EDITANDO HORARIO PROFESOR');
    };

    const handleEntradaChange = (value: string | null) => {
        if (typeof value === 'string') setEntrada(value);
      };
    
    const handleSalidaChange = (value: string | null) => {
    if (typeof value === 'string') setSalida(value);
    };
    
    const eliminarHorario = (id_horario: number) => {
        console.log(id_horario)
        console.log(horariosCursoSeleccionado.filter( (horario) => horario.id_horario === id_horario))
    }

    const editarHorario = (id_horario: number) => {
        console.log(id_horario)
        console.log(horariosCursoSeleccionado.filter( (horario) => horario.id_horario === id_horario))


    }

    const [entrada, setEntrada] = useState<string>('10:00');
    const [salida, setSalida] = useState<string>('18:00');
    const [horarioSeleccionado, setHorarioSeleccionado] = useState<HorarioCurso>({
        apellido: "",
        dia_semana: "",
        hora_fin: "",
        hora_inicio: "",
        id_curso: 0,
        id_grupo: 0,
        id_horario: 0,
        id_profesor: 0,
        nombre: "",
        nombre_curso: "",
        nombre_grupo: "",
    });

    const handleChangeDia = (event: ChangeEvent<HTMLSelectElement>) => {

        console.log(event.target.value)
        setHorarioSeleccionado({
          ...horarioSeleccionado,
          dia_semana: event.target.value,
        });
    };

    const handleChangeGrupo = (event: ChangeEvent<HTMLSelectElement>) => {
        const grupoIdSeleccionado = parseInt(event.target.value, 10);

        console.log(grupoIdSeleccionado)
    
        if (grupoIdSeleccionado) {
          setHorarioSeleccionado({
            ...horarioSeleccionado,
            id_grupo: grupoIdSeleccionado, // Actualiza el id_grupo
          });
        } else {
          // Opcional: Manejar el caso en que no se encuentra el grupo
          console.error("No se encontró el grupo con ID:", grupoIdSeleccionado);
        }
      };
    return (
        <>
            <Header
                text="MULTIPLAYER" onClick={() => Router.push("/Amenu")}
                text1="Panel de Juegos" onClick1={() => Router.push("/videojuego")}
                text2="Menu" onClick2={() => Router.push("/Amenu")}
                text3="Mis datos" onClick3={() => Router.push("/Aadmins-lista")}
                text4="Salir" onClick4={() => Router.push("/")}>
            </Header>

            
            <div className="listado">
                {!mostrarFormulario && !profesorEditando && (
                    <div className="encabezado">
                    <div className="tituloListado" style={{ cursor: 'pointer' }}>
                        <h2 className="profesores" onClick={() => handleTitleClick()}>PROFESORES</h2>
                        <button onClick={() => mostrarFormularioAgregar()}>Agregar Profesor</button>
                    </div>
                    <div className="barraBusqueda">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Buscar profesores..."
                            value={searchTerm}
                            onChange={ e => handleSearchChange(e)}
                            className="search-input"
                        />
                        <img
                            src="./lupa-icon.png"
                            alt="Buscar"
                            className="search-icon"
                            onClick={() => handleSearchClick()}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </div>
            </div>
                 )}
                

            {mostrarFormulario && (
                <div className="formulario-agregar">
                    <h3>AGREGAR NUEVO PROFESOR</h3>

                    <div className="campo-form">
                    <label>Nombre</label>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nuevoProfesor.nombre}
                        onChange={e => setNuevoProfesor({ ...nuevoProfesor, nombre: e.target.value })}
                    />
                    </div>

                    <div className="campo-form">
                    <label>Apellido</label>
                    <input
                        type="text"
                        placeholder="Apellido"
                        value={nuevoProfesor.apellido}
                        onChange={e => setNuevoProfesor({ ...nuevoProfesor, apellido: e.target.value })}
                    />
                    </div>

                    <div className="campo-form">
                    <label>Usuario</label>
                    <input
                        type="text"
                        placeholder="Usuario"
                        autoComplete="off"
                        value={nuevoProfesor.usuario}
                        onChange={e => setNuevoProfesor({ ...nuevoProfesor, usuario: e.target.value })}
                    />
                    </div>

                    <div className="campo-clave">
                    <label>Clave</label>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input
                        type={mostrarClave ? 'text' : 'password'}
                        placeholder="Clave"
                        autoComplete="new-password"
                        value={nuevoProfesor.clave_acceso}
                        onChange={e => {
                            setNuevoProfesor({ ...nuevoProfesor, clave_acceso: e.target.value });
                            setContrasenaValida(validarContrasena(e.target.value));
                        }}
                        style={{
                            width: '100%',
                            paddingRight: '40px',
                            height: '36px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                        />
                        <img
                        src={mostrarClave ? '/icons/ojito-abierto.png' : '/icons/ojito-cerrado.png'}
                        alt="Mostrar/Ocultar Clave"
                        onClick={() => setMostrarClave(prev => !prev)}
                        style={{
                            position: 'absolute',
                            right: '40px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                            opacity: 0.7
                        }}
                        />
                    </div>

                    {!contrasenaValida && (
                        <p className="mensaje-error-clave">
                        La clave requiere al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
                        </p>
                    )}
                    </div>

                    <div className="campo-form">
                    <label>Teléfono</label>
                    <input
                        type="text"
                        placeholder="Telefono"
                        value={nuevoProfesor.telefono}
                        onChange={e => {
                                    const value = e.target.value;
                                    const formatoTelefono = /^[0-9()+\-\s]*$/;
                                    if (formatoTelefono.test(value)) {
                                        setNuevoProfesor({ ...nuevoProfesor, telefono: value });
                                        setTelefonoValido(true);
                                    } else {
                                        setTelefonoValido(false);
                                    }
                                    }}
                    />
                            {!telefonoValido && (
                                <p className="mensaje-error-clave">Teléfono inválido. Use solo números o símbolos como + - ( )</p>
                                )}


                    </div>

                    <div className="campo-form">
                    <label>Correo</label>
                    <input
                        type="text"
                        placeholder="Correo"
                        value={nuevoProfesor.correo}
                        onChange={e => {
                            const value = e.target.value;
                            setNuevoProfesor({ ...nuevoProfesor, correo: value });
                            setCorreoValido(value.includes('@'));
                            }}

                    />
                    {!correoValido && (
                        <p className="mensaje-error-clave">Ingrese una dirección de correo válida</p>
                        )}

                    </div>

                    <div className="campo-form">
                    <label>Edad</label>
                    <input
                        type="number"
                        min={0}
                        placeholder="Edad"
                        value={nuevoProfesor.edad}
                        onChange={e => {
                        const value = e.target.value;
                        const numberValue = Number(value);
                        if (value === '' || (Number.isFinite(numberValue) && numberValue >= 0)) {
                            setNuevoProfesor({ ...nuevoProfesor, edad: value === '' ? 0 : numberValue });
                        }
                        }}
                    />
                    </div>

                    <div className="campo-form">
                    <label>Cédula</label>
                    <input
                        type="text"
                        placeholder="Cedula"
                        value={nuevoProfesor.cedula}
                        onChange={e => {
                                const value = e.target.value;
                                const soloDigitos = /^\d*$/;
                                if (soloDigitos.test(value)) {
                                    setNuevoProfesor({ ...nuevoProfesor, cedula: value });
                                    setCedulaValida(true);
                                } else {
                                    setCedulaValida(false);
                                }
                                }}

                    />
                            {!cedulaValida && (
                                <p className="mensaje-error-clave">La cédula solo debe contener dígitos</p>
                                )}

                    </div>

                    <div className="campo-form">
                    <label>Formación</label>
                    <input
                        type="text"
                        placeholder="Formación"
                        value={nuevoProfesor.formacion}
                        onChange={e => setNuevoProfesor({ ...nuevoProfesor, formacion: e.target.value })}
                    />
                    </div>

                    <div className="campo-form">
                    <label>Foto (.png)</label>
                    <input
                        type="file"
                        accept=".png"
                        onChange={handleFotoChange}
                    />
                    </div>

                    <div className="campo-form">
                    <label>Currículum (.pdf)</label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfChange}
                    />
                    </div>

                    <div className="botones">
                    <button onClick={() => onAgregarProfesor()} disabled={habilitarGuardado}>Guardar</button>
                    <button onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                    </div>
                </div>
                )}

            


            {!mostrarFormulario && !profesorEditando && (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Usuario</th>
                            <th>Clave</th>
                            <th>Correo</th>
                            <th>Celular</th>
                            <th>Perfil</th> 
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profesoresFiltrados.map((profesor,index) => (
                            <tr key={index}>
                                <td>{profesor.nombre ? profesor.nombre : "null"}</td>
                                <td>{profesor.apellido ? profesor.apellido : "null"}</td>
                                
                                <td>{profesor.usuario ? profesor.usuario : "null"}</td>
                                <td>{profesor.clave_acceso ? profesor.clave_acceso : "null"}</td>

                                <td>{profesor.correo ? profesor.correo : "null"}</td>
                                <td>{profesor.telefono ? profesor.telefono : "null"}</td>
                                <td>
                                    <button onClick={()=>Router.push("/profile-prof/"+profesor.id_profesor)}>Ver Perfil</button>
                                </td>
                                <td className="display_flex">
                                    <button onClick={() => onEditar(profesor)}>
                                        <img
                                        src="/icons/edit_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg"
                                        alt="Editar"
                                        style={{ width: 16, height: 16 }}
                                        />
                                    </button>
                                    <button onClick={() => onEliminar(profesor.id_profesor)}>
                                        <img
                                        src="/icons/delete_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg"
                                        alt="Eliminar"
                                        style={{ width: 16, height: 16 }}
                                        />
                                    </button>
                                </td>

    
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {profesorEditando && !mostrarFormulario && (
        <div className="formulario-edicion">
            <h3>Editando profesor</h3>

            <div className="campo-form">
            <label>Nombre</label>
            <input
                type="text"
                placeholder="Nombre"
                value={profesorEditando.nombre || ''}
                onChange={e => setProfesorEditando({ ...profesorEditando, nombre: e.target.value })}
            />
            </div>

            <div className="campo-form">
            <label>Apellido</label>
            <input
                type="text"
                placeholder="Apellido"
                value={profesorEditando.apellido || ''}
                onChange={e => setProfesorEditando({ ...profesorEditando, apellido: e.target.value })}
            />
            </div>

            <div className="campo-form">
            <label>Usuario</label>
            <input
                type="text"
                placeholder="Usuario"
                value={profesorEditando.usuario || ''}
                onChange={e => setProfesorEditando({ ...profesorEditando, usuario: e.target.value })}
            />
            </div>

            <div className="campo-form">
            <label>Clave</label>
            <div style={{ position: 'relative', width: '100%' }}>
                <input
                type={mostrarClave ? 'text' : 'password'}
                placeholder="Clave"
                value={profesorEditando.clave_acceso || ''}
                onChange={e => {
                    const value = e.target.value;
                    setProfesorEditando({ ...profesorEditando, clave_acceso: value });
                    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&.,;:]).{8,}$/;
                    setClaveValidaEdit(regex.test(value));
                }}
                style={{
                    width: '100%',
                    paddingRight: '40px',
                    height: '36px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                }}
                />
                <img
                src={mostrarClave ? '/icons/ojito-abierto.png' : '/icons/ojito-cerrado.png'}
                alt="Mostrar/Ocultar Clave"
                onClick={() => setMostrarClave(prev => !prev)}
                style={{
                    position: 'absolute',
                    right: '40px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    opacity: 0.7
                }}
                />
            </div>
            {!claveValidaEdit && (
                <p className="mensaje-error-clave">
                La clave requiere al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
                </p>
            )}
            </div>

            <div className="campo-form">
            <label>Teléfono</label>
            <input
                type="text"
                placeholder="Teléfono"
                value={profesorEditando.telefono || ''}
                onChange={e => {
                const value = e.target.value;
                const regex = /^[0-9()+\-\s]*$/;
                if (regex.test(value)) {
                    setProfesorEditando({ ...profesorEditando, telefono: value });
                    setTelefonoValidoEdit(true);
                } else {
                    setTelefonoValidoEdit(false);
                }
                }}
            />
            {!telefonoValidoEdit && (
                <p className="mensaje-error-clave">Teléfono inválido. Use solo números o símbolos como + - ( )</p>
            )}
            </div>

            <div className="campo-form">
            <label>Correo</label>
            <input
                type="text"
                placeholder="Correo"
                value={profesorEditando.correo || ''}
                onChange={e => {
                const value = e.target.value;
                setProfesorEditando({ ...profesorEditando, correo: value });
                setCorreoValidoEdit(value.includes('@'));
                }}
            />
            {!correoValidoEdit && (
                <p className="mensaje-error-clave">Ingrese una dirección de correo válida</p>
            )}
            </div>

            <div className="campo-form">
            <label>Edad</label>
            <input
                type="number"
                placeholder="Edad"
                min={0}
                value={profesorEditando.edad ?? ''}
                onChange={e =>
                setProfesorEditando({ ...profesorEditando, edad: Number(e.target.value) })
                }
            />
            </div>

            <div className="campo-form">
            <label>Cédula</label>
            <input
                type="text"
                placeholder="Cédula"
                value={profesorEditando.cedula || ''}
                onChange={e => {
                const value = e.target.value;
                const regex = /^\d*$/;
                if (regex.test(value)) {
                    setProfesorEditando({ ...profesorEditando, cedula: value });
                    setCedulaValidaEdit(true);
                } else {
                    setCedulaValidaEdit(false);
                }
                }}
            />
            {!cedulaValidaEdit && (
                <p className="mensaje-error-clave">La cédula solo debe contener dígitos</p>
            )}
            </div>

            <div className="campo-form">
            <label>Formación</label>
            <input
                type="text"
                placeholder="Formación"
                value={profesorEditando.formacion || ''}
                onChange={e => setProfesorEditando({ ...profesorEditando, formacion: e.target.value })}
            />
            </div>

            {imagenDescargadaUrl && (
            <div>
                <img
                src={imagenDescargadaUrl}
                alt="Imagen de perfil"
                style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
                />
            </div>
            )}

            <div className="campo-form">
            <label htmlFor="editarImagen">Editar imagen de perfil (PNG):</label>
            <input
                type="file"
                id="editarImagen"
                accept="image/png"
                onChange={e => {
                const archivo = e.target.files?.[0];
                if (archivo) {
                    const nuevaUrl = URL.createObjectURL(archivo);
                    setNuevaFoto(true);
                    setImagenDescargadaUrl(nuevaUrl);
                    setFotoPerfil(archivo);
                }
                }}
            />
            </div>

            {curriculumDescargadaUrl ? (
            <div>
                <iframe
                src={curriculumDescargadaUrl}
                title="Vista previa del PDF"
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                    border: '1px solid #ccc',
                }}
                />
            </div>
            ) : (
            !descargandoCurriculum &&
            !tieneCurriculum && (
                <p style={{ color: 'gray' }}>
                Este profesor aún no tiene un curriculum subido.
                </p>
            )
            )}

            <div className="campo-form">
            <label htmlFor="editarCurriculum">Editar curriculum (PDF):</label>
            <input
                type="file"
                id="editarCurriculum"
                accept="application/pdf"
                onChange={e => {
                const archivo = e.target.files?.[0];
                if (archivo) {
                    const nuevaUrl = URL.createObjectURL(archivo);
                    setNuevoCurriculum(true);
                    setCurriculumDescargadaUrl(nuevaUrl);
                    setCurriculum(archivo);
                }
                }}
            />
            </div>

            <div className="botones">
            <button onClick={onGuardarEdicion}>Guardar</button>
            <button onClick={() => setProfesorEditando(null)}>Cancelar</button>
            </div>
        </div>
        )}


          
            
            </div>
        </>
    );
}

function async() {
    throw new Error("Function not implemented.");
}
