'use client';
import { useEffect, useState } from "react";
import './styles.css';
import Header from "../../components/header/header";
import { useRouter } from "next/navigation";


export default function AdministradoresLista() {

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const Router = useRouter();

    interface Administrador {
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
        id_admin: number,
        curriculum: string
    }
      
      const [administradores_, setAdministradores] = useState<Administrador[]>([]);
      const [administradoresFiltrados, setAdministradoresFiltrados] = useState<Administrador[]>([]);
      const [searchTerm, setSearchTerm] = useState('');
      const [mostrarClave, setMostrarClave] = useState(false);
      const [claveValidaEdit, setClaveValidaEdit] = useState(true);
      const [correoValidoEdit, setCorreoValidoEdit] = useState(true);
      const [telefonoValidoEdit, setTelefonoValidoEdit] = useState(true);
      const [cedulaValidaEdit, setCedulaValidaEdit] = useState(true);


    async function obtenerAdministradores() : Promise<Administrador[]>{
        const resultado= await fetch(`${baseUrl}/administradores`,{
                method: 'GET',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                }
        });
        const resultado_json = await resultado.json();
        console.log(resultado_json);
        return resultado_json;
    }

        // Este useEffect se ejecuta una sola vez al montar el componente
    useEffect(() => {
        const cargarAdministradores = async () => {
            const respuesta = await obtenerAdministradores();
            setAdministradores(respuesta);
        };
    
       cargarAdministradores();
    }, []);
    
    useEffect(() => {
        filtrarAdministradores();
    }, [searchTerm, administradores_]);
    

    const [administradorEditando, setAdministradorEditando] = useState<Administrador | null>(null);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nuevoAdministrador, setNuevoAdministrador] = useState<Administrador>({
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
        id_admin: 0,
        curriculum: ""
    });


    const filtrarAdministradores = () => {
        console.log(administradores_);
        
        const results = administradores_.filter(admin =>
            (admin.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (admin.apellido?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (admin.usuario?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
        
       setAdministradoresFiltrados(results);
    };
      

    const onEditar = (administrador: any) => {
        setAdministradorEditando({ ...administrador });
    };

    
    const onGuardarEdicion = async () => {
        try {
            if (!administradorEditando) return;
            console.log(administradorEditando)
            const response = await fetch(`${baseUrl}/administradores`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(administradorEditando),
            });

            const resultadoConsulta = await response.json()
            console.log(resultadoConsulta)

            const updatedList = administradores_.map((administrador: Administrador) =>
                administrador.id_admin === administradorEditando.id_admin
                  ? { ...administradorEditando }
                  : administrador
            );

            setAdministradores(updatedList);
            setAdministradoresFiltrados(updatedList);
            setAdministradorEditando(null);
  
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };
    

    const onEliminar = async (id_administrador: number) => {
        try {
            const confirmacion = confirm("¿Estás seguro de que quieres eliminar este administrador?");
            if (!confirmacion) return;

            console.log("Eliminando");

            const response = await fetch(`${baseUrl}/administradores`, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id_administrador }),
            });

            const resultadoConsulta = await response.json()
            console.log(resultadoConsulta)

            const arrayActualizado = administradores_.filter(administrador => administrador.id_usuario !== id_administrador)
            setAdministradores(arrayActualizado);
            setAdministradoresFiltrados(arrayActualizado);

        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    

    const onAgregarAdministrador = async () => {
        const nuevo = { ...nuevoAdministrador };
        
        const response = await fetch(`${baseUrl}/administradores`, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nuevo.nombre,
                apellido: nuevo.apellido,
                usuario: nuevo.usuario,
                clave_acceso: nuevo.clave_acceso
            }),
        });

        const resultadoConsulta = await response.json()
        console.log(resultadoConsulta)

        if (response.status === 200) {
            setAdministradores([...administradores_, nuevo]);
            setAdministradoresFiltrados([...administradoresFiltrados, nuevo]);
            setMostrarFormulario(false);
            setNuevoAdministrador({
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
                id_admin: 0,
                curriculum: ""
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
        filtrarAdministradores();
    };

    const mostrarFormularioAgregar = () => {
        console.log("Mostrar formulario para agregar")
        setMostrarFormulario(true);
        setAdministradorEditando(null); // Asegúrate de que no se muestre el formulario de edición al mismo tiempo
    };

    return (
        <>
            <Header
                            text="MULTIPLAYER" onClick={() => Router.push("/Amenu")}
                            text1="Panel de Juegos" onClick1={() => Router.push("/videojuego")}
                            text2="Menu" onClick2={() => Router.push("/Amenu")}
                            text3="" onClick3={() => Router.push("")}
                            text4="Salir" onClick4={() => Router.push("/")}>
                        </Header>

            <div className="listado">
                <div className="encabezado">
                    <div className="tituloListado" style={{ cursor: 'pointer' }}>
                        <h2 className="administradores" onClick={() => handleTitleClick()}>ADMINISTRADORES</h2>
                    </div>
                </div>

            {mostrarFormulario && (
                <div className="formulario-agregar">
                    <h3>Agregar Nuevo Administrador</h3>
                    <input type="text" placeholder="Nombre" value={nuevoAdministrador.nombre} onChange={e => setNuevoAdministrador({ ...nuevoAdministrador, nombre: e.target.value })} />
                    <input type="text" placeholder="Apellido" value={nuevoAdministrador.apellido} onChange={e => setNuevoAdministrador({ ...nuevoAdministrador, apellido: e.target.value })} />
                    <input type="text" placeholder="Usuario" value={nuevoAdministrador.usuario} onChange={e => setNuevoAdministrador({ ...nuevoAdministrador, usuario: e.target.value })} />
                    <input type="text" placeholder="Clave" value={nuevoAdministrador.clave_acceso} onChange={e => setNuevoAdministrador({ ...nuevoAdministrador, clave_acceso: e.target.value })} />
                    <input type="text" placeholder="Telefono" value={nuevoAdministrador.telefono} onChange={e => setNuevoAdministrador({ ...nuevoAdministrador, telefono: e.target.value })} />
                    <input type="text" placeholder="Correo" value={nuevoAdministrador.correo} onChange={e => setNuevoAdministrador({ ...nuevoAdministrador, correo: e.target.value })} />
                    <input type="number" placeholder="Edad" value={nuevoAdministrador.edad} onChange={e => setNuevoAdministrador({ ...nuevoAdministrador, edad: (e.target.value) as unknown as number})} />
                    <input type="text" placeholder="Cedula" value={nuevoAdministrador.cedula} onChange={e => setNuevoAdministrador({ ...nuevoAdministrador, cedula: e.target.value })} />
                    <input type="text" placeholder="Foto" value={nuevoAdministrador.foto} onChange={e => setNuevoAdministrador({ ...nuevoAdministrador, foto: e.target.value })} />
                    <button onClick={() => onAgregarAdministrador()}>Guardar</button>
                    <button onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                </div>
            )}

            {!mostrarFormulario && !administradorEditando && (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Usuario</th>
                            <th>Clave</th>
                            <th>Correo</th>
                            <th>Celular</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {administradoresFiltrados.map((administrador) => (
                            <tr key={administrador.id_admin}>
                                <td>{administrador.nombre ? administrador.nombre : "null"}</td>
                                <td>{administrador.apellido ? administrador.apellido : "null"}</td>
                                
                                <td>{administrador.usuario ? administrador.usuario : "null"}</td>
                                <td>{administrador.clave_acceso ? administrador.clave_acceso : "null"}</td>

                                <td>{administrador.correo ? administrador.correo : "null"}</td>
                                <td>{administrador.telefono ? administrador.telefono : "null"}</td>
                                <td>
                                    <button onClick={() => onEditar(administrador)}>Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {administradorEditando && (
            <div className="formulario-agregar">
                <h3>Editando administrador</h3>

                <div className="campo-form">
                <label>Nombre</label>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={administradorEditando.nombre || ''}
                    onChange={e => setAdministradorEditando({ ...administradorEditando, nombre: e.target.value })}
                />
                </div>

                <div className="campo-form">
                <label>Apellido</label>
                <input
                    type="text"
                    placeholder="Apellido"
                    value={administradorEditando.apellido || ''}
                    onChange={e => setAdministradorEditando({ ...administradorEditando, apellido: e.target.value })}
                />
                </div>

                <div className="campo-form">
                <label>Usuario</label>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={administradorEditando.usuario || ''}
                    onChange={e => setAdministradorEditando({ ...administradorEditando, usuario: e.target.value })}
                />
                </div>

                <div className="campo-form">
                <label>Clave</label>
                <div style={{ position: 'relative', width: '100%' }}>
                    <input
                    type={mostrarClave ? 'text' : 'password'}
                    placeholder="Clave"
                    value={administradorEditando.clave_acceso || ''}
                    onChange={e => {
                        const value = e.target.value;
                        setAdministradorEditando({ ...administradorEditando, clave_acceso: value });
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
                    value={administradorEditando.telefono || ''}
                    onChange={e => {
                    const value = e.target.value;
                    const regex = /^[0-9()+\-\s]*$/;
                    if (regex.test(value)) {
                        setAdministradorEditando({ ...administradorEditando, telefono: value });
                        setTelefonoValidoEdit(true);
                    } else {
                        setTelefonoValidoEdit(false);
                    }
                    }}
                />
                {!telefonoValidoEdit && (
                    <p className="mensaje-error-clave">
                    Teléfono inválido. Use solo números o símbolos como + - ( )
                    </p>
                )}
                </div>

                <div className="campo-form">
                <label>Correo</label>
                <input
                    type="text"
                    placeholder="Correo"
                    value={administradorEditando.correo || ''}
                    onChange={e => {
                    const value = e.target.value;
                    setAdministradorEditando({ ...administradorEditando, correo: value });
                    setCorreoValidoEdit(value.includes('@'));
                    }}
                />
                {!correoValidoEdit && (
                    <p className="mensaje-error-clave">Ingrese una dirección de correo válida</p>
                )}
                </div>

               
               
                <div className="botones">
                <button onClick={() => onGuardarEdicion()}>Guardar</button>
                <button onClick={() => setAdministradorEditando(null)}>Cancelar</button>
                </div>
            </div>
            )}

            </div>
        </>
    );
}