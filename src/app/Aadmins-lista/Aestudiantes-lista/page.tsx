'use client';
import { useEffect, useState } from "react";
import './styles.css';
import '../login.css'
import Header from "../../components/header/header";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";


export default function EstudiantesLista() {
    const Router = useRouter();

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
        condicion_medica: string
    }
      
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
    const [estudiantesFiltrados, setEstudiantesFiltrados] = useState<Estudiante[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
    const [habilitarGuardado, setHabilitarGuardado] = useState<boolean>(true);
    const [nuevaFoto, setNuevaFoto] = useState<boolean>(false);

    const validarFormulario = (): boolean => {
        console.log("Validando Entradas de nuevo profesor")

        const { nombre, apellido, usuario, clave_acceso } = nuevoEstudiante;

        const camposValidos = [nombre, apellido, usuario, clave_acceso].every(
            (valor) => valor !== undefined && valor.trim() !== ''
        );

        console.log(camposValidos)

        return !camposValidos;
    }

    async function obtenerEstudiantes() : Promise<Estudiante[]>{
        const resultado= await fetch('http://localhost:5555/estudiantes',{
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

    const [estudianteEditando, setEstudianteEditando] = useState<Estudiante | null>(null);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nuevoEstudiante, setNuevoEstudiante] = useState<Estudiante>({
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
        condicion_medica: ""
    });

    const [descargandoImagen, setDescargandoImagen] = useState(false);
    const [imagenDescargadaUrl, setImagenDescargadaUrl] = useState<string | null>(null);


    const filtrarEstudiantes = () => {
        const results = estudiantes.filter(estudiantes =>
            (estudiantes.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (estudiantes.apellido?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (estudiantes.usuario?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
        setEstudiantesFiltrados(results);
    };
      

    const onEditar = async (estudiante: any) => {
        try {
            await descargarImagenPerfil(`User-${estudiante.id_estudiante}.png`)
            setEstudianteEditando({ ...estudiante});
        } catch (error) {
            console.log(error)
        }
        
    };

    
    const onGuardarEdicion = async () => {

        try {
            if (!estudianteEditando) return;
            
            Swal.fire({
                title: 'Procesando...',
                text: 'Por favor espera',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            console.log(estudianteEditando)

            const response = await fetch(`http://localhost:5555/estudiantes`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(estudianteEditando),
            });



            const resultadoConsulta = await response.json()
            console.log(resultadoConsulta)

            // Simulamos una función asíncrona (puedes reemplazar esto con tu fetch, por ejemplo)
            await new Promise(resolve => setTimeout(resolve, 1000)); // Espera de 1 segundos

            if(nuevaFoto && fotoPerfil){
                const formData = new FormData();
                let nuevoArchivo = null

                nuevoArchivo = new File([fotoPerfil], `User-${estudianteEditando.id_usuario.toString()}.png`, { type: fotoPerfil.type, lastModified: fotoPerfil.lastModified });
                
                formData.append('archivo', nuevoArchivo); // Agregar archivo solo si no es null
                formData.append('id_usuario', estudianteEditando.id_usuario.toString());

                try {
                    const response = await fetch('http://localhost:5555/cargar/archivo/imagen', {
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
                }
            }

            Swal.fire({
                title: '¡Operación exitosa!',
                text: 'La acción se completó correctamente.',
                icon: 'success'
            });

            const updatedList = estudiantes.map((estudiante:Estudiante) =>
                estudiante.id_estudiante === estudianteEditando.id_estudiante
                  ? { ...estudianteEditando }  // Solo cambiamos el atributo necesario
                  : estudiante
            );

            setEstudiantes(updatedList);
            setEstudiantesFiltrados(updatedList);
            setEstudianteEditando(null);
  
        } catch (error) {
            console.error("Error en la petición:", error);
        }
            
    };
    

    const onEliminar = async (id_estudiante: number) => {
    
        try {

            const confirmacion = confirm("¿Estás seguro de que quieres eliminar este estudiante?");
            if (!confirmacion) return;

            console.log("Eliminando")

            const response = await fetch(`http://localhost:5555/estudiantes`, {
                method: 'DELETE',
                mode: 'cors',   // Habilita CORS
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: id_estudiante}),
            });

            console.log(estudiantes)

            const resultadoConsulta = await response.json()
            console.log(resultadoConsulta)

            const arrayActualizado = estudiantes.filter(estudiante => estudiante.id_usuario !== id_estudiante)
            console.log(arrayActualizado)
            setEstudiantes(arrayActualizado);
            setEstudiantesFiltrados(arrayActualizado);

        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    const onAgregarEstudiante = async () => {

        try {

        const nuevo = { ...nuevoEstudiante };

        console.log(nuevo)
        
        Swal.fire({
            title: 'Procesando...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch(`http://localhost:5555/estudiantes`, {
            method: 'POST',
            mode: 'cors',   // Habilita CORS
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevo),
        });

        console.log(response)

        const resultadoConsulta = await response.json()
        console.log(resultadoConsulta)

        if(nuevo.foto){
            console.log("subiendo foto")
            const formData = new FormData();
            let nuevoArchivo = null
            
            setFotoPerfil(nuevoArchivo);
            
            if (fotoPerfil) {

                try {

                    console.log("Comenzando proceso de carga")

                    nuevoArchivo = new File([fotoPerfil], `User-${resultadoConsulta.id_usuario.toString()}.png`, { type: fotoPerfil.type, lastModified: fotoPerfil.lastModified });

                    formData.append('archivo', nuevoArchivo); // Agregar archivo solo si no es null
                    formData.append('id_usuario', resultadoConsulta.id_usuario.toString());

                    const response = await fetch('http://localhost:5555/cargar/archivo/imagen', {
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
                    }
                }
                        
        }

        if(response.status === 200){
            setEstudiantes([...estudiantes, nuevo]);
            setEstudiantesFiltrados([...estudiantesFiltrados, nuevo]);
            setMostrarFormulario(false); // Asegúrate de que el formulario se cierre después de guardar
            setNuevoEstudiante({
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
                condicion_medica: ""
            });

            // Si todo sale bien, cerramos el loading y mostramos éxito
            Swal.fire({
                title: '¡Operación exitosa!',
                text: 'La acción se completó correctamente.',
                icon: 'success'
            });
        }

        } catch (error) {

            Swal.fire({
                title: '¡Error!',
                text: 'Ocurrió un problema al procesar la acción.',
                icon: 'error'
            });
            
        }
        
        

        

        
    };
    
    // Este useEffect se ejecuta una sola vez al montar el componente
    useEffect(() => {
        const cargarEstudiantes = async () => {
            const respuesta = await obtenerEstudiantes();
            setEstudiantes(respuesta);
        };
        cargarEstudiantes();
        
    }, []);
    
    useEffect(() => {
        filtrarEstudiantes();
    }, [searchTerm, estudiantes]);

    useEffect(() => {
        setHabilitarGuardado(validarFormulario())
    }, [nuevoEstudiante]);

    const handleTitleClick = () => {
        window.location.reload();
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value); // Esto ya dispara useEffect que filtra
    };

    const handleSearchClick = () => {
        filtrarEstudiantes();
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.type === 'image/png') {
                setNuevoEstudiante({...nuevoEstudiante, foto: file.name})
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

    const mostrarFormularioAgregar = () => {
        console.log("Mostrar formulario para agregar")
        setMostrarFormulario(true);
        setEstudianteEditando(null); // Asegúrate de que no se muestre el formulario de edición al mismo tiempo
    };

    async function descargarImagenPerfil(nombreArchivo: string) {
        setDescargandoImagen(true);
        const urlDescarga = `/descargar/imagen/${nombreArchivo}`;
    
        try {
          const response = await fetch(`http://localhost:5555${urlDescarga}`);
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
          console.log('Imagen de perfil descargada y URL creada.');
    
        } catch (error) {
          console.error('Error al realizar la petición de descarga:', error);
          console.log(error)
          setDescargandoImagen(false);
        }
    }

    return (
        <>
            <Header
                text="MULTIPLAYER" onClick={() => Router.push("/videojuego")}
                text1="Panel de Juegos" onClick1={() => Router.push("/videojuego")}
                text2="Menu" onClick2={() => Router.push("/videojuego")}
                text3="Mi perfil" onClick3={() => Router.push("/videojuego")}
                text4="Salir" onClick4={() => Router.push("/videojuego")}>
            </Header>

            <div className="listado body_estudiantes">
                <div className="encabezado">
                    <div className="tituloListado" style={{ cursor: 'pointer' }}>
                        <h2 className="estudiantes" onClick={() => handleTitleClick()}>ESTUDIANTES</h2>
                        <button onClick={() => mostrarFormularioAgregar()}>Agregar Estudiante</button>
                    </div>
                    <div className="barraBusqueda">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Buscar estudiantes..."
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

                {mostrarFormulario && (
                    <div className="formulario-agregar">
                        <h3>Agregar Nuevo Estudiante</h3>
                        <input type="text" placeholder="Nombre" value={nuevoEstudiante.nombre} onChange={e => setNuevoEstudiante({ ...nuevoEstudiante, nombre: e.target.value })} />
                        <input type="text" placeholder="Apellido" value={nuevoEstudiante.apellido} onChange={e => setNuevoEstudiante({ ...nuevoEstudiante, apellido: e.target.value })} />
                        <input type="text" placeholder="Usuario" value={nuevoEstudiante.usuario} onChange={e => setNuevoEstudiante({ ...nuevoEstudiante, usuario: e.target.value })} />
                        <input type="text" placeholder="Clave" value={nuevoEstudiante.clave_acceso} onChange={e => setNuevoEstudiante({ ...nuevoEstudiante, clave_acceso: e.target.value })} />
                        <input type="text" placeholder="Telefono" value={nuevoEstudiante.telefono} onChange={e => setNuevoEstudiante({ ...nuevoEstudiante, telefono: e.target.value })} />
                        <input type="text" placeholder="Correo" value={nuevoEstudiante.correo} onChange={e => setNuevoEstudiante({ ...nuevoEstudiante, correo: e.target.value })} />
                        <input type="number" placeholder="Edad" value={nuevoEstudiante.edad} onChange={e => setNuevoEstudiante({ ...nuevoEstudiante, edad: (e.target.value) as unknown as number})} />
                        <input type="text" placeholder="Cedula" value={nuevoEstudiante.cedula} onChange={e => setNuevoEstudiante({ ...nuevoEstudiante, cedula: e.target.value })} />
                        <input
                            type="file"
                            accept=".png"
                            onChange={handleFotoChange}
                        />
                        <button onClick={() => onAgregarEstudiante() } disabled={habilitarGuardado}>Guardar</button>
                        <button onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                    </div>
                )}

                {!mostrarFormulario && !estudianteEditando && (
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
                            {estudiantesFiltrados.map((estudiante) => (
                                <tr key={estudiante.id_estudiante}>
                                    <td>{estudiante.nombre ? estudiante.nombre : "null"}</td>
                                    <td>{estudiante.apellido ? estudiante.apellido : "null"}</td>
                                    
                                    <td>{estudiante.usuario ? estudiante.usuario : "null"}</td>
                                    <td>{estudiante.clave_acceso ? estudiante.clave_acceso : "null"}</td>

                                    <td>{estudiante.correo ? estudiante.correo : "null"}</td>
                                    <td>{estudiante.telefono ? estudiante.telefono : "null"}</td>
                                    <td>
                                        <button onClick={()=>Router.push("/profile/" + estudiante.id_estudiante)}>Ver Perfil</button>
                                    </td>
                                    <td>
                                        <button onClick={() => onEditar(estudiante)}>Editar</button>
                                        <button onClick={() => onEliminar(estudiante.id_estudiante)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {estudianteEditando && (
                    <div className="formulario-edicion">
                        <h3>Editando estudiante</h3>
                        <input type="text" placeholder="Apellido" value={estudianteEditando.apellido || ''} onChange={e => setEstudianteEditando({ ...estudianteEditando, apellido: e.target.value })} />
                        <input type="text" placeholder="Usuario" value={estudianteEditando.usuario || ''} onChange={e => setEstudianteEditando({ ...estudianteEditando, usuario: e.target.value })} />
                        <input type="text" placeholder="Clave" value={estudianteEditando.clave_acceso || ''} onChange={e => setEstudianteEditando({ ...estudianteEditando, clave_acceso: e.target.value })} />
                        <input type="text" placeholder="Telefono" value={estudianteEditando.telefono || ''} onChange={e => setEstudianteEditando({ ...estudianteEditando, telefono: e.target.value })} />
                        <input type="text" placeholder="Correo" value={estudianteEditando.correo || ''} onChange={e => setEstudianteEditando({ ...estudianteEditando, correo: e.target.value })} />
                        <input type="number" placeholder="Edad" value={estudianteEditando.edad ?? ''} onChange={e => setEstudianteEditando({ ...estudianteEditando, edad: Number(e.target.value) })} />
                        <input type="text" placeholder="Cedula" value={estudianteEditando.cedula || ''} onChange={e => setEstudianteEditando({ ...estudianteEditando, cedula: e.target.value })} />
                        <input type="text" placeholder="Foto" value={estudianteEditando.foto || ''} onChange={e => setEstudianteEditando({ ...estudianteEditando, foto: e.target.value })} />
                        <input type="text" placeholder="Condicion" value={estudianteEditando.condicion_medica || ''} onChange={e => setEstudianteEditando({ ...estudianteEditando, condicion_medica: e.target.value })} />
                        {imagenDescargadaUrl && (
                            <div>
                                <img
                                    src={imagenDescargadaUrl}
                                    alt="Imagen de perfil"
                                    style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
                                />
                            </div>
                        )}
                        <label htmlFor="editarImagen">Editar imagen de perfil:</label>
                            <input
                                type="file"
                                id="editarImagen"
                                accept="image/png"
                                onChange={(e) => {
                                const archivo = e.target.files?.[0];
                                if (archivo) {
                                    const nuevaUrl = URL.createObjectURL(archivo);
                                    setNuevaFoto(true)
                                    setImagenDescargadaUrl(nuevaUrl);
                                    setFotoPerfil(archivo)
                                    // Aquí podrías subirla al servidor si deseas
                                }
                                
                                }}
                            />
                        <button onClick={() => onGuardarEdicion()}>Guardar</button>
                        <button onClick={() => setEstudianteEditando(null)}>Cancelar</button>
                    </div>
                )}
            </div>
        </>
    );
}