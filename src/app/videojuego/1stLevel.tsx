"use client";

import {GameObj, KAPLAYCtx} from "kaplay";
import generarEsquemaMapa from "../../MapsGenerator";
import generarNumerosAzar from "../../utils/generarNumerosAzar";
import Evaluacion_Estudiante from "./interfaces/informacion_estudiante.interface";
import obtenerNivelesUsuario from "./functions/obtenerNivelesUsuario";
import cargarNivelUsuario from "./functions/cargarNivelUsuario";
import modificarNivelUsuario from "./functions/modificarNivelUsuario";

let SCREEN_RESOLUTION_X = 0;
let SCREEN_RESOLUTION_Y = 0;

const TILED_MAP__WIDTH_NUMBER: number = 21
const TILED_MAP_HEIGHT_NUMBER: number = 16
const TILED_WIDTH: number = SCREEN_RESOLUTION_X / TILED_MAP__WIDTH_NUMBER
const TILED_HEIGHT: number = SCREEN_RESOLUTION_Y / TILED_MAP_HEIGHT_NUMBER
let aciertos = 0;
let nuevoSprite: GameObj;
export let cambioNivel = 0;

let vidas = 3

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));   
}


export async function Nivel1(juegoKaplay:KAPLAYCtx<{},never>, setState:any, cambiarGanar:any,setStateA:any, cambiarGanarA:any,setState1:any, cambiarGanar1:any,setStateI:any, cambiarGanarI:any,setStateC:any, cambiarGanarC:any, Router:any, usuario: any,jugoNiveles: boolean) {

  let existeNivelDos = false
  if(jugoNiveles){
    const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
    console.log(nivelesUsuario)
    existeNivelDos = nivelesUsuario.some( (nivel: any) => nivel.id_nivel === 2);
  }else{
    console.log("NO HA JUGADO - PRIMERA VEZ")
  }

  juegoKaplay.loadSprite("construccion3", "sprites/buildings/House_Blue.png", {
      sliceX: 1,
      sliceY: 1,
    });

    juegoKaplay.loadSprite("construccion2", "sprites/buildings/House_Destroyed.png", {
      sliceX: 1,
      sliceY: 1,
    });

    juegoKaplay.loadSprite("construccion", "sprites/buildings/House_Construction.png", {
      sliceX: 1,
      sliceY: 1,
    });

    juegoKaplay.loadSprite("House_Blue", "sprites/buildings/House_Blue.png", {
      sliceX: 1,
      sliceY: 1,
    });

    juegoKaplay.loadSprite("Tower_Blue", "sprites/buildings/Tower_Blue.png", {
      sliceX: 1,
      sliceY: 1,
    });
  
    juegoKaplay.loadSprite("nomo", "sprites/characters/Pawn_Purple.png", {
      sliceX: 6,
      sliceY: 6,
      anims: {
        right: { from: 18, to: 23, loop: false },
        quiet: { from: 0, to: 0, loop: false },
      },
    });

    juegoKaplay.loadSprite("arbol", "sprites/deco/Tree.png", {
      sliceX: 4,
      sliceY: 3,
      anims: {
        bye: { from: 8, to: 8, loop: false },
        quiet: { from: 0, to: 3, loop: true },
      },
    });

    juegoKaplay.loadSprite("rock", "sprites/deco/Rocks_01.png", {
          sliceX: 8,
          sliceY: 1,
          anims: {
            quiet: { from: 0, to: 7, loop: true },
          },
    });

    juegoKaplay.loadSprite("oveja", "sprites/deco/HappySheep_Bouncing.png", {
      sliceX: 6,
      sliceY: 1,
      anims: {
        quiet: { from: 0, to: 5, loop: true },
      },
    });
  
    juegoKaplay.loadSprite("heart", "sprites/heart.png", {
      sliceX: 1,
      sliceY: 1,
    });

    juegoKaplay.loadSprite("title-0", "prueba/title-0.png", {
      sliceX: 1,
      sliceY: 1,
    });

    juegoKaplay.loadSprite("notas", "nivel2/notas_musicales.png", {
      sliceX: 3,
      sliceY: 1
    });
  
    juegoKaplay.loadSprite("notas_circulo", "nivel2/notas_musicales_con_circulo.png", {
      sliceX: 3,
      sliceY: 1
    });

    const cargarEvaluacionEstudiante = async (datos: Evaluacion_Estudiante) => {
      try {
        const response = await fetch('http://localhost:5555/estudiantes/establecer/notas', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // CORS: solo es necesario en el servidor, pero puedes incluir el header Origin si necesario
          },
          body: JSON.stringify(datos),
          mode: 'cors', // Habilita CORS
        });

        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Error al actualizar las notas:", error);
      }
    }

    juegoKaplay.loadSound("sonidoPrueba", "button_09-190435.mp3");
    const P1= juegoKaplay.loadSound("P1", "./sounds/P1.mp3");
    juegoKaplay.loadSound("P2", "./sounds/P2.mp3");
    juegoKaplay.loadSound("P3", "./sounds/P3.mp3");
    juegoKaplay.loadSound("P4", "./sounds/P4.mp3");
    juegoKaplay.loadSound("P5", "./sounds/P5.mp3");
    juegoKaplay.loadSound("P6", "./sounds/P6.mp3");
    juegoKaplay.loadSound("A0", "./sounds/A0.mp3");
    juegoKaplay.loadSound("A1", "./sounds/A1.mp3");
    juegoKaplay.loadSound("A2", "./sounds/A2.mp3");
    juegoKaplay.loadSound("nivel1", "./oveja-dialogos/Nivel1.wav");
    juegoKaplay.loadSound("aprobado", "./oveja-dialogos/aprobado.wav");
    juegoKaplay.loadSound("perdido", "./oveja-dialogos/perdido.wav");
    juegoKaplay.loadSound("fallaste", "./oveja-dialogos/fallaste.wav");
    juegoKaplay.loadSound("bien", "./oveja-dialogos/bien.wav");
    juegoKaplay.loadSprite("redbox", "red-border-box.png");
 
    juegoKaplay.onLoad(async () => {
        //Practicando aqui
        SCREEN_RESOLUTION_X = window.innerWidth 
        SCREEN_RESOLUTION_Y = window.innerHeight 

        

      const nivelPrincipal = generarEsquemaMapa(
        juegoKaplay,
        {
          nameFolder: "nivel2",
          nameFile: "prueba3.png",
          tileWidth: TILED_WIDTH,
          tileHeight: TILED_HEIGHT,
          pos: juegoKaplay.vec2(0, 0),
        },
        `./fonditosari.json`,   //archivo de donde voy a extraer el mapa
        [ //Aca lo importante es que debo introducir el orden de las texturas en el que va, capa por capa
          {
            urlTextura: "./nivel2/Water.png",  
            dimensionTexturasX: 2, //Dimensiones de tiled
            dimensionTexturasY: 2,
            firstgid: 1 //orden en el que tiled extrae esas imagenes (esta llega a cuatro)
          }, 
          {
            urlTextura: "./nivel2/Tilemap_Flat.png",
            dimensionTexturasX: 20,
            dimensionTexturasY: 8,
            firstgid: 5 //(esta comienza en 5)
          },        
          {urlTextura: "./nivel2/Tilemap_Elevation.png",
          dimensionTexturasX: 8,
          dimensionTexturasY: 16,
          firstgid: 165
            },
            {
            urlTextura: "./nivel2/Tilemap_Flat.png",
            dimensionTexturasX: 20,
            dimensionTexturasY: 8,
            firstgid: 5 //(esta comienza en 5)
          }

              
  
        ]
      )
      .then(

       
        async (resultado: any) => {

          cambiarGanar1(true);
          juegoKaplay.play("nivel1", { volume: 1, speed: 1.4, loop: false });
          setState1(true);

          const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

          await wait (5000)
          setState1(false);

          console.log(usuario)

          console.log("Resultado de generar nivel 2")
          console.log(juegoKaplay.get("*"))
          const ovejas= juegoKaplay.get("oveja")
          console.log(ovejas)

          const nomo = juegoKaplay.get("nomo")[0]
          console.log(nomo)
          const arbol = juegoKaplay.get("arbol")[0]
          console.log(arbol, {frame: 1})
          const construccion = juegoKaplay.get("construccion")[0]
          const construccion2 = juegoKaplay.get("construccion2")[0]
          const construccion3 = juegoKaplay.get("construccion3")[0]
          const colisiones = juegoKaplay.get("colisiones")
          console.log(colisiones);
          let esPrimeraRonda = true;
          let puedePresionar = false

          const velocidad = 440;

          const circle1 = juegoKaplay.add([
            juegoKaplay.pos(juegoKaplay.center().x - juegoKaplay.center().x / 4 -30, juegoKaplay.center().y + juegoKaplay.center().y / 2 + juegoKaplay.center().y / 6),
            juegoKaplay.sprite("notas_circulo", {frame: 0}),
            juegoKaplay.area(),
            juegoKaplay.scale(0.20),
            { z: 1},// Asegura que el jugador esté en una capa superior,
          ])
  
          const circle2 = juegoKaplay.add([
          juegoKaplay.pos(juegoKaplay.center().x -30, juegoKaplay.center().y + juegoKaplay.center().y / 2 + juegoKaplay.center().y / 6),
          juegoKaplay.sprite("notas_circulo", {frame: 1}),
          juegoKaplay.area(),
          juegoKaplay.scale(0.20),
          { z: 1},// Asegura que el jugador esté en una capa superior,
          ])
  
          const circle3 = juegoKaplay.add([
          juegoKaplay.pos(juegoKaplay.center().x + juegoKaplay.center().x / 4 -30, juegoKaplay.center().y + juegoKaplay.center().y / 2 + juegoKaplay.center().y / 6),
          juegoKaplay.sprite("notas_circulo", {frame: 2}),
          juegoKaplay.area(),
          juegoKaplay.scale(0.20),
          { z: 1},// Asegura que el jugador esté en una capa superior,
          ])
  
          let puntoPartida: number = window.innerWidth/3
          let puntoPartidaY:number = window.innerHeight/2

          // Array para almacenar los sprites de notas creados
          let spritesNotas: GameObj[] = []; // Asegúrate de usar el tipo correcto para los sprites en Kaboom.js
  
          async function validarAciertos() {
            const mostrarGananciaTemporal = () => {
              cambiarGanar(true);
              juegoKaplay.play("bien", { volume: 1, speed: 1, loop: false });
              setState(true);
              setTimeout(() => setState(false), 4000);
            };

            const esperar = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            switch (aciertos) {
              case 1:
                construccion.destroy();
                console.log("El mensaje es: " + aciertos);
                mostrarGananciaTemporal();
                ultimo = await patronesdinamicos(patronesJuego);
                puedePresionar = true
                break;

              case 2:
                console.log("El mensaje es: " + aciertos);
                mostrarGananciaTemporal();
                ultimo = await patronesdinamicos(patronesJuego);
                puedePresionar = true
                break;

              case 3:
                console.log("El mensaje es: " + aciertos);
                construccion2.destroy();

                ovejas.forEach((oveja: GameObj<any>) => {
                  oveja.play("quiet");
                });

                cambiarGanarA(true);
                juegoKaplay.play("aprobado", { volume: 1, speed: 1.5, loop: false });
                setStateA(true);

                

                if (usuario.rol === "ESTUDIANTE") {
                  const obtenerDatosUsuario = async (id: number) => {
                    const response = await fetch(`http://localhost:5555/estudiantes/${id}`);
                    return await response.json();
                  };

                  const datosEstudiante = await obtenerDatosUsuario(usuario.id_usuario);

                  const nivelesJugados = await obtenerNivelesUsuario(usuario.id_usuario);
                  console.log(nivelesJugados)

                  const ganoNivelDos = nivelesJugados.some( (nivel: any) => nivel.id_nivel === 2 && nivel.estatus === "APROBADO");

                  console.log(ganoNivelDos)

                  const porcentajeAumentado =
                  // Si el estudiante ya aprobó, se mantiene el porcentaje.
                  ganoNivelDos
                  ? datosEstudiante.p_actividades_completadas
                  // Si está en proceso o no ha jugado, se suma un 20%.
                  : datosEstudiante.p_actividades_completadas + 20;

                  const datosUsuario: Evaluacion_Estudiante = {
                    id_estudiante: datosEstudiante.id_usuario,
                    eficiencia_algoritmica: datosEstudiante.eficiencia_algoritmica,
                    reconocimiento_patrones: "EN PROCESO",
                    identificacion_errores: datosEstudiante.identificacion_errores,
                    abstraccion: datosEstudiante.abstraccion,
                    asociacion: "EN PROCESO",
                    construccion_algoritmos: datosEstudiante.construccion_algoritmos,
                    p_actividades_completadas: porcentajeAumentado,
                    tipo_premiacion: datosEstudiante.tipo_premiacion,
                  };

                  const respuestaEvaluacion = await cargarEvaluacionEstudiante(datosUsuario);
                  console.log(respuestaEvaluacion);
                } else {
                  console.log("GANO PERO NO ES ESTUDIANTE");
                }

                if(existeNivelDos){
                  const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                  
                  const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 2 && nivel.estatus === "APROBADO");

                  const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,2,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                  console.log(modificarResultado)
                }else{
                  const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,2,"APROBADO")
                  console.log(cargarResultado)
                }

                colisiones.forEach((colision: GameObj<any>) => colision.destroy());

                await esperar(5000);
                setStateA(false);
                window.location.href = window.location.href;
                break;

              default:
                console.warn("Aciertos fuera de rango esperado:", aciertos);
            }
          }

          function limpiarNotas() {
            
            spritesNotas = juegoKaplay.get("notas");
            console.log(spritesNotas);
            spritesNotas.forEach((spritesNotas:any)=>{
              spritesNotas.destroy();
            })
            puntoPartida = window.innerWidth/3
            puntoPartidaY= window.innerHeight/2
          }
        
          async function patronesdinamicos(
            patrones: number[][],
            ultimoPatron?: number
          ): Promise<[number, number] | null> {
            
            limpiarNotas();

            // Si no quedan patrones, termina el juego o devuelve null
            if (patrones.length === 0) {
              console.warn("No quedan más patrones disponibles.");
              return null;
            }

            // Elegir un patrón aleatorio diferente al último
            let nuevoIndice: number;
            do {
              nuevoIndice = Math.floor(Math.random() * patrones.length);
            } while (patrones.length > 1 && nuevoIndice === ultimoPatron);

            const nuevoPatron = patrones.splice(nuevoIndice, 1)[0]; // elimina y obtiene el patrón
            const secuencia = nuevoPatron.slice(0, -1);
            const ultimo = nuevoPatron[nuevoPatron.length - 1];

            if (ultimoPatron === undefined) {
              console.log("REPRODUCIENDO PRIMER PATRÓN");
            } else {
              console.log("PROXIMO PATRÓN:");
            }

            console.log(nuevoPatron);

            let delay = esPrimeraRonda ? 5000 : 350;
            esPrimeraRonda = false;

            const ejecutarSecuencia = async (secuencia: number[]) => {
              for (const numeroAzar of secuencia) {
                switch (numeroAzar) {
                  case 0: crearNota(1, "A0"); break;
                  case 1: crearNota(0, "A1"); break;
                  case 2: crearNota(2, "A2"); break;
                }
                await wait(400); // espera 400ms antes de la siguiente nota
              }

              
              // ✅ Aquí continúa el programa después de la secuencia
              console.log("Secuencia completada");
              // puedes llamar a otra función aquí
            };

            function crearNota(frame: number, sonido: string) {
              const sprite = juegoKaplay.add([
                juegoKaplay.pos(puntoPartida, juegoKaplay.center().y / 2 + puntoPartidaY - 80),
                juegoKaplay.sprite("notas"),
                juegoKaplay.scale(0.1),
                { z: 2 },
                "notas",
              ]);
              sprite.frame = frame;
              juegoKaplay.play(sonido, { volume: 1, speed: 1.5, loop: false });
              spritesNotas.push(sprite);
              puntoPartida += 70;
            }

            await ejecutarSecuencia(secuencia);

            puedePresionar = true;

            return [ultimo, nuevoIndice];
          }

          const patronesJuego = [
            [0, 1, 2, 0, 1, 2, 0, 1, 2],
            [0, 2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 1, 1, 1, 2, 2, 2],
            [1, 2, 0, 1, 2, 0, 1, 2, 0],
            [2, 1, 0, 2, 1, 0, 2, 1, 0],
            [0, 0, 1, 1, 0, 0, 1, 1, 0],
          ]
  
          let ultimo = await patronesdinamicos(patronesJuego);
          puedePresionar = true

          circle1.onClick(async () => {
            if(puedePresionar){
              juegoKaplay.play("A0", { volume: 1, speed: 1.5, loop: false });

              if (ultimo && ultimo[0] === 0) {
                nomo.play("right");
                arbol.play("bye");
                aciertos++;
                puedePresionar = false
                await validarAciertos();

                setTimeout(() => {
                  arbol.play("quiet");
                }, 2000);
              } else {
                puedePresionar = false
                console.log("Fallaste", ultimo);
              
                vidas--;
                cambiarGanarI(true);

                if (vidas <= 0) {
                  setTimeout(() => {
                  console.log("TE MORISTE");
                }, 5000);
                  
                  juegoKaplay.play("perdido", { volume: 1, speed: 1, loop: false });
                  cambiarGanarC(true);
                  setStateC(true);

                  if(existeNivelDos){
                    const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                    
                    const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 2 && nivel.estatus === "APROBADO");

                    const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,2,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                    console.log(modificarResultado)
                  }else{
                    const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,2,"NO APROBADO")
                    console.log(cargarResultado)
                  }

                  if (usuario.rol === "ESTUDIANTE") {
                    const obtenerDatosUsuario = async (estudiante_seleccionado: number) => {
                      const datosEstudiante = await fetch("http://localhost:5555/estudiantes/" + estudiante_seleccionado);
                      const resultadoConsulta = await datosEstudiante.json();
                      console.log(resultadoConsulta);
                      return resultadoConsulta;
                    };

                    const datosEstudiante = await obtenerDatosUsuario(usuario.id_usuario);

                    const datosUsuario: Evaluacion_Estudiante = {
                      id_estudiante: datosEstudiante.id_usuario,
                      eficiencia_algoritmica: datosEstudiante.eficiencia_algoritmica,
                      reconocimiento_patrones: (datosEstudiante.reconocimiento_patrones !== "APROBADO") ? "EN PROCESO" : datosEstudiante.reconocimiento_patrones,
                      identificacion_errores: datosEstudiante.identificacion_errores,
                      abstraccion: datosEstudiante.abstraccion,
                      asociacion: (datosEstudiante.asociacion !== "APROBADO") ? "EN PROCESO" : datosEstudiante.asociacion,
                      construccion_algoritmos: datosEstudiante.construccion_algoritmos,
                      p_actividades_completadas: datosEstudiante.p_actividades_completadas,
                      tipo_premiacion: datosEstudiante.tipo_premiacion
                    };

                    const respuestaEvaluacion = await cargarEvaluacionEstudiante(datosUsuario);
                    console.log(respuestaEvaluacion);
                  } else {
                    console.log("GANO PERO NO ES ESTUDIANTE");
                  }

                  await sleep(1000);
                  window.location.href = window.location.href;

                } else{
                  
                  juegoKaplay.play("fallaste", { volume: 1, speed: 1.5, loop: false });
                  setStateI(true);
                }

                const ultimoIndice = (ultimo != null) ? ultimo[1] : undefined;
                ultimo = await patronesdinamicos(patronesJuego, ultimoIndice);
                puedePresionar = true

                setTimeout(() => {
                  setState(false);
                }, 2000);
              }

            }
          });

          circle2.onClick(async () => {
            if(puedePresionar){
                juegoKaplay.play("A1", { volume: 1, speed: 1.5, loop: false });

                if (ultimo && ultimo[0] === 1) {
                  nomo.play("right");
                  arbol.play("bye");
                  aciertos++;
                  puedePresionar = false
                  await validarAciertos();

                  setTimeout(() => {
                    arbol.play("quiet");
                  }, 2000);
                } else {

                  puedePresionar = false
                  console.log("Fallaste", ultimo);
                  
                  vidas--;
                  cambiarGanarI(true);

                  if (vidas <= 0) {
                    setTimeout(() => {
                    console.log("TE MORISTE");
                  }, 5000);
                    
                    juegoKaplay.play("perdido", { volume: 1, speed: 1.5, loop: false });
                    cambiarGanarC(true);
                    setStateC(true);
                    if (usuario.rol === "ESTUDIANTE") {
                      const obtenerDatosUsuario = async (estudiante_seleccionado: number) => {
                        const datosEstudiante = await fetch("http://localhost:5555/estudiantes/" + estudiante_seleccionado);
                        const resultadoConsulta = await datosEstudiante.json();
                        console.log(resultadoConsulta);
                        return resultadoConsulta;
                      };

                      const datosEstudiante = await obtenerDatosUsuario(usuario.id_usuario);

                      const datosUsuario: Evaluacion_Estudiante = {
                        id_estudiante: datosEstudiante.id_usuario,
                        eficiencia_algoritmica: datosEstudiante.eficiencia_algoritmica,
                        reconocimiento_patrones: (datosEstudiante.reconocimiento_patrones !== "APROBADO") ? "EN PROCESO" : datosEstudiante.reconocimiento_patrones,
                        identificacion_errores: datosEstudiante.identificacion_errores,
                        abstraccion: datosEstudiante.abstraccion,
                        asociacion: (datosEstudiante.asociacion !== "APROBADO") ? "EN PROCESO" : datosEstudiante.asociacion,
                        construccion_algoritmos: datosEstudiante.construccion_algoritmos,
                        p_actividades_completadas: datosEstudiante.p_actividades_completadas,
                        tipo_premiacion: datosEstudiante.tipo_premiacion
                      };

                      const respuestaEvaluacion = await cargarEvaluacionEstudiante(datosUsuario);
                      console.log(respuestaEvaluacion);
                    } else {
                      console.log("GANO PERO NO ES ESTUDIANTE");
                    }

                    await sleep(1000);
                    window.location.href = window.location.href;

                  } else{
                    
                    juegoKaplay.play("fallaste", { volume: 1, speed: 1.5, loop: false });
                    setStateI(true);
                  }

                  const ultimoIndice = (ultimo != null) ? ultimo[1] : undefined;
                  ultimo = await patronesdinamicos(patronesJuego, ultimoIndice);
                  puedePresionar = true
                  setTimeout(() => {
                    setState(false);
                  }, 2000);
                }

      
            }
            
          });

          circle3.onClick(async () => {

            if(puedePresionar){
              juegoKaplay.play("A2", { volume: 1, speed: 1.5, loop: false });
              if (ultimo && ultimo[0] === 2) {
                nomo.play("right");
                arbol.play("bye");
                aciertos++;
                puedePresionar = false
                await validarAciertos();

                setTimeout(() => {
                  arbol.play("quiet");
                }, 2000);
              } else {
                puedePresionar = false
                console.log("Fallaste", ultimo);
                vidas--;
                cambiarGanarI(true);

                if (vidas <= 0) {
                  setTimeout(() => {
                  console.log("TE MORISTE");
                }, 5000);
                  
                  juegoKaplay.play("perdido", { volume: 1, speed: 1.5, loop: false });
                  cambiarGanarC(true);
                  setStateC(true);
                  if (usuario.rol === "ESTUDIANTE") {
                    const obtenerDatosUsuario = async (estudiante_seleccionado: number) => {
                      const datosEstudiante = await fetch("http://localhost:5555/estudiantes/" + estudiante_seleccionado);
                      const resultadoConsulta = await datosEstudiante.json();
                      console.log(resultadoConsulta);
                      return resultadoConsulta;
                    };

                    const datosEstudiante = await obtenerDatosUsuario(usuario.id_usuario);

                    const datosUsuario: Evaluacion_Estudiante = {
                      id_estudiante: datosEstudiante.id_usuario,
                      eficiencia_algoritmica: datosEstudiante.eficiencia_algoritmica,
                      reconocimiento_patrones: (datosEstudiante.reconocimiento_patrones !== "APROBADO") ? "EN PROCESO" : datosEstudiante.reconocimiento_patrones,
                      identificacion_errores: datosEstudiante.identificacion_errores,
                      abstraccion: datosEstudiante.abstraccion,
                      asociacion: (datosEstudiante.asociacion !== "APROBADO") ? "EN PROCESO" : datosEstudiante.asociacion,
                      construccion_algoritmos: datosEstudiante.construccion_algoritmos,
                      p_actividades_completadas: datosEstudiante.p_actividades_completadas,
                      tipo_premiacion: datosEstudiante.tipo_premiacion
                    };

                    const respuestaEvaluacion = await cargarEvaluacionEstudiante(datosUsuario);
                    console.log(respuestaEvaluacion);
                  } else {
                    console.log("GANO PERO NO ES ESTUDIANTE");
                  }

                  await sleep(1000);
                  window.location.href = window.location.href;

                } else{
                  
                  juegoKaplay.play("fallaste", { volume: 1, speed: 1.5, loop: false });
                  setStateI(true);
                }

                const ultimoIndice = (ultimo != null) ? ultimo[1] : undefined;
                ultimo = await patronesdinamicos(patronesJuego, ultimoIndice);
                puedePresionar = true
                setTimeout(() => {
                  setState(false);
                }, 2000);
              }

            }
            
          });
  
           
  
            
  
            
          
          }
          
          
        ).catch(
              ((error:any) => {
                console.log("lerolerolero")
              })
        )   
    
    
      }) //Fin - Onload()
         
    
  }
  
      
    