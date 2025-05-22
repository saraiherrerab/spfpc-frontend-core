"use client";

import {GameObj, KAPLAYCtx} from "kaplay";
import generarEsquemaMapa from "../../MapsGenerator";
import generarNumerosAleatorios from './functions/generarNumerosAleatorios'
import Evaluacion_Estudiante from "./interfaces/informacion_estudiante.interface";
import cargarEvaluacionEstudiante from "./functions/cargarEvaluacionEstudiante";
import sleep from "./functions/sleep";
import cargarNivelUsuario from "./functions/cargarNivelUsuario";
import obtenerNivelesUsuario from "./functions/obtenerNivelesUsuario";
import modificarNivelUsuario from "./functions/modificarNivelUsuario";

let SCREEN_RESOLUTION_X = 0;
let SCREEN_RESOLUTION_Y = 0;

const TILED_MAP__WIDTH_NUMBER: number = 21
const TILED_MAP_HEIGHT_NUMBER: number = 16
const TILED_WIDTH: number = SCREEN_RESOLUTION_X / TILED_MAP__WIDTH_NUMBER
const TILED_HEIGHT: number = SCREEN_RESOLUTION_Y / TILED_MAP_HEIGHT_NUMBER

export let cambioNivel = 0;




export async function Nivel5(juegoKaplay:KAPLAYCtx<{},never>, setState5:any, cambiarGanar5:any,setStateA:any, cambiarGanarA:any,setStateC:any, cambiarGanarC:any, Router:any,usuario: any,jugoNiveles:boolean) {
    // Referencia persistente para almacenar la instancia de Kaplay
   // setState(false);

       let existeNivelCinco = false
       if(jugoNiveles){
         const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
         console.log(nivelesUsuario)
         existeNivelCinco = nivelesUsuario.some( (nivel: any) => nivel.id_nivel === 5);
       }else{
         console.log("NO HA JUGADO - PRIMERA VEZ")
       }

   /* EJERCICIO DE ARBOLES  */
    juegoKaplay.loadSprite("arbol", "sprites/a-arbol/arbolicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("ardilla", "sprites/a-arbol/ardillaicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("manzana", "sprites/a-arbol/manzanaicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("palito", "sprites/a-arbol/palitoicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });

    /* EJERCICIO DE PARAGUAS */

    juegoKaplay.loadSprite("paraguas", "sprites/a-paraguas/paraguasicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("arco", "sprites/a-paraguas/arcoicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });  
    juegoKaplay.loadSprite("gota", "sprites/a-paraguas/gotaicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("nube", "sprites/a-paraguas/nubeicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });

    /* ACTIVIDAD DE LA PIZZA */

    juegoKaplay.loadSprite("pizza", "sprites/a-pizza/pizzaicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("espatula", "sprites/a-pizza/espatulaicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("hamburguesa", "sprites/a-pizza/hamburguesaicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("rebanada", "sprites/a-pizza/rebanadaicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });

    /* ACTIVIDAD DEL PLANETA */

    juegoKaplay.loadSprite("satelite", "sprites/a-planeta/sateliteicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("miniplaneta", "sprites/a-planeta/planetachiquiicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("planeta", "sprites/a-planeta/planetaicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("sol", "sprites/a-planeta/solicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });

    /* ACTIVIDAD DEL SEMAFORO */

    juegoKaplay.loadSprite("semaforo", "sprites/a-semaforo/semaforoicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("carro", "sprites/a-semaforo/carroicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("cruce", "sprites/a-semaforo/cruceicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });
    juegoKaplay.loadSprite("luces", "sprites/a-semaforo/lucesicon.jpg", {
      sliceX: 1,
      sliceY: 1,
    });

    juegoKaplay.loadSound("nivel5", "./oveja-dialogos/nivel5.wav");
    juegoKaplay.loadSound("aprobado", "./oveja-dialogos/aprobado.wav");
    juegoKaplay.loadSound("perdido", "./oveja-dialogos/perdido.wav");
    juegoKaplay.loadSound("fallaste", "./oveja-dialogos/fallaste.wav");
    juegoKaplay.loadSound("bien", "./oveja-dialogos/bien.wav");


    /* EN CASO DE CUADRO VACIOS  */

    juegoKaplay.loadSprite("title-0", "prueba/title-0.png", {
      sliceX: 1,
      sliceY: 1,
    });

    const arregloActividades = [
      {
        respuesta: "palito",
        imagenes: ["arbol","ardilla","manzana","palito"]
      },
      {
        respuesta: "arco",
        imagenes: ["paraguas","arco","gota","nube"],
      },
      {
        respuesta: "rebanada",
        imagenes: ["pizza","espatula","hamburguesa","rebanada"],
      },
      {
        respuesta: "miniplaneta",
        imagenes: ["planeta","miniplaneta","satelite","sol"],
      },
      {
        respuesta: "luces",
        imagenes: ["semaforo","carro","cruce","luces"]
      }
    ]

    let vidas = 3;
    let aciertos = 0;

    juegoKaplay.onLoad(async () => {

      //Practicando aqui
      SCREEN_RESOLUTION_X = window.innerWidth 
      SCREEN_RESOLUTION_Y = window.innerHeight 

      const nivelPrincipal = generarEsquemaMapa(
        juegoKaplay,
        {
          nameFolder: "nivel5",
          nameFile: "fondo.png",
          tileWidth: TILED_WIDTH,
          tileHeight: TILED_HEIGHT,
          pos: juegoKaplay.vec2(0, 0),
        },
        `./nivel5/prueba.json`,   //archivo de donde voy a extraer el mapa
        
        [ //Aca lo importante es que debo introducir el orden de las texturas en el que va, capa por capa
          {
            urlTextura: "./nivel5/Water.png",  
            dimensionTexturasX: 2, //Dimensiones de tiled
            dimensionTexturasY: 2,
            firstgid: 1 //orden en el que tiled extrae esas imagenes (esta llega a cuatro)
          }
        ]
      )
      .then(  
        async (resultado: any) => {
          juegoKaplay.play("nivel5", { volume: 1, speed: 1, loop: false });
          cambiarGanar5(true);
          setState5(true);
          await sleep(2000)


          let opcionEscogida = generarNumerosAleatorios(1,3)

          console.log("Número Aleatorio Generado: ", opcionEscogida);

          const imagen_central = juegoKaplay.get("imagen_grande")[0]
        
          const imagen1 = juegoKaplay.get("imagen1")[0]
          const imagen2 = juegoKaplay.get("imagen2")[0]
          const imagen3 = juegoKaplay.get("imagen3")[0]

          console.log(imagen_central)

          /* Cargamos las imagenes de la primera actividad */

          const arregloAuxiliarActividades = [...arregloActividades]

          let indiceActividad: number = generarNumerosAleatorios(0,vidas + 1)

          let actividadGeneradaAzar = arregloAuxiliarActividades[indiceActividad]

          imagen_central.sprite = actividadGeneradaAzar.imagenes[0]
          imagen1.sprite = actividadGeneradaAzar.imagenes[1]
          imagen2.sprite = actividadGeneradaAzar.imagenes[2]
          imagen3.sprite = actividadGeneradaAzar.imagenes[3]

          imagen1.onClick(
            async () => {

              console.log("PRESIONANDO OPCIÓN 1")

              if(aciertos < 3 && arregloAuxiliarActividades[indiceActividad].imagenes.indexOf(arregloAuxiliarActividades[indiceActividad].respuesta) === 1){
                console.log("SUMANDO")
                aciertos++
                juegoKaplay.play("bien", { volume: 1, speed: 1, loop: false });
                await sleep(2000)
              }else{
                  vidas--
                  juegoKaplay.play("fallaste", { volume: 1, speed: 1, loop: false });
                  await sleep(2000)
                
                if(vidas <= 0){

                  if(existeNivelCinco){
                    const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                    
                    const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 5 && nivel.estatus === "APROBADO");
    
                    const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,5,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                    console.log(modificarResultado)
                  }else{
                    const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,5,"NO APROBADO")
                    console.log(cargarResultado)
                  }

                  
                  console.log("MORISTE")
                  cambiarGanarC(true);
                  setStateC(true);
                  juegoKaplay.play("perdido", { volume: 1, speed: 1.5, loop: false });
                  await sleep(2000)
                  window.location.href = window.location.href
                }else{
                  
                }
              }

              if( aciertos === 3 ){

                cambiarGanarA(true);
                juegoKaplay.play("aprobado", { volume: 1, speed: 1.5, loop: false });
                setStateA(true);
                await sleep(2000)

                if(usuario.rol === "ESTUDIANTE"){

                  console.log("GANASTE")
                                                  
                  const obtenerDatosUsuario = async (estudiante_seleccionado: number) => {
      
                    const datosEstudiante = await fetch("http://localhost:5555/estudiantes/" + estudiante_seleccionado)
                    const resultadoConsulta = await datosEstudiante.json()
                    console.log(resultadoConsulta)
  
                    return resultadoConsulta
  
                  };
                              
                  const datosEstudiante = await obtenerDatosUsuario(usuario.id_usuario)
                
                  console.log(datosEstudiante)

                  const nivelesJugados = await obtenerNivelesUsuario(usuario.id_usuario);
                  console.log(nivelesJugados)
  
                  const ganoNivelCuatro = nivelesJugados.some( (nivel: any) => nivel.id_nivel === 5 && nivel.estatus === "APROBADO");
  
                  console.log(ganoNivelCuatro)
  
                  const porcentajeAumentado =
                  // Si el estudiante ya aprobó, se mantiene el porcentaje.
                  ganoNivelCuatro
                  ? datosEstudiante.p_actividades_completadas
                  // Si está en proceso o no ha jugado, se suma un 20%.
                  : datosEstudiante.p_actividades_completadas + 20;
  
                  console.log(datosEstudiante)
  
                  console.log(porcentajeAumentado)

                  const ganoIdenticacionErrores: string = 
                  (datosEstudiante.identificacion_errores !== "APROBADO" && datosEstudiante.construccion_algoritmos == "APROBADO" && datosEstudiante.reconocimiento_patrones == "APROBADO")
                  ? "APROBADO" 
                  :
                  ((datosEstudiante.identificacion_errores == "APROBADO") ? "APROBADO": "EN PROCESO");
                
                  const datosUsuario: Evaluacion_Estudiante = {
                    id_estudiante: datosEstudiante.id_usuario,
                    eficiencia_algoritmica: datosEstudiante.eficiencia_algoritmica,
                    reconocimiento_patrones: datosEstudiante.reconocimiento_patrones,
                    identificacion_errores: ganoIdenticacionErrores,
                    abstraccion: "APROBADO",
                    asociacion: datosEstudiante.asociacion,
                    construccion_algoritmos: datosEstudiante.construccion_algoritmos,
                    p_actividades_completadas:  porcentajeAumentado,
                    tipo_premiacion: (datosEstudiante.tipo_premiacion.length > 0) ? datosEstudiante.tipo_premiacion + ", " + "Crítico del Arte Abstracto" : "Crítico del Arte Abstracto"
                  }
                              
                  const respuestaEvaluacion = await cargarEvaluacionEstudiante(datosUsuario)
                  console.log(respuestaEvaluacion)

                  await sleep(3000)

                  window.location.href = window.location.href
                                                                
                }else{
                  console.log("GANO PERO NO ES ESTUDIANTE")
                }

                if(existeNivelCinco){
                    const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                    
                    const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 5 && nivel.estatus === "APROBADO");

                    const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,5,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                    console.log(modificarResultado)
                  }else{
                    const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,5,"APROBADO")
                    console.log(cargarResultado)
                  }
              }

              arregloAuxiliarActividades.splice(indiceActividad, 1);
              console.log("ELIMINADO OPCION DE ARREGLO")
              console.log(arregloAuxiliarActividades)
              indiceActividad = (arregloAuxiliarActividades.length === 1) ? 0 :  generarNumerosAleatorios(0,vidas-1 )
              console.log("EL INDICE DE LA ACTIVIDAD ES:", indiceActividad)
              actividadGeneradaAzar = (arregloAuxiliarActividades.length > 0) ? arregloAuxiliarActividades[indiceActividad] : arregloActividades[0]
              console.log(actividadGeneradaAzar)
              if (actividadGeneradaAzar) {
                opcionEscogida = actividadGeneradaAzar.imagenes.indexOf(actividadGeneradaAzar.respuesta);
                imagen_central.sprite = actividadGeneradaAzar.imagenes[0];
                imagen1.sprite = actividadGeneradaAzar.imagenes[1];
                imagen2.sprite = actividadGeneradaAzar.imagenes[2];
                imagen3.sprite = actividadGeneradaAzar.imagenes[3];
              } else {
                console.warn("No hay más actividades disponibles. No se puede continuar.");
              }



            }
          )

          imagen2.onClick(
            async () => {
              
              console.log("PRESIONANDO OPCIÓN 2")

              if(aciertos < 3 && arregloAuxiliarActividades[indiceActividad].imagenes.indexOf(arregloAuxiliarActividades[indiceActividad].respuesta) === 2){
                console.log("SUMANDO")
                aciertos++
                juegoKaplay.play("bien", { volume: 1, speed: 1, loop: false });
                await sleep(2000)
              }else{
                  vidas--
                  juegoKaplay.play("fallaste", { volume: 1, speed: 1, loop: false });
                  await sleep(2000)
                
                if(vidas <= 0){
                  cambiarGanarC(true);
                  setStateC(true);
                  juegoKaplay.play("perdido", { volume: 1, speed: 1.5, loop: false });
                  console.log("MORISTE")

                  if(existeNivelCinco){
                    const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                    
                    const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 5 && nivel.estatus === "APROBADO");
    
                    const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,5,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                    console.log(modificarResultado)
                  }else{
                    const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,5,"NO APROBADO")
                    console.log(cargarResultado)
                  }

                  await sleep(2000)
                  window.location.href = window.location.href
                }
              }

              if( aciertos === 3 ){
                 cambiarGanarA(true);
                juegoKaplay.play("aprobado", { volume: 1, speed: 1.5, loop: false });
                setStateA(true);
                await sleep(2000)
                if(usuario.rol === "ESTUDIANTE"){

                  console.log("GANASTE")
                                                  
                  const obtenerDatosUsuario = async (estudiante_seleccionado: number) => {
      
                    const datosEstudiante = await fetch("http://localhost:5555/estudiantes/" + estudiante_seleccionado)
                    const resultadoConsulta = await datosEstudiante.json()
                    console.log(resultadoConsulta)
  
                    return resultadoConsulta
  
                  };
                              
                  const datosEstudiante = await obtenerDatosUsuario(usuario.id_usuario)
                
                  console.log(datosEstudiante)

                  const nivelesJugados = await obtenerNivelesUsuario(usuario.id_usuario);
                  console.log(nivelesJugados)
  
                  const ganoNivelCuatro = nivelesJugados.some( (nivel: any) => nivel.id_nivel === 5 && nivel.estatus === "APROBADO");
  
                  console.log(ganoNivelCuatro)
  
                  const porcentajeAumentado =
                  // Si el estudiante ya aprobó, se mantiene el porcentaje.
                  ganoNivelCuatro
                  ? datosEstudiante.p_actividades_completadas
                  // Si está en proceso o no ha jugado, se suma un 20%.
                  : datosEstudiante.p_actividades_completadas + 20;
  
                  console.log(datosEstudiante)
  
                  console.log(porcentajeAumentado)

                  const ganoIdenticacionErrores: string = 
                  (datosEstudiante.identificacion_errores !== "APROBADO" && datosEstudiante.construccion_algoritmos == "APROBADO" && datosEstudiante.reconocimiento_patrones == "APROBADO")
                  ? "APROBADO" 
                  :
                  ((datosEstudiante.identificacion_errores == "APROBADO") ? "APROBADO": "EN PROCESO");
                
                  const datosUsuario: Evaluacion_Estudiante = {
                    id_estudiante: datosEstudiante.id_usuario,
                    eficiencia_algoritmica: datosEstudiante.eficiencia_algoritmica,
                    reconocimiento_patrones: datosEstudiante.reconocimiento_patrones,
                    identificacion_errores: ganoIdenticacionErrores,
                    abstraccion: "APROBADO",
                    asociacion: datosEstudiante.asociacion,
                    construccion_algoritmos: datosEstudiante.construccion_algoritmos,
                    p_actividades_completadas:  porcentajeAumentado,
                    tipo_premiacion: (datosEstudiante.tipo_premiacion.length > 0) ? datosEstudiante.tipo_premiacion + ", " + "Crítico del Arte Abstracto" : "Crítico del Arte Abstracto"
                  }
                              
                  const respuestaEvaluacion = await cargarEvaluacionEstudiante(datosUsuario)
                  console.log(respuestaEvaluacion)

                  await sleep(3000)

                  window.location.href = window.location.href
                                                                
                }else{
                  console.log("GANO PERO NO ES ESTUDIANTE")
                }

                if(existeNivelCinco){
                  const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                  
                  const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 5 && nivel.estatus === "APROBADO");
  
                  const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,5,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                  console.log(modificarResultado)
                }else{
                  const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,5,"APROBADO")
                  console.log(cargarResultado)
                }

                 window.location.href = window.location.href
              }

              

              arregloAuxiliarActividades.splice(indiceActividad, 1);
              console.log("ELIMINADO OPCION DE ARREGLO")
              console.log(arregloAuxiliarActividades)
              indiceActividad = (arregloAuxiliarActividades.length === 1) ? 0 :  generarNumerosAleatorios(0,vidas -1)
              console.log("EL INDICE DE LA ACTIVIDAD ES:", indiceActividad)
              actividadGeneradaAzar = (arregloAuxiliarActividades.length > 0) ? arregloAuxiliarActividades[indiceActividad] : arregloActividades[0]
              if (actividadGeneradaAzar) {
                opcionEscogida = actividadGeneradaAzar.imagenes.indexOf(actividadGeneradaAzar.respuesta);
                imagen_central.sprite = actividadGeneradaAzar.imagenes[0];
                imagen1.sprite = actividadGeneradaAzar.imagenes[1];
                imagen2.sprite = actividadGeneradaAzar.imagenes[2];
                imagen3.sprite = actividadGeneradaAzar.imagenes[3];
              } else {
                console.warn("No hay más actividades disponibles. No se puede continuar.");
              }

            }
          )

          imagen3.onClick(
            async () => {

              console.log("PRESIONANDO OPCIÓN 3")

              if( aciertos < 3 && arregloAuxiliarActividades[indiceActividad].imagenes.indexOf(arregloAuxiliarActividades[indiceActividad].respuesta) === 3){
                console.log("SUMANDO")
                aciertos++
                juegoKaplay.play("bien", { volume: 1, speed: 1, loop: false });
                await sleep(2000)
              }else{
                  vidas--
                  juegoKaplay.play("fallaste", { volume: 1, speed: 1, loop: false });
                  await sleep(2000)
                if(vidas <= 0){
                  cambiarGanarC(true);
                  setStateC(true);
                  juegoKaplay.play("perdido", { volume: 1, speed: 1, loop: false });
                  console.log("MORISTE")
                  await sleep(2000)
                  window.location.href = window.location.href
                }
              }

              if( aciertos === 3 ){
                 cambiarGanarA(true);
                juegoKaplay.play("aprobado", { volume: 1, speed: 1.5, loop: false });
                setStateA(true);
                await sleep(2000)
                if(usuario.rol === "ESTUDIANTE"){

                  console.log("GANASTE")
                                                  
                  const obtenerDatosUsuario = async (estudiante_seleccionado: number) => {
      
                    const datosEstudiante = await fetch("http://localhost:5555/estudiantes/" + estudiante_seleccionado)
                    const resultadoConsulta = await datosEstudiante.json()
                    console.log(resultadoConsulta)
  
                    return resultadoConsulta
  
                  };
                              
                  const datosEstudiante = await obtenerDatosUsuario(usuario.id_usuario)
                
                  console.log(datosEstudiante)

                  const nivelesJugados = await obtenerNivelesUsuario(usuario.id_usuario);
                  console.log(nivelesJugados)
  
                  const ganoNivelCuatro = nivelesJugados.some( (nivel: any) => nivel.id_nivel === 5 && nivel.estatus === "APROBADO");
  
                  console.log(ganoNivelCuatro)
  
                  const porcentajeAumentado =
                  // Si el estudiante ya aprobó, se mantiene el porcentaje.
                  ganoNivelCuatro
                  ? datosEstudiante.p_actividades_completadas
                  // Si está en proceso o no ha jugado, se suma un 20%.
                  : datosEstudiante.p_actividades_completadas + 20;
  
                  console.log(datosEstudiante)
  
                  console.log(porcentajeAumentado)

                  const ganoIdenticacionErrores: string = 
                  (datosEstudiante.identificacion_errores !== "APROBADO" && datosEstudiante.construccion_algoritmos == "APROBADO" && datosEstudiante.reconocimiento_patrones == "APROBADO")
                  ? "APROBADO" 
                  :
                  ((datosEstudiante.identificacion_errores == "APROBADO") ? "APROBADO": "EN PROCESO");
                
                  const datosUsuario: Evaluacion_Estudiante = {
                    id_estudiante: datosEstudiante.id_usuario,
                    eficiencia_algoritmica: datosEstudiante.eficiencia_algoritmica,
                    reconocimiento_patrones: datosEstudiante.reconocimiento_patrones,
                    identificacion_errores: ganoIdenticacionErrores,
                    abstraccion: "APROBADO",
                    asociacion: datosEstudiante.asociacion,
                    construccion_algoritmos: datosEstudiante.construccion_algoritmos,
                    p_actividades_completadas: porcentajeAumentado,
                    tipo_premiacion: (datosEstudiante.tipo_premiacion.length > 0) ? datosEstudiante.tipo_premiacion + ", " + "Crítico del Arte Abstracto" : "Crítico del Arte Abstracto"
                  }
                              
                  const respuestaEvaluacion = await cargarEvaluacionEstudiante(datosUsuario)
                  console.log(respuestaEvaluacion)


                  if(existeNivelCinco){
                    const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                    
                    const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 5 && nivel.estatus === "APROBADO");

                    const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,5,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                    console.log(modificarResultado)
                  }else{
                    const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,5,"APROBADO")
                    console.log(cargarResultado)
                  }

                  await sleep(3000)

                                                                
                }else{
                  console.log("GANO PERO NO ES ESTUDIANTE")
                }

                if(existeNivelCinco){
                  const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                  
                  const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 5 && nivel.estatus === "APROBADO");
  
                  const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,5,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                  console.log(modificarResultado)
                }else{
                  const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,5,"APROBADO")
                  console.log(cargarResultado)
                }

                 window.location.href = window.location.href
              }

              arregloAuxiliarActividades.splice(indiceActividad, 1);
              console.log("ELIMINADO OPCION DE ARREGLO")
              console.log(arregloAuxiliarActividades)
              indiceActividad = (arregloAuxiliarActividades.length === 1) ? 0 :  generarNumerosAleatorios(0,vidas-1 )
              console.log("EL INDICE DE LA ACTIVIDAD ES:", indiceActividad)
              actividadGeneradaAzar = (arregloAuxiliarActividades.length > 0) ? arregloAuxiliarActividades[indiceActividad] : arregloActividades[0]
              console.log(actividadGeneradaAzar)
              if (actividadGeneradaAzar) {
                opcionEscogida = actividadGeneradaAzar.imagenes.indexOf(actividadGeneradaAzar.respuesta);
                imagen_central.sprite = actividadGeneradaAzar.imagenes[0];
                imagen1.sprite = actividadGeneradaAzar.imagenes[1];
                imagen2.sprite = actividadGeneradaAzar.imagenes[2];
                imagen3.sprite = actividadGeneradaAzar.imagenes[3];
              } else {
                console.warn("No hay más actividades disponibles. No se puede continuar.");
              }

              

            }
          )
          

            
                 
          

        }
      ).catch(
        ((error:any) => {
          console.log("lerolerolero")
        })
      )   
    
    }) //Fin - Onload()
         
    
  }
    
      //return <canvas id="game" style={{ width: "100vw", height: "100vh" }} />;;
      
    