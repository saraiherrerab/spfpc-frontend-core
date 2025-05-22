'use client';
import { useState, useEffect } from 'react';
import './styles.css';
import '../login.css';
import Header from "../../components/header/header";
import { useRouter } from "next/navigation";
import obtenerCursos from './functions/obtenerCursos';
import Curso from './interfaces/curso.interface';
import obtenerProfesoresCurso from './functions/obtenerProfesoresCurso';
import obtenerGruposCurso from './functions/obtenerGruposCurso';

interface Grupo {
  id_grupo: number,
  nombre_grupo: string,
  id_curso: number,
}

interface Profesor {
  id_usuario: number,
  id_profesor: number,
  nombre: string,
  grupos_ids: number[],
}

export default function GruposYCursos() {
  const Router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  /* Este arreglo almacena todos los cursos en el sistema */
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [nuevoCurso, setNuevoCurso] = useState<Curso>({ id_curso: 0, nombre_curso: '' });
  const [cursoEditando, setCursoEditando] = useState<Curso | null>(null);

  const [grupos, setGrupos] = useState<Grupo[]>([
    { id_grupo: 1, nombre_grupo: "Grupo A", id_curso: 1 },
    { id_grupo: 2, nombre_grupo: "Grupo B", id_curso: 1 },
    { id_grupo: 3, nombre_grupo: "Grupo C", id_curso: 2 }
  ]);

  const [profesores, setProfesores] = useState<Profesor[]>([
    { id_usuario: 101, id_profesor: 1, nombre: "Profe Ana", grupos_ids: [1, 3] },
    { id_usuario: 102, id_profesor: 2, nombre: "Profe Luis", grupos_ids: [2] }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [cursosFiltrados, setCursosFiltrados] = useState<Curso[]>(cursos);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
 

// 1. Obtener los cursos al montar el componente
useEffect(() => {
  const cargarCursos = async () => {
    const respuesta = await obtenerCursos();
    setCursos(respuesta); // No necesitas usar spread [...respuesta]
  };
  cargarCursos();
}, []);

// ✅ 2. Función de filtrado afuera del useEffect
const filtrarCursos = () => {
  const results = cursos.filter(c =>
    c.nombre_curso.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setCursosFiltrados(results);
};

// 3. Filtrar cuando cambia el término o los cursos
useEffect(() => {
  filtrarCursos();
}, [searchTerm, cursos]);

// 4. Handlers para búsqueda
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
};

const handleSearchClick = () => {
  filtrarCursos(); // ✅ Ya está definida
};

  const handleTitleClick = () => {
    setSearchTerm('');
    setCursosFiltrados(cursos);
  };

  

  const onAgregarCurso = () => {
    setCursos([...cursos, nuevoCurso]);
    setMostrarFormulario(false);
  };

  const onEditar = (curso: Curso) => {
    setCursoEditando({ ...curso });
  };

  const obtenerGruposDelCurso = (idCurso: number) => 
  {
    grupos.filter(g => g.id_curso === idCurso);
  }
    

  /* Funciones y variables para control de la página  */
  const mostrarFormularioAgregar = () => {
    setNuevoCurso({ id_curso: 0, nombre_curso: '' });
    setMostrarFormulario(true);
  };

  /* Funciones principales */

  const crearNuevoCurso = async () => {

    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Iniciando crearNuevoCurso()');

    console.log(nuevoCurso)

    const resultado= await fetch(`${baseUrl}/cursos`, {
        method: 'POST', // Método especificado
        mode: 'cors',   // Habilita CORS
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoCurso)
    });
    const resultado_json= await resultado.json();
    console.log(resultado_json);

    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Finalizando crearNuevoCurso()');
    
    setCursos([...cursos, {id_curso: resultado_json.id_curso, nombre_curso: resultado_json.nombre_curso}])
    setMostrarFormulario(false);
    
    return resultado_json
  }

  const borrarCursoSeleccionado = async (id_curso_seleccionado: number) => {
    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Iniciando borrarCursoSeleccionado()');

    console.log(nuevoCurso)

    const resultado= await fetch(`${baseUrl}/cursos/` + id_curso_seleccionado, {
        method: 'DELETE', // Método especificado
        mode: 'cors',   // Habilita CORS
        headers: {
          'Content-Type': 'application/json'
        }
    });
    const resultado_json= await resultado.json();
    console.log(resultado_json);

    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Finalizando borrarCursoSeleccionado()');
    
    setCursos([...cursos.filter( (curso) => curso.id_curso !== id_curso_seleccionado)])
    
    return resultado_json
  }

  const editarCursoSeleccionado = async () => {
    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Iniciando editarCursoSeleccionado()');

    console.log(cursoEditando)

    const resultado= await fetch(`${baseUrl}/cursos`, {
        method: 'PUT', // Método especificado
        mode: 'cors',   // Habilita CORS
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cursoEditando)
    });

    const resultado_json= await resultado.json();
    console.log(resultado_json);

    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Finalizando editarCursoSeleccionado()');
    
    if (!cursoEditando) return;
    const actualizados = cursos.map(c =>
      c.id_curso === cursoEditando.id_curso ? cursoEditando : c
    );
    setCursos(actualizados);
    setCursoEditando(null);
    
    return resultado_json
  }

  const [mapaGruposPorCurso, setMapaGruposPorCurso] = useState<{ [id: number]: any[] }>({});
  const [mapaProfesoresPorCurso, setMapaProfesoresPorCurso] = useState<{ [id: number]: any[] }>({});

  useEffect(() => {
  const cargarDatosCursos = async () => {
    const nuevosGrupos: { [id: number]: any[] } = {};
    const nuevosProfesores: { [id: number]: any[] } = {};

    for (const curso of cursosFiltrados) {
      const grupos = await obtenerGruposCurso(curso.id_curso);
      const profesores = await obtenerProfesoresCurso(curso.id_curso);

      nuevosGrupos[curso.id_curso] = grupos;
      nuevosProfesores[curso.id_curso] = profesores;
    }

    setMapaGruposPorCurso(nuevosGrupos);
    setMapaProfesoresPorCurso(nuevosProfesores);
  };

  if (cursosFiltrados.length > 0) {
    cargarDatosCursos();
  }
}, [cursosFiltrados]);

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
            <h2 className="cursos" onClick={handleTitleClick}>CURSOS</h2>
            <button onClick={mostrarFormularioAgregar}>Agregar Cursos</button>
          </div>
          <div className="barraBusqueda">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Buscar cursos..."
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
        </div>

        {/* Mostrar tabla de cursos */}
        {!mostrarFormulario && !cursoEditando && (
          <>
            <table className="laTabla">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Grupos</th>
                  <th>Profesores</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cursosFiltrados.map(curso => {
                  const gruposCurso = mapaGruposPorCurso[curso.id_curso] || [];
                  const profesoresCurso = mapaProfesoresPorCurso[curso.id_curso] || [];

                  return (
                    <tr key={curso.id_curso}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {curso.nombre_curso}
                        <button onClick={() => onEditar(curso)}>Editar</button>
                      </td>

                      <td>
                        <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                          {gruposCurso.map(grupo => (
                            <li key={grupo.id_grupo}>{grupo.nombre_grupo}</li>
                          ))}
                        </ul>
                      </td>

                      <td>
                        <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                          {profesoresCurso.map((profesor,index) => (
                            <li key={index}>
                              {profesor.nombre} {profesor.apellido}
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td className="display_flex">
                        <button onClick={() => borrarCursoSeleccionado(curso.id_curso)}>Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Botón debajo de la tabla */}
            <button onClick={() => Router.push('/Grupos')}>
              Gestionar grupos
            </button>
          </>
        )}

        {/* Formulario para agregar curso */}
        {mostrarFormulario && (
          <div className="formulario-agregar">
            <h3>Agregar Nuevo Curso</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoCurso.nombre_curso}
              onChange={e => setNuevoCurso({ ...nuevoCurso, nombre_curso: e.target.value })}
            />
            <button onClick={() => crearNuevoCurso()} disabled={!nuevoCurso.nombre_curso.trim()}>Guardar</button>
            <button onClick={() => setMostrarFormulario(false)}>Cancelar</button>
          </div>
        )}

        {/* Formulario para editar curso */}
        {cursoEditando && (
          <div className="formulario-edicion">
            <h3>Editando curso</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={cursoEditando.nombre_curso || ''}
              onChange={e => setCursoEditando({ ...cursoEditando, nombre_curso: e.target.value })}
            />
            <button onClick={editarCursoSeleccionado} disabled={!cursoEditando.nombre_curso.trim()}>Guardar</button>
            <button onClick={() => setCursoEditando(null)}>Cancelar</button>
          </div>
        )}
      </div>
    </>
  );
}

