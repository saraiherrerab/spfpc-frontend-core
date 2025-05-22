'use client';
import { useState, useEffect } from 'react';
import './styles.css';
import '../login.css';
import Header from "../../components/header/header";
import { useRouter } from "next/navigation";
import obtenerGrupos from './functions/obtenerGrupos';
import obtenerCursos from '../GruposYCursos/functions/obtenerCursos';
import Curso from './interfaces/curso.interface';
import obtenerProfesores from './functions/obtenerProfesores';
import obtenerHorariosGrupo from './functions/obtenerHorariosGrupo';
import obtenerEstudiantes from './functions/obtenerListaEstudiantes'
import Estudiante from './interfaces/estudiante.interface';
import eliminarEstudiateDeGrupo from './functions/eliminarEstudianteGrupo';
import agregarEstudianteGrupo from './functions/agregarEstudianteGrupo';
import obtenerEstudiantesGrupo from './functions/obtenerEstudiantesGrupo';
import reasignarEstudianteGrupo from './functions/reasignarEstudianteGrupo';

interface Grupo {
  id_grupo: number,
  nombre_grupo: string,
  id_curso: number, // relación al curso
  id_profesor_grupo: number
}

interface Profesor {
  id_usuario: number,
  id_profesor: number,
  nombre: string,
  apellido: string,
  grupos_ids?: number[]; // relación a grupos
}

interface Horario {
  id_horario: number,
  dia_semana: string,
  hora_inicio: string,
  hora_fin: string,
  id_grupo: number,
}



export default function Grupos() {
  const Router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;


  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoEditando, setGrupoEditando] = useState<Grupo>({ id_grupo: 0, nombre_grupo: '', id_curso: 0, id_profesor_grupo: 0 });
  const [nuevoGrupo, setNuevoGrupo] = useState<Grupo>({ id_grupo: 0, nombre_grupo: '', id_curso: 0, id_profesor_grupo: 0 });

// Datos de ejemplo (mock)
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gruposFiltrados, setGruposFiltrados] = useState<Grupo[]>(grupos);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState<number>(0);
  const [horariosGrupo, setHorariosGrupo] = useState<Horario[]>([]);

  // Estados para mostrar formulario o vista estudiantes
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  

  const [mostrarEstudiantesGrupo, setMostrarEstudiantesGrupo] = useState<Grupo | null>(null);

  const [controlador,setControlador] = useState<string>("AGREGAR")

  const [listaEstudiantes, setListasEstudiantes] = useState<any[]>([])


  useEffect(() => {
  const cargarDatos = async () => {
    try {
      const [profesores, cursos, grupos,estudiantes] = await Promise.all([
        obtenerProfesores(),
        obtenerCursos(),
        obtenerGrupos(),
        obtenerEstudiantes()
      ]);

      console.log('%cProfesores:', 'color: red;', profesores);
      console.log('%cCursos:', 'color: red;', cursos);
      console.log('%cGrupos:', 'color: red;', grupos);
      console.log('%cEstudiantes:', 'color: red;', estudiantes);

      setProfesores(profesores);
      setCursos(cursos);
      setGrupos(grupos);
      setListasEstudiantes(estudiantes)
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  cargarDatos();
}, []);

const [horariosPorGrupo, setHorariosPorGrupo] = useState<{ [id: number]: string }>({});
const [listaHorarios, setListaHorarios] = useState<any[][]>([]);
useEffect(() => {
  const cargarHorarios = async () => {
    const nuevosHorarios: { [id: number]: string } = {};
    const nuevaLista: any[] = [];

    for (const grupo of gruposFiltrados) {
      const horarios = await obtenerHorariosGrupo(grupo.id_grupo);
      console.log(horarios);

      nuevaLista.push(horarios); // Agrega los horarios al array temporal

      nuevosHorarios[grupo.id_grupo] = horarios
        .map((h: any) => `${h.dia_semana}: ${h.hora_inicio} a ${h.hora_fin}`)
        .join(', ');
    }

    setListaHorarios(nuevaLista); // Guarda todos los arreglos de una sola vez
    setHorariosPorGrupo(nuevosHorarios);
  };

  if (gruposFiltrados.length > 0) {
    cargarHorarios();
  }
}, [gruposFiltrados]);


const [profesoresPorGrupo, setProfesoresPorGrupo] = useState<{ [id: number]: string }>({});
const [cursosPorGrupo, setCursosPorGrupo] = useState<{ [id: number]: string }>({});

useEffect(() => {
  const cargarProfesores = async () => {
    const nuevosProfesores: { [id: number]: string } = {};
    const nuevosCursos: { [id: number]: string } = {};

    for (const grupo of gruposFiltrados) {
      try {
        const res = await fetch(`${baseUrl}/grupos/profesores/${grupo.id_grupo}`);
        const profesores = await res.json();

        nuevosProfesores[grupo.id_grupo] = profesores.map((p: any) => `${p.nombre} ${p.apellido}`).join(', ');

        
      } catch (error) {
        console.error(`Error cargando profesores para grupo ${grupo.id_grupo}:`, error);
        nuevosProfesores[grupo.id_grupo] = "Error al cargar";
      }

      // Cargar curso
      try {
        const resCurso = await fetch(`${baseUrl}/grupos/curso/${grupo.id_grupo}`);
        if (!resCurso.ok) throw new Error("No se pudo cargar curso");
        const curso = await resCurso.json();
        nuevosCursos[grupo.id_grupo] = curso?.nombre_curso || "Sin curso";
      } catch (error) {
        console.error(`Error cargando curso para grupo ${grupo.id_grupo}:`, error);
        nuevosCursos[grupo.id_grupo] = "Error al cargar";
        
      }
    }

    setProfesoresPorGrupo(nuevosProfesores);
    setCursosPorGrupo(nuevosCursos);
  };

  if (gruposFiltrados.length > 0) {
    cargarProfesores();
  }
}, [gruposFiltrados]);

const [estudiantesPorGrupo, setEstudiantesPorGrupo] = useState<{ [id: number]: string }>({});
const [listaEstudiantesPorGrupo, setListaEstudiantesPorGrupo] = useState<{ [id_grupo: number]: Estudiante[] }>({});
const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante>(
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
        id_grupo: 0
    }
)
useEffect(() => {
  const cargarEstudiantes = async () => {
    const nuevosEstudiantesPorGrupo: { [id: number]: Estudiante[] } = {};
    const nombresEstudiantesPorGrupo: { [id: number]: string } = {};

    for (const grupo of gruposFiltrados) {
      try {
        const res = await fetch(`${baseUrl}/grupos/estudiantes/${grupo.id_grupo}`);
        const estudiantes = await res.json();

        nuevosEstudiantesPorGrupo[grupo.id_grupo] = estudiantes;
        nombresEstudiantesPorGrupo[grupo.id_grupo] = estudiantes.map((p: any) => `${p.nombre} ${p.apellido}`).join(', ');
      } catch (error) {
        console.error(`Error cargando estudiantes para grupo ${grupo.id_grupo}:`, error);
        nombresEstudiantesPorGrupo[grupo.id_grupo] = "Error al cargar";
        nuevosEstudiantesPorGrupo[grupo.id_grupo] = [];
      }
    }

    setListaEstudiantesPorGrupo(nuevosEstudiantesPorGrupo);
    setEstudiantesPorGrupo(nombresEstudiantesPorGrupo);
  };

  if (gruposFiltrados.length > 0) {
    cargarEstudiantes();
  }
}, [gruposFiltrados]);

useEffect(() => {
  const filtrarGrupos = () => {
    const results = grupos.filter(g =>
      g.nombre_grupo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setGruposFiltrados(results);
  };

  filtrarGrupos();
}, [searchTerm, grupos]); // 👈 Se agregó "grupos" como dependencia

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    //filtrarGrupos();
  };

  const handleTitleClick = () => {
    setSearchTerm('');
    setGruposFiltrados(grupos);
  };

  // Funciones para formulario



  const mostrarFormularioAgregar = () => {
  setNuevoGrupo({ id_grupo: 0, nombre_grupo: '', id_curso: 0, id_profesor_grupo: 0});
  setProfesorSeleccionado(0);
  setHorariosGrupo([]);
  setMostrarFormulario(true);
  setGrupoEditando({ id_grupo: 0, nombre_grupo: '', id_curso: 0, id_profesor_grupo: 0 });
};

  // Mostrar lista estudiantes grupo
  const onVerEstudiantes = (grupo: Grupo) => {
    setMostrarEstudiantesGrupo(grupo);
  };

  const onVolverListaGrupos = () => {
    setMostrarEstudiantesGrupo(null);
  };

  /* Funciones Principales */

  const crearNuevoGrupo = async () => {

    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Iniciando crearNuevoGrupo()');

    console.log(nuevoGrupo)

    const resultado= await fetch(`${baseUrl}/grupos`, {
        method: 'POST', // Método especificado
        mode: 'cors',   // Habilita CORS
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoGrupo)
    });
    const resultado_json= await resultado.json();
    console.log(resultado_json);

    if(horariosGrupo.length > 0){
      try {
          const response = await fetch(`${baseUrl}/horarios/grupo/agregar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_grupo: resultado_json.id_grupo, arregloHorarios: [...horariosGrupo] })
          });

        const data = await response.json();
        console.log('%cRespuesta del servidor:', 'color: green;', data);
      } catch (error) {
        console.error('Error al enviar los horarios:', error);
      }
    }

    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Finalizando crearNuevoGrupo()');
    
    setGrupos([...grupos, nuevoGrupo])
    setMostrarFormulario(false);
    window.location.href = window.location.href

  }

  const borrarGrupoSeleccionado = async (id_grupo_seleccionado: number) => {
    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Iniciando borrarGrupoSeleccionado()');

    console.log(nuevoGrupo)

    const resultado= await fetch(`${baseUrl}/grupos/` + id_grupo_seleccionado, {
        method: 'DELETE', // Método especificado
        mode: 'cors',   // Habilita CORS
        headers: {
          'Content-Type': 'application/json'
        }
    });
    const resultado_json= await resultado.json();
    console.log(resultado_json);

    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Finalizando borrarGrupoSeleccionado()');
    
    setGrupos([...grupos.filter( (grupo) => grupo.id_grupo !== id_grupo_seleccionado)])
    
    return resultado_json
  }

  const editarGrupoSeleccionado = async (grupo_seleccionado: Grupo) => {
    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Iniciando editarGrupoSeleccionado()');

    setControlador("EDITAR")
    setMostrarFormulario(true)
    
    console.log(grupo_seleccionado)

    setGrupoEditando({...grupo_seleccionado})

    const consultaHorarios = await obtenerHorariosGrupo(grupo_seleccionado.id_grupo);
    console.log(consultaHorarios)

    setHorariosGrupo([...consultaHorarios])


    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Finalizando editarGrupoSeleccionado()');
  }

  const guardarEdicionGrupoSeleccionado = async () => {
    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Iniciando editarGrupoSeleccionado()');

    const resultado= await fetch(`${baseUrl}/grupos/`, {
        method: 'PUT', // Método especificado
        mode: 'cors',   // Habilita CORS
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(grupoEditando)
    });
    const resultado_json= await resultado.json();
    console.log(resultado_json);

    if(horariosGrupo.length > 0){
      try {

        const horariosAnteriores = await obtenerHorariosGrupo(grupoEditando.id_grupo)
        console.log(horariosAnteriores)

        const idsAnteriores = new Set(horariosAnteriores.map((h: Horario) => h.id_horario));

        const nuevosHorarios = horariosGrupo.filter(h => !idsAnteriores.has(h.id_horario));
        const horariosExistentes = horariosGrupo.filter(h => idsAnteriores.has(h.id_horario));

        console.log('Nuevos horarios:', nuevosHorarios);

        if(nuevosHorarios.length > 0){
          const response = await fetch(`${baseUrl}/horarios/grupo/agregar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_grupo: grupoEditando.id_grupo, arregloHorarios: [...nuevosHorarios] })
          });
          const data = await response.json();
          console.log('%cRespuesta del servidor:', 'color: green;', data);
        }

        
        if(horariosExistentes.length > 0) {
          const response = await fetch(`${baseUrl}/horarios/grupo/modificar`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_grupo: grupoEditando.id_grupo, arregloHorarios: [...horariosExistentes] })
          });
          const data = await response.json();
          console.log('%cRespuesta del servidor:', 'color: green;', data);
        }else{
          const response = await fetch(`${baseUrl}/horarios/grupo/agregar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_grupo: grupoEditando.id_grupo, arregloHorarios: [...horariosGrupo] })
          });
          const data = await response.json();
          console.log('%cRespuesta del servidor:', 'color: green;', data);
        } 
          
      } catch (error) {
        console.error('Error al enviar los horarios:', error);
      }
    }

    setControlador("AGREGAR")
    setMostrarFormulario(false)

    const actualizados = grupos.map(grupo =>
      grupo.id_grupo === grupoEditando.id_grupo ? grupoEditando : grupo
    );
    setGrupos(actualizados);
    setGrupoEditando({ id_grupo: 0, nombre_grupo: '', id_curso: 0, id_profesor_grupo: 0 });
    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Finalizando editarGrupoSeleccionado()');
  }
  

  const agregarEstudianteEnGrupo = async () => {
  setMostrarAsignarEstudianteAGrupo(true);
  const resultadoEstudiantes = await obtenerEstudiantes();
  console.log(resultadoEstudiantes);
  console.log(listaEstudiantesPorGrupo);

  const estudiantesGrupoActual = listaEstudiantesPorGrupo[mostrarEstudiantesGrupo!.id_grupo] || [];

  const estudiantesFiltrados = resultadoEstudiantes.filter(est =>
    !estudiantesGrupoActual.some(e => e.id_usuario === est.id_usuario)
  );

  console.table(estudiantesFiltrados);
  setListasEstudiantes(estudiantesFiltrados);
};

  const guardarEstudianteEnGrupo = () => {
    
  }
  const editarEstudianteEnGrupo = (estudiante: any) => {
    console.log(estudiante)
    setEditarGrupoEstudianteSeleccionado(true)
    setEstudianteSeleccionado(estudiante)
  }
  const eliminarEstudianteEnGrupo = async (id_estudiante_seleccionado: number) => {
    console.log(id_estudiante_seleccionado)
    const respuesta = await eliminarEstudiateDeGrupo(id_estudiante_seleccionado)
    console.log(respuesta)

    if (!mostrarEstudiantesGrupo) return;

    const idGrupo = mostrarEstudiantesGrupo.id_grupo;

    // Obtener la lista actual
    const estudiantesActuales = listaEstudiantesPorGrupo[idGrupo] || [];

    // Filtrar la lista para eliminar al estudiante con ese id_usuario
    const nuevosEstudiantes = estudiantesActuales.filter(est => est.id_usuario !== id_estudiante_seleccionado);

    // Actualizar el estado con la nueva lista
    setListaEstudiantesPorGrupo({
      ...listaEstudiantesPorGrupo,
      [idGrupo]: nuevosEstudiantes
    });

    window.location.href =  window.location.href 

  }

  const [mostrarAsignarEstudianteAGrupo, setMostrarAsignarEstudianteAGrupo] = useState<boolean>(false)
  const [editarGrupoEstudianteSeleccionado, setEditarGrupoEstudianteSeleccionado] = useState<boolean>(false)
  const cerrarListaEstudiantes = () => setMostrarEstudiantesGrupo(null);


  const [grupoAsignadoEstudiante, setGrupoAsignadoEstudiante] = useState<Grupo>(
    { id_grupo: 0, nombre_grupo: '', id_curso: 0, id_profesor_grupo: 0}
  )

  const agregarEstudianteAGrupo = async () => {
    console.log("agregarEstudianteAGrupo")
    if(mostrarEstudiantesGrupo){
      console.log(mostrarEstudiantesGrupo.id_grupo)
      await agregarEstudianteGrupo(estudianteSeleccionado,mostrarEstudiantesGrupo.id_grupo)

       // Después de agregar el estudiante:
      const estudiantesActualizados = await obtenerEstudiantesGrupo(mostrarEstudiantesGrupo.id_grupo);
      setListaEstudiantesPorGrupo(prev => ({
        ...prev,
        [mostrarEstudiantesGrupo.id_grupo]: estudiantesActualizados
      }));

    }

    setEstudianteSeleccionado(
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
        id_grupo: 0
    }
  )

    console.log(estudianteSeleccionado)

   

  }  

  const reasignarEstudianteAGrupo = async () => {

    console.log(estudianteSeleccionado)

    const idGrupoNuevo = grupoAsignadoEstudiante.id_grupo;

    const resultadoReasignar = await reasignarEstudianteGrupo(estudianteSeleccionado, idGrupoNuevo);

    console.log(resultadoReasignar)

    // 🔄 Actualiza el grupo nuevo
    const estudiantesNuevoGrupo = await obtenerEstudiantesGrupo(idGrupoNuevo);

    console.log(estudiantesNuevoGrupo)

    window.location.href =  window.location.href 


  }

  const volverATablaDeGrupos = () => {
    console.log("volverATablaDeGrupos")
    setEstudianteSeleccionado(
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
        id_grupo: 0
    }
    
  )
  setEditarGrupoEstudianteSeleccionado(false)
  setGrupoAsignadoEstudiante({ id_grupo: 0, nombre_grupo: '', id_curso: 0, id_profesor_grupo: 0})
  }  
  return (
    <>
      <Header
              text="MULTIPLAYER" onClick={() => Router.push("/")}
              text1="Panel de Juegos" onClick1={() => Router.push("/videojuego")}
              text2="Menu" onClick2={() => Router.push("/Amenu")}
              text3="Mis datos" onClick3={() => Router.push("/Aadmins-lista")}
              text4="Salir" onClick4={() => Router.push("/")}
            />

      <div className="listado body_estudiantes">
        <div className="encabezado">
          <div className="tituloListado" style={{ cursor: 'pointer' }}>
            <h2 className="cursos" onClick={handleTitleClick}>GRUPOS</h2>
            {!mostrarEstudiantesGrupo && !mostrarFormulario && (
              <button onClick={mostrarFormularioAgregar}>Agregar Grupo</button>
            )}
            {mostrarEstudiantesGrupo && (
              <button onClick={onVolverListaGrupos}>Volver a grupos</button>
            )}
          </div>
          {!mostrarEstudiantesGrupo && !mostrarFormulario && (
            <div className="barraBusqueda">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Buscar grupos..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <img
                  src="./lupa-icon.png"
                  alt="Buscar"
                  className="search-icon"
                  onClick={handleSearchClick}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mostrar tabla o lista de estudiantes */}
        {!mostrarFormulario && (

          <table className="laTabla">
            <thead>
              <tr>
                <th>Grupo</th>
                <th>Profesor</th>
                <th>Horarios</th>
                <th>Estudiantes</th>
                <th>Curso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gruposFiltrados.map((grupo, index) => (
                <tr key={grupo.id_grupo}>
                  <td>{grupo.nombre_grupo}</td>
                  <td>{profesoresPorGrupo[grupo.id_grupo] || "Cargando..."}</td>
                  <td>

                      {
                        listaHorarios.flat().filter( horariosFilter => horariosFilter.id_grupo === grupo.id_grupo).map((detalleHorario, index) => (
                          <p key={index}>
                            {detalleHorario.dia_semana} {detalleHorario.hora_inicio} a {detalleHorario.hora_fin}
                          </p>
                        ))
                      }
                    
                    
                  
                  </td>
                  <td>
                    <button onClick={() => onVerEstudiantes(grupo)}>Ver</button>
                  </td>
                  <td>{cursosPorGrupo[grupo.id_grupo] || "Cargando..."}</td>
                  <td className="display_flex">
                    <button onClick={() => editarGrupoSeleccionado(grupo)}>Editar</button>
                    <button onClick={() => borrarGrupoSeleccionado(grupo.id_grupo)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Formulario de grupo */}
        {(mostrarFormulario) && (
          <div className="formulario-grupo">
            <h3>{(controlador !== "AGREGAR") ? "Editando Grupo" : "Agregar Nuevo Grupo"}</h3>

            {/* Nombre del grupo */}
            <label>
              Nombre del grupo:
              <input
                type="text"
                placeholder="Ej: Grupo A"
                value={(controlador !== "AGREGAR") ? grupoEditando.nombre_grupo : nuevoGrupo.nombre_grupo}
                onChange={e => {
                  const val = e.target.value;
                  if ((controlador !== "AGREGAR")){
                    setGrupoEditando({ ...grupoEditando, nombre_grupo: val });
                  }else{
                    setNuevoGrupo({...nuevoGrupo, nombre_grupo: val})
                  }
                    
                }}
              />
            </label>

            {/* Curso */}
            <label>
              Curso:
              <select
                value={(controlador !== "AGREGAR") ? grupoEditando.id_curso : nuevoGrupo.id_curso}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  if ((controlador !== "AGREGAR")){
                    setGrupoEditando({ ...grupoEditando, id_curso: val });
                  }else{
                    setNuevoGrupo({ ...nuevoGrupo, id_curso: val });
                  } 
                }}
              >
                <option value={0}>Seleccione un curso</option>
                {cursos.map(curso => (
                  <option key={curso.id_curso} value={curso.id_curso}>{curso.nombre_curso}</option>
                ))}
              </select>
            </label>

            {/* Profesor */}
            <label>
              Profesor:
              <select
                value={(controlador !== "AGREGAR") ? grupoEditando.id_profesor_grupo : nuevoGrupo.id_profesor_grupo}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  if((controlador !== "AGREGAR")){
                    setGrupoEditando({...grupoEditando, id_profesor_grupo: val})
                  }else{
                    setNuevoGrupo({...nuevoGrupo, id_profesor_grupo: val})
                  }
                }}
              >
                <option value={0}>Seleccione un profesor</option>
                {profesores.map(prof => (
                  <option key={prof.id_profesor} value={prof.id_profesor}>{prof.nombre + " " + prof.apellido}</option>
                ))}
              </select>
            </label>

            {/* Horarios */}
            <div className="horarios-section">
              <h4>Horarios</h4>
              {horariosGrupo.map((horario, idx) => (
                <div key={horario.id_horario} className="horario-item">
                  <label>Día:
                    <select
                      value={horario.dia_semana}
                      onChange={e => {
                        const newDia = e.target.value;
                        setHorariosGrupo(hs => hs.map((h, i) => i === idx ? { ...h, dia_semana: newDia } : h));
                      }}
                    >
                      {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map(dia => (
                        <option key={dia} value={dia}>{dia}</option>
                      ))}
                    </select>
                  </label>

                  <label>Hora inicio:
                    <input
                      type="time"
                      value={horario.hora_inicio}
                      onChange={e => {
                        const newHoraInicio = e.target.value;
                        setHorariosGrupo(hs => hs.map((h, i) => i === idx ? { ...h, hora_inicio: newHoraInicio } : h));
                      }}
                    />
                  </label>

                  <label>Hora fin:
                    <input
                      type="time"
                      value={horario.hora_fin}
                      onChange={e => {
                        const newHoraFin = e.target.value;
                        setHorariosGrupo(hs => hs.map((h, i) => i === idx ? { ...h, hora_fin: newHoraFin } : h));
                      }}
                    />
                  </label>

                  <button className="btn-eliminar" onClick={() => {
                    setHorariosGrupo(hs => hs.filter((_, i) => i !== idx));
                  }}>
                    ❌
                  </button>
                </div>
              ))}

              <button className="btn-agregar-horario" onClick={() => {
                const nuevo: Horario = {
                  id_horario: Date.now(),
                  dia_semana: "Lunes",
                  hora_inicio: "08:00",
                  hora_fin: "10:00",
                  id_grupo: (controlador !== "AGREGAR") ? grupoEditando.id_grupo : nuevoGrupo.id_grupo,
                };
                setHorariosGrupo([...horariosGrupo, nuevo]);
              }}>
                ➕ Agregar horario
              </button>
            </div>

            {/* Botones de acción */}
            <div className="acciones-formulario">
              <button className="btn-guardar" onClick={() => {
                if (controlador !== "AGREGAR") {
                  guardarEdicionGrupoSeleccionado();
                } else {
                  crearNuevoGrupo();
                }}}
            >
                {(controlador !== "AGREGAR") ? "Guardar Cambios" : "Agregar Grupo"}
              </button>
              <button onClick={() => setMostrarFormulario(false)}>Cancelar</button>
            </div>
          </div>
        )}




    {/* Lista de estudiantes de un grupo */}
    {mostrarEstudiantesGrupo && (
      <div className="tabla-estudiantes">
        <h3>Estudiantes de {mostrarEstudiantesGrupo.nombre_grupo}
          
        </h3>
        <button onClick={() => agregarEstudianteEnGrupo()}><img src="/icons/edit_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg" alt="Icono fleca" style={{ width: 16, height: 16 }} /></button>
        {
          mostrarAsignarEstudianteAGrupo && 
          (
            <div className="estudiante-selector-con-estilo">
              <label className="selector-estudiante-label">
                Estudiante:
                <select
                  className="selector-estudiante"
                  value={estudianteSeleccionado.id_usuario}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEstudianteSeleccionado(
                      listaEstudiantes.find((est) => est.id_usuario === val)
                    );
                  }}
                >
                  <option value={0} disabled={true}>Seleccione un estudiante</option>
                  {listaEstudiantes.map(est => (
                    <option key={est.id_usuario} value={est.id_usuario}>
                      {est.nombre} {est.apellido}
                    </option>
                  ))}
                </select>
              </label>
            </div>

          )
        }
        {
          estudianteSeleccionado.id_usuario != 0 && !editarGrupoEstudianteSeleccionado &&
          <div>
             <button onClick={() => agregarEstudianteAGrupo()}><img src="/icons/check_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg" alt="Icono fleca" style={{ width: 16, height: 16 }} /></button>
              <button onClick={() => volverATablaDeGrupos()}><img src="/icons/close_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg" alt="Icono fleca" style={{ width: 16, height: 16 }} /></button>
          </div>
        }
        {
          editarGrupoEstudianteSeleccionado &&
          <div className="grupo-selector-con-botones">
            <label className="selector-grupo-label">
              Grupo:
              <select
                className="selector-grupo"
                value={grupoAsignadoEstudiante.id_grupo === 0 ? 0 : grupoAsignadoEstudiante.id_grupo}
                onChange={(e) => {
                  const idGrupo = Number(e.target.value);
                  const grupoSeleccionado = grupos.find(grupo => grupo.id_grupo === idGrupo);
                  if (grupoSeleccionado) setGrupoAsignadoEstudiante(grupoSeleccionado);
                }}
              >
                <option value={0} disabled>Seleccione un grupo</option>
                {grupos.map(grupo => (
                  <option key={grupo.id_grupo} value={grupo.id_grupo}>
                    {grupo.nombre_grupo}
                  </option>
                ))}
              </select>
            </label>

            <div className="botones-grupo">
              <button onClick={() => reasignarEstudianteAGrupo()}>
                <img
                  src="/icons/check_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg"
                  alt="Confirmar"
                  style={{ width: 16, height: 16 }}
                />
              </button>
              <button onClick={() => volverATablaDeGrupos()}>
                <img
                  src="/icons/close_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg"
                  alt="Cancelar"
                  style={{ width: 16, height: 16 }}
                />
              </button>
            </div>
          </div>

        }
         <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th className="texto_central">Correo</th>
          <th className="texto_central">Celular</th>
          <th className="texto_central">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {(listaEstudiantesPorGrupo[mostrarEstudiantesGrupo.id_grupo] || []).map((estudiante, index) => (
          <tr key={index}>
            <td>{estudiante.nombre || "null"}</td>
            <td>{estudiante.apellido || "null"}</td>
            <td>{estudiante.correo || "null"}</td>
            <td>{estudiante.telefono || "null"}</td>
            <td className="display_flex">
              <button onClick={() => editarEstudianteEnGrupo(estudiante)}>
                <img src="/icons/edit_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg" alt="Editar" style={{ width: 16, height: 16 }} />
              </button>
              <button onClick={() => eliminarEstudianteEnGrupo(estudiante.id_usuario)}>
                <img src="/icons/delete_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg" alt="Eliminar" style={{ width: 16, height: 16 }} />
                
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
      <button
            onClick={cerrarListaEstudiantes}
            className="boton-cerrar-lista"
            title="Cerrar lista"
            style={{ marginLeft: "10px", background: "none", border: "none", cursor: "pointer" }}
          >
            <img
              src="/icons/close_16dp_E3E3E3_FILL0_wght400_GRAD0_opsz20.svg"
              alt="Cerrar"
              style={{ width: 16, height: 16 }}
            />
          </button>
      </div>
    )}
  </div>
</>);
}
