'use client';
import { use, useEffect, useState } from "react";
import './styles.css';
import Header from "../../components/header/header";
import { useRouter } from "next/navigation";
import Curso from "./interfaces/curso.interface";
import Grupo from "./interfaces/grupo.interface";
import Estudiante from "./interfaces/estudiante.interface";


export default function AdministradoresLista() {
    const Router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
    const [listaCursos, setListaCursos] = useState<Curso[]>([]);
    const [cursosFiltrados, setCursosFiltrados] = useState<Curso[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    async function obtenerCursos() : Promise<Curso[]>{
        const resultado= await fetch(`${baseUrl}/cursos`,{
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
        const cargarCursos = async () => {
            const respuesta = await obtenerCursos();
            setListaCursos(respuesta);
            setCursosFiltrados(respuesta);
        };
    
       cargarCursos();
    }, []);

    const filtrarCursos = () => {
        console.log(listaCursos);
        
        const results = listaCursos.filter(curso =>
            (curso.nombre_curso?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
        
       setCursosFiltrados(results);
    };
    
    useEffect(() => {
        filtrarCursos();
    }, [searchTerm]);
    

    const [cursoEditando, setCursoEditando] = useState<Curso | null>(null);
    const [grupoEditando, setGrupoEditando] = useState<Grupo>(
        {
            id_grupo: 0,
            nombre_grupo: "string",
            id_curso: 0
        }
    )

    const [nuevoCurso, setNuevoCurso] = useState<Curso>({
        id_curso: 0,
        nombre_curso: ""
    });

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarGrupos, setMostrarGrupos] = useState(false)

    const onAgregarCurso = async () => {
        
        const nuevo = { ...nuevoCurso };
        
        const response = await fetch(`${baseUrl}/cursos`, {
            method: 'POST',
            mode: 'cors',   // Habilita CORS
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    nombre_curso: nuevo.nombre_curso
                }
            ),
        });

        console.log(response)

        const resultadoConsulta = await response.json()
        console.log(resultadoConsulta)

        if(response.status === 200){
            const nuevoCursoAgregado: Curso = {
                id_curso: resultadoConsulta.id_curso,
                nombre_curso: resultadoConsulta.nombre_curso
            }
            setListaCursos([...listaCursos, {...nuevoCursoAgregado}]);
            setCursosFiltrados([...cursosFiltrados, {...nuevoCursoAgregado}]);
            setMostrarFormulario(false); // Asegúrate de que el formulario se cierre después de guardar
            setNuevoCurso({
                id_curso: 0,
                nombre_curso: ""
            });
        }
        
    };

    const onEditar = (curso: Curso) => {
        setCursoEditando({ ...curso });
    };

    
    const onGuardarEdicion = async () => {

        try {
            if (!cursoEditando) return;
            console.log(cursoEditando)
            const response = await fetch(`${baseUrl}/cursos`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cursoEditando),
            });

            const resultadoConsulta = await response.json()
            console.log(resultadoConsulta)

            const updatedList = listaCursos.map((curso:Curso) =>
                curso.id_curso === cursoEditando.id_curso
                  ? { ...cursoEditando }  // Solo cambiamos el atributo necesario
                  : curso
            );

            setListaCursos(updatedList);
            setCursosFiltrados(updatedList);
            setCursoEditando(null);
  
        } catch (error) {
            console.error("Error en la petición:", error);
        }
            
    };
    
    
    const onEliminar = async (id_curso_seleccionado: number) => {
    
        try {

            const confirmacion = confirm("¿Estás seguro de que quieres eliminar este curso?");
            if (!confirmacion) return;

            console.log("Eliminando")

            const response = await fetch(`${baseUrl}/cursos`, {
                method: 'DELETE',
                mode: 'cors',   // Habilita CORS
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: id_curso_seleccionado}),
            });

            const resultadoConsulta = await response.json()
            console.log(resultadoConsulta)

            const arrayActualizado = listaCursos.filter(curso => curso.id_curso !== id_curso_seleccionado)
            console.log(arrayActualizado)
            setListaCursos(arrayActualizado);
            setCursosFiltrados(arrayActualizado);

        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };



    const handleTitleClick = () => {
        window.location.reload();
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value); // Esto ya dispara useEffect que filtra
    };

    const handleSearchClick = () => {
        filtrarCursos();
    };

    const mostrarFormularioAgregar = () => {
        console.log("Mostrar formulario para agregar")
        setMostrarFormulario(true);
        setCursoEditando(null); // Asegúrate de que no se muestre el formulario de edición al mismo tiempo
    };

    const [grupoSeleccionado, setGrupoSeleccionado] = useState<Grupo>({
        id_grupo: 0,
        nombre_grupo: "",
        id_curso: 0
    })

    const [cursoEscogido, setCursoEscogido] = useState<Curso>({
        nombre_curso: "",
        id_curso: 0
    })

    const [grupos, setGrupos] = useState<Grupo[]>([])
    const [gruposFaltantes, setGruposFaltantes] = useState<Grupo[]>([])

    const [grupoActivo, setGrupoActivo] = useState<string | null>(null);

    const [listaEstudiantes, setListaEstudiantes] = useState<Estudiante[]>([])

    const [mostrarAsignacion, setMostrarAsignacion] = useState<boolean>(false)

    const [mostrarFormularioGrupo, setMostrarFormularioGrupo] = useState<boolean>(false)

    const [mostrarFormularioEditarGrupo, setMostrarFormularioEditarGrupo] = useState<boolean>(false)

    mostrarFormularioEditarGrupo

    const toggleGrupo = async (id: number, nombre: string) => {

        const response = await fetch(`${baseUrl}/grupos/${id}/estudiantes`, {
            method: 'GET',
            mode: 'cors',   // Habilita CORS
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resultadoConsulta = await response.json()
        console.log(resultadoConsulta)

        setListaEstudiantes(resultadoConsulta)

        setGrupoActivo(prev => (prev === nombre ? null : nombre));
    };

    const buscarGruposConCursoFaltante = async () => {
        try {

            const response = await fetch(`${baseUrl}/grupos/curso/${cursoEscogido.id_curso}/faltantes`, {
                method: 'GET',
                mode: 'cors',   // Habilita CORS
                headers: {
                  'Content-Type': 'application/json'
                }
            });

            const resultadoConsulta = await response.json()
            console.log(resultadoConsulta)

            setGruposFaltantes(resultadoConsulta)

            setMostrarAsignacion(!mostrarAsignacion)


        } catch (error) {
            console.error("Error en la petición:", error);
        }
    }

    const gestionarGrupos = async (curso_seleccionado: Curso) => {
        console.log("gestionarGrupos()")
        console.log(curso_seleccionado)
        setMostrarGrupos(!mostrarGrupos)

        try {

            const response = await fetch(`${baseUrl}/grupos/curso/${curso_seleccionado.id_curso}`, {
                method: 'GET',
                mode: 'cors',   // Habilita CORS
                headers: {
                  'Content-Type': 'application/json'
                }
            });

            const resultadoConsulta = await response.json()
            console.log(resultadoConsulta)

            setGrupos(resultadoConsulta)
            setCursoEscogido(curso_seleccionado)



        } catch (error) {
            console.error("Error en la petición:", error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        console.log(e.target.value)
        const informacionGrupo = grupos.filter( (grupo:Grupo) => grupo.id_grupo.toString() === e.target.value)
        console.log(informacionGrupo)
        console.log(cursoEscogido)

        setGrupoSeleccionado(informacionGrupo[0]);
    };

    const handleChangeGrupo = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setNuevoCurso({...nuevoCurso,nombre_curso: e.target.value});
    };

    const handleSubmitGrupo = async (e: React.FormEvent) => {
        e.preventDefault(); // evita recargar la página
        const response = await fetch(`${baseUrl}/grupos`, {
            method: 'POST',
            mode: 'cors',   // Habilita CORS
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    nombre_grupo: nuevoCurso.nombre_curso,
                    id_curso: cursoEscogido.id_curso
                }
            )
        });

        const resultadoConsulta = await response.json()
        console.log(resultadoConsulta)
        console.log(nuevoCurso)

        setGrupos([...grupos,resultadoConsulta])
        setMostrarFormularioGrupo(!mostrarFormularioGrupo)

    };


    const asignarGrupoACurso = async () => {
        console.log("asignarGrupoACurso")

        const response = await fetch(`${baseUrl}/curso/asignar/grupo`, {
            method: 'PUT',
            mode: 'cors',   // Habilita CORS
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    id_grupo: grupoSeleccionado.id_grupo,
                    id_curso: cursoEscogido.id_curso
                }
            )
        }); 

        const resultadoConsulta = await response.json()
        console.log(resultadoConsulta)

        setMostrarAsignacion(!mostrarAsignacion)

        console.log(
                {
                    id_grupo: grupoSeleccionado.id_grupo,
                    id_curso: cursoEscogido.id_curso
                }
        )


    }

    const eliminarGrupo = async (id_grupo_seleccionado: number) => {
        console.log("eliminarGrupo")

        const response = await fetch(`${baseUrl}/grupos/${id_grupo_seleccionado}`, {
            method: 'DELETE',
            mode: 'cors',   // Habilita CORS
            headers: {
            'Content-Type': 'application/json'
            }
        }); 

        const resultadoConsulta = await response.json()
        console.log(resultadoConsulta)

        setGrupos([...grupos.filter( (grupo) => grupo.id_grupo !== id_grupo_seleccionado)])
    }

    const editarGrupo = async (grupo_seleccionado: Grupo) => {
        console.log("editarGrupo")

        console.log(grupo_seleccionado)

        console.log(mostrarTablaPrincipal)
        console.log(mostrarGrupos)

        setGrupoEditando({...grupo_seleccionado})

        setMostrarTablaPrincipal(false)

        setMostrarFormularioEditarGrupo(true)

        console.log(grupoEditando)

        /*
        const response = await fetch(`${baseUrl}/grupos/${id_grupo_seleccionado}`, {
            method: 'DELETE',
            mode: 'cors',   // Habilita CORS
            headers: {
            'Content-Type': 'application/json'
            }
        }); 

        const resultadoConsulta = await response.json()
        console.log(resultadoConsulta)

        setGrupos([...grupos.filter( (grupo) => grupo.id_grupo !== id_grupo_seleccionado)])

        */
    }

    const agregarNuevoCurso = async () => {
        console.log("agregarNuevoCurso()")
        setMostrarFormularioGrupo(!mostrarFormularioGrupo)
    }

    const [cambioValorCurso, SetCambioValorCurso] = useState(false)

    const [mostrarTablaPrincipal, setMostrarTablaPrincipal] = useState<boolean>(true)

    const handleChangeCurso = (e: React.ChangeEvent<HTMLSelectElement>) => {


        SetCambioValorCurso(!cambioValorCurso)
        const idSeleccionado = Number(e.target.value);
        const grupo = grupos.find(g => g.id_grupo === idSeleccionado);

        if (grupo) {
            console.log(grupo
                    )
            //setGrupoSeleccionado(grupo);
        }
    };

    const handleSubmitEditandoGrupo = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // evita que se recargue la página
        
        console.log("handleSubmitEditandoGrupo")
        const response = await fetch(`${baseUrl}/grupos`, {
                method: 'PUT',
                mode: 'cors',   // Habilita CORS
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        id_grupo: grupoEditando.id_grupo,
                        nombre_grupo: grupoEditando.nombre_grupo
                    }   
                )
            });

        const resultadoConsulta = await response.json()
        console.log(resultadoConsulta)

        setGrupos((prevGrupos) =>
            prevGrupos.map((grupo) =>
            grupo.id_grupo === grupoEditando.id_grupo ? { ...grupo, ...grupoEditando } : grupo
            )
         );

         setGrupoEditando(
            {
                id_grupo: 0,
                id_curso: 0,
                nombre_grupo: ""
            }
        )

        setMostrarFormularioEditarGrupo(false)



    }

    const handleChangeEditandoGrupo = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setGrupoEditando({...grupoEditando, nombre_grupo: e.target.value})
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

            <div className="listado">

            { /* Mostrar Tabla Principal - Lista de Cursos */}

            {
                mostrarTablaPrincipal && !mostrarGrupos && !mostrarFormulario && !cursoEditando && grupoEditando.id_grupo == 0 &&
                (
                <div className="encabezado">
                    <div className="tituloListado" style={{ cursor: 'pointer' }}>
                        <h2 className="administradores" onClick={() => handleTitleClick()}>CURSOS</h2>
                        <button onClick={() => mostrarFormularioAgregar()}>Agregar Cursos</button>
                    </div>
                    <div className="barraBusqueda">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Buscar cursos..."
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
                )
            }

            {
                !mostrarGrupos && !mostrarFormulario && !cursoEditando && 
                (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Acciones</th>
                                <th>Grupos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cursosFiltrados.map((cursoSeleccionado) => (
                                <tr key={cursoSeleccionado.id_curso}>
                                    <td>{cursoSeleccionado.id_curso ? cursoSeleccionado.id_curso : "null"}</td>
                                    <td>{cursoSeleccionado.nombre_curso ? cursoSeleccionado.nombre_curso : "null"}</td>
                                    
                                    <td>
                                        <button onClick={() => onEditar(cursoSeleccionado)}>Editar</button>
                                        <button onClick={() => onEliminar(cursoSeleccionado.id_curso)}>Eliminar</button>
                                    </td>
                                    <td>
                                        <button onClick={() => gestionarGrupos(cursoSeleccionado)}>Grupos</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }

            { /* Mostrar Tabla - Lista de Cursos */}
            
            {
                mostrarGrupos && !mostrarFormularioGrupo && !mostrarAsignacion && !mostrarFormulario && !mostrarFormularioEditarGrupo &&
                (
                    <div>
                        <button onClick={() => setMostrarGrupos(!mostrarGrupos)}>Volver a Cursos</button>
                        <h2>Lista de Grupos</h2>
                        <button onClick={() => buscarGruposConCursoFaltante()}>Asignar Grupo a Curso</button>
                        <button onClick={() => agregarNuevoCurso()}>Agregar Nuevo Grupo</button>
                        <table cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Nombre del Grupo</th>
                                <th>Acciones</th>
                                <th>Estudiantes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grupos.map((grupo) => (
                                <tr key={grupo.id_grupo}>
                                    <td>
                                        {grupo.nombre_grupo}
                                    </td>
                                    <td >
                                        <div>
                                            <button onClick={() => editarGrupo(grupo)}>Editar</button>
                                            <button onClick={() => eliminarGrupo(grupo.id_grupo)}>Borrar</button>
                                        </div>
                                        
                                    </td>
                                    <td >
                                         <button onClick={() => toggleGrupo(grupo.id_grupo,grupo.nombre_grupo)}>Estudiantes</button>
                                        {
                                            grupoActivo === grupo.nombre_grupo &&
                                            (
                                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                                    {listaEstudiantes.map((estudiante) => (
                                                    <li key={estudiante.id_usuario} >
                                                        {estudiante.nombre + ' ' + estudiante.apellido}
                                                    </li>
                                                    ))}
                                                </ul>
                                            )
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    
                )
            }

            {
                mostrarGrupos && !mostrarFormularioGrupo && mostrarAsignacion  && !mostrarFormulario &&
                (
                    <div>
                        Adios
                        <button onClick={() => setMostrarAsignacion(!mostrarAsignacion)}>Volver a Grupos</button>
                        <h2>Lista de Grupos Faltantes</h2>
                        <select value={grupoSeleccionado.id_grupo} onChange={handleChange}>
                            <option value={0} disabled>-- Selecciona --</option>
                            {gruposFaltantes.map((grupo) => (
                            <option key={grupo.id_grupo} value={grupo.id_grupo}>
                                {grupo.nombre_grupo}
                            </option>
                            ))}
                        </select>
                        <button onClick={() => asignarGrupoACurso()} disabled = {!(grupoSeleccionado.nombre_grupo !== "")}>ASIGNAR CURSO A GRUPO</button>
                    </div>
                    
                )
            }

            {!mostrarGrupos && !mostrarFormularioGrupo && !mostrarAsignacion && mostrarFormulario && 
                (
                    <div className="formulario-agregar">
                        <h3>Agregar Nuevo Curso</h3>
                        <input type="text" placeholder="Nombre" value={nuevoCurso.nombre_curso} onChange={e => setNuevoCurso({ ...nuevoCurso, nombre_curso: e.target.value })} />
                        <button onClick={() => onAgregarCurso()}>Guardar</button>
                        <button onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                    </div>
                )
            }

            

            {!mostrarGrupos && cursoEditando && (
                <div className="formulario-edicion">
                    <h3>Editando curso</h3>
                    <input type="text" placeholder="Nombre" value={cursoEditando.nombre_curso} onChange={e => setCursoEditando({ ...cursoEditando, nombre_curso: e.target.value })} />
                    <button onClick={() => onGuardarEdicion()}>Guardar</button>
                    <button onClick={() => setCursoEditando(null)}>Cancelar</button>
                </div>
            )}


            {
                mostrarFormularioGrupo &&
                (
                    <div>
                        mostrarFormularioGrupo
                        <button onClick={() => setMostrarFormularioGrupo(!mostrarFormularioGrupo)}>Volver</button>
                        <h2>Formulario de Grupos</h2>
                         <form onSubmit={handleSubmitGrupo}>
                            <label htmlFor="nombre">Nombre:</label>
                            <input
                            type="text"
                            id="nombre"
                            value={nuevoCurso.nombre_curso}
                            onChange={handleChangeGrupo}
                            placeholder="Ingresa tu nombre"
                            />
                            <button type="submit">Enviar</button>
                        </form>
                        <button onClick={() => null} disabled = {true}>CREAR NUEVO GRUPO</button>
                    </div>
                    
                )
            }

            {
                !mostrarTablaPrincipal && mostrarFormularioEditarGrupo &&
                (
                    <div>
                        <button onClick={() => {setMostrarFormularioEditarGrupo(false)}}>Volver</button>
                        <h2>Formulario de Edición de Grupo</h2>
                         <form onSubmit={handleSubmitEditandoGrupo}>
                            <label htmlFor="nombre">Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                value={grupoEditando.nombre_grupo}
                                onChange={handleChangeEditandoGrupo}
                                placeholder="Ingresa tu nombre"
                            />
                            <button type="submit">Enviar</button>
                        </form>
                        <button onClick={() => null} disabled = {true}>Confirmar Cambios</button>
                    </div>
                    
                )
            }
            </div>
        </>
    );
}