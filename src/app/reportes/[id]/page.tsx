'use client';
import { useEffect, useState } from "react";
import Header from "../../../components/header-white/header";
import { useParams, useRouter } from "next/navigation";
import DonutChart from "../../../components/donutChart/donutChart";
import PieChart from "../../../components/pieChart/pieChart";
import Notita from "../../../components/nota/notita";
import Parametros from "../../../components/parametros/parametros";
import Estrellas from "../../../components/estrellas/estrellas";
import NombreEs from "../../../components/nombreEs/nombreEs";

import './styles.css'
import obtenerGrupoAlumno from "../functions/obtenerGrupoAlumno";
import obtenerProfesorAlumno from "../functions/obtenerProfesorAlumno";
import obtenerCursoAlumno from "../functions/obtenerCursoAlumno";
import Curso from "../interfaces/curso.interface";

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
  reconocimiento_patrones: string, 
  abstraccion: string,
  asociacion: string,
  identificacion_errores: string,
  construccion_algoritmos: string,
  p_actividades_completadas: number,
  tipo_premiacion: string,
  id_grupo: number,
  rol: string
}

interface Consulta_Horario {
  apellido: string;
  dia_semana: string;
  hora_fin: string;
  hora_inicio: string;
  id_curso: number;
  id_grupo: number;
  id_horario: number;
  id_profesor: number;
  nombre: string;
  nombre_curso: string;
  nombre_grupo: string;
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

export default function Reportes( ) {
    const Router = useRouter();
    const params = useParams(); // Usa el hook useParams para acceder a los params
    const profileId = params.id
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
          reconocimiento_patrones: "",
          abstraccion: "",
          asociacion: "",
          identificacion_errores: "",
          construccion_algoritmos: "",
          p_actividades_completadas: 0,
          tipo_premiacion: "",
          id_grupo: 0,
          rol: ""
        }
    );

    const [horarios, setHorarios] = useState<Consulta_Horario[]>([])
    const [profesor, setProfesor] = useState<Profesor>(
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
    const [curso, setCurso] = useState<Curso>({
        id_curso: 0,
        nombre_curso: ""
    })

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
        setUsuario(resultadoConsulta)

        if(resultadoConsulta.id_grupo){

            console.log("TIENE GRUPO")
            const resultadoGrupo = await obtenerGrupoAlumno(resultadoConsulta.id_grupo)

            console.log(resultadoGrupo)

            const resultadoCurso = await obtenerCursoAlumno(resultadoConsulta.id_grupo)
            console.log(resultadoCurso)

            setCurso(resultadoCurso)

            const resultadoProfesor = await obtenerProfesorAlumno(resultadoGrupo.id_profesor_grupo)
            if (resultadoProfesor) {
                setProfesor(resultadoProfesor); // solo aquí
                console.log(resultadoProfesor)
            }

        }
    };


  useEffect(() => {
    obtenerDatosUsuario()
  }, []);

  function evaluarPremios(cadena:string) {
    const premios = cadena ? cadena.split(',') : [];
    const cantidad = premios.length;

    return [
        cantidad >= 1,
        cantidad >= 2,
        cantidad >= 3
    ];
    }


    console.log("ID de la ruta dinámica:", profileId);
  return (

        <div className="contenedor_pagina">
            <div className="dimensiones_header">
                <Header
                                text="MULTIPLAYER" onClick={() => Router.push("/Amenu")}
                                text1="Panel de Juegos" onClick1={() => Router.push("/videojuego")}
                                text2="Menu" onClick2={() => Router.push("/Amenu")}
                                text3="" onClick3={() => ("")}
                                text4="Salir" onClick4={() => Router.push("/")}>
                </Header>
            </div>
            
            <div className="contenedor_reporte">
                <div>
                    <h1 className="tituloInforme">Informe de avance del estudiante</h1>
                    <NombreEs Nombre={usuario.nombre} Apellido={usuario.apellido}></NombreEs>
                </div>
                <div className="contenedor_informacion">
                    <div className=" contenedor_premiaciones_y_actividades altura_maxima">
                        <div className="contenedor_premiaciones">
                            <div>
                                <p className="tituloReporte">PREMIACIONES</p>
                                <p className="sangria_20">Estrellas {(usuario.tipo_premiacion) ? usuario.tipo_premiacion.split(',').length : 0} / 3</p>
                            </div>
                            <div>
                                <Estrellas valores={evaluarPremios(usuario.tipo_premiacion)} />
                            </div>
                        </div>
                        <div className="contenedor_actividades_completadas">
                            <div className="tortaGraph">
                                    <p className="tituloReporte">PORCENTAJE DE ACTIVIDADES COMPLETADAS</p>
                                    <div className="leyenda">
                                            <div className="leyenda-item">
                                            <span className="color-box completado"></span>
                                            <span>Completado</span>
                                            </div>
                                            <div className="leyenda-item">
                                            <span className="color-box no-completado"></span>
                                            <span>No completado</span>
                                            </div>
                                        </div>
                            </div>
                            <PieChart value1={usuario.p_actividades_completadas} value2={100 - usuario.p_actividades_completadas} />
                        </div>
                    </div>
                    <div className="contenedor_estadisticas">
                        <div className="contenedor_eficiencia">
                            <div className="contenedor_eficiencia_diagrama">
                                <div className="pieGraph">
                                    <p className="tituloReporte">EFICIENCIA ALGORÍTMICA</p>
                                    <DonutChart percentage1={usuario.eficiencia_algoritmica} percentage2={100 - usuario.eficiencia_algoritmica} />
                                        
                                </div>
                            </div>
                            <div className="contenedor_eficiencia_errores">
                                <div className="contenedor_identificacion_errores">
                                    <Parametros parametroTitulo1="IDENTIFICACIÓN DE ERRORES" parametroTitulo2={(usuario.identificacion_errores) ? usuario.identificacion_errores : ""} />
                                </div>
                                <div className="contenedor_reconocimiento_patrones">
                                    <Parametros parametroTitulo1="RECONOCIMIENTO DE PATRONES" parametroTitulo2={(usuario.reconocimiento_patrones) ? usuario.reconocimiento_patrones : ""} />
                                </div>

                            </div>
                        </div>
                        <div className="contenedor_abstraccion">
                            <div className="contenedor_abstraccion_abstraccion">
                                <Parametros parametroTitulo1="ABSTRACCIÓN" parametroTitulo2={(usuario.abstraccion) ? usuario.abstraccion : ""} />
                            </div>
                            <div className="contenedor_abstraccion_asociacion">
                                <Parametros parametroTitulo1="ASOCIACIÓN" parametroTitulo2={(usuario.asociacion) ? usuario.asociacion : ""} />
                            </div>
                        </div>
                        <div className="contenedor_construccion">
                            <div className="contenedor_construccion_construccion">
                                <Parametros parametroTitulo1="CONSTRUCCIÓN DE ALGORITMOS" parametroTitulo2={(usuario.construccion_algoritmos) ? usuario.construccion_algoritmos : ""} />
                            </div>
                            <div className="contenedor_construccion_profesor">
                                <Notita NotitaTitulo1={(profesor.id_profesor !== 0) ? profesor.nombre + " " + profesor.apellido : "No tiene profesor asignado" } NotitaTitulo2={(curso.id_curso !== 0) ?  curso.nombre_curso : "No está en un curso"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

  );
}