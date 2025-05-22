"use client";

import {GameObj, KAPLAYCtx} from "kaplay";
import generarEsquemaMapa from "../../MapsGenerator";
import generarNumerosAzar from "../../utils/generarNumerosAzar";
import Evaluacion_Estudiante from "./interfaces/informacion_estudiante.interface";
import cargarEvaluacionEstudiante from "./functions/cargarEvaluacionEstudiante";
import cargarNivelUsuario from "./functions/cargarNivelUsuario";
import obtenerNivelesUsuario from "./functions/obtenerNivelesUsuario";
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




export async function Nivel4(juegoKaplay:KAPLAYCtx<{},never>, setState:any, cambiarGanar:any,setStateA:any, cambiarGanarA:any,setState1:any, cambiarGanar1:any, setStateC:any, cambiarGanarC:any,setStateI:any, cambiarGanarI:any, Router:any,usuario: any,jugoNiveles:boolean) {
    // Referencia persistente para almacenar la instancia de Kaplay
   // setState(false);

    let existeNivelCuatro = false
    if(jugoNiveles){
      const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
      console.log(nivelesUsuario)
      existeNivelCuatro = nivelesUsuario.some( (nivel: any) => nivel.id_nivel === 4);
    }else{
      console.log("NO HA JUGADO - PRIMERA VEZ")
    }

    function sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));   
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

    juegoKaplay.loadSprite("notas1", "nivel2/notas_musicales1.png", {
      sliceX: 3,
      sliceY: 1
    });
  
    juegoKaplay.loadSprite("notas_circulo1", "nivel4/Activacion_notas.png", {
      sliceX: 3,
      sliceY: 2,
      anims: {
        default: { from: 0, to: 0, loop: false } ,
        hover: { from: 0, to: 2, loop: false},
      },
    });

    let semicorchea1: GameObj;
    let semicorchea2: GameObj;
    let semicorchea3:GameObj;

 

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
    juegoKaplay.loadSound("nivel1", "./oveja-dialogos/nivel1.wav");
    juegoKaplay.loadSound("aprobado", "./oveja-dialogos/aprobado.wav");
    juegoKaplay.loadSound("perdido", "./oveja-dialogos/perdido.wav");
    juegoKaplay.loadSound("fallaste", "./oveja-dialogos/fallaste.wav");
    juegoKaplay.loadSound("bien", "./oveja-dialogos/bien.wav");


    juegoKaplay.loadSprite("redbox", "red-border-box.png");

    let puedePresionar: boolean = false;
        
  
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
        
          juegoKaplay.play("nivel1", { volume: 1, speed: 1.5, loop: false });
          cambiarGanar1(true);
          setState1(true);
          await sleep(2000)
          const ovejas= juegoKaplay.get("oveja")


          const nomo = juegoKaplay.get("nomo")[0]

          const arbol = juegoKaplay.get("arbol")[0]
    
          const construccion = juegoKaplay.get("construccion")[0]
          const construccion2 = juegoKaplay.get("construccion2")[0]
          const construccion3 = juegoKaplay.get("construccion3")[0]
          const colisiones = juegoKaplay.get("colisiones")
 
          let esPrimeraRonda = true;

        /* const casa = juegoKaplay.add([
            juegoKaplay.pos(400,-5),
            juegoKaplay.sprite("casa1"),
            juegoKaplay.scale(0.8),
            juegoKaplay.health(3),
            juegoKaplay.area(),
            "casa",
            { z: 1 } // Asegura que el jugador esté en una capa superior
        ]);*/

          
          const velocidad = 440;

          const circle1 = juegoKaplay.add([
            juegoKaplay.pos(juegoKaplay.center().x - juegoKaplay.center().x / 4 -30, juegoKaplay.center().y + juegoKaplay.center().y / 2 + juegoKaplay.center().y / 6),
            juegoKaplay.sprite("notas_circulo1", {frame: 0}),
            juegoKaplay.area(),
            juegoKaplay.scale(0.20),
            { z: 1},// Asegura que el jugador esté en una capa superior,
          ])

          const circle2 = juegoKaplay.add([
            juegoKaplay.pos(juegoKaplay.center().x -30, juegoKaplay.center().y + juegoKaplay.center().y / 2 + juegoKaplay.center().y / 6),
            juegoKaplay.sprite("notas_circulo1", {frame: 0}),
            juegoKaplay.area(),
            juegoKaplay.scale(0.20),
            { z: 1},// Asegura que el jugador esté en una capa superior,
          ])

          const circle3 = juegoKaplay.add([
            juegoKaplay.pos(juegoKaplay.center().x + juegoKaplay.center().x / 4 -30, juegoKaplay.center().y + juegoKaplay.center().y / 2 + juegoKaplay.center().y / 6),
            juegoKaplay.sprite("notas_circulo1", {frame: 0}),
            juegoKaplay.area(),
            juegoKaplay.scale(0.20),
            { z: 1},// Asegura que el jugador esté en una capa superior,
          ])

          let puntoPartida: number = window.innerWidth/3
          let puntoPartidaY:number = window.innerHeight/2

          // Array para almacenar los sprites de notas creados
          let spritesNotas: GameObj[] = []; // Asegúrate de usar el tipo correcto para los sprites en Kaboom.js
        
          function limpiarNotas() {
            
            spritesNotas = juegoKaplay.get("notas1");

            spritesNotas.forEach((spritesNotas:any)=>{
              spritesNotas.destroy();
            })
            puntoPartida = window.innerWidth/3
            puntoPartidaY= window.innerHeight/2
          }

          await sleep(1000)
          /* Reproducir notas de pruebas */
          circle1.play("hover", {speed: 4});
          juegoKaplay.play("A0", {
              volume: 1, 
              speed: 1, 
              loop: false, 
          });

          juegoKaplay.wait(1, () => {
            circle1.play("default");
          });

          await sleep(1000)
          
          circle1.play("hover", {speed: 4});
          juegoKaplay.play("A0", {
              volume: 1, 
              speed: 1, 
              loop: false, 
          });

          juegoKaplay.wait(1, () => {
            circle1.play("default");
          });
     
          await sleep(1000)

          circle1.play("hover", {speed: 4});
          juegoKaplay.play("A0", {
              volume: 1, 
              speed: 1, 
              loop: false, 
          });

          juegoKaplay.wait(1, () => {
            circle1.play("default");
          });

          await sleep(1000)

          /* Sonido de Segundo Botón */

          circle2.play("hover", {speed: 4});
          juegoKaplay.play("A1", {
              volume: 1, 
              speed: 1, 
              loop: false, 
          });

          juegoKaplay.wait(1, () => {
            circle2.play("default");
          });

          await sleep(1000)
          
          circle2.play("hover", {speed: 4});
          juegoKaplay.play("A1", {
              volume: 1, 
              speed: 1, 
              loop: false, 
          });

          juegoKaplay.wait(1, () => {
            circle2.play("default");
          });
     
          await sleep(1000)

          circle2.play("hover", {speed: 4});
          juegoKaplay.play("A1", {
              volume: 1, 
              speed: 1, 
              loop: false, 
          });

          juegoKaplay.wait(1, () => {
            circle2.play("default");
          });

          await sleep(1000)

          /* Sonido de Tercer Botón */

        circle3.play("hover", {speed: 4});
          juegoKaplay.play("A2", {
              volume: 1, 
              speed: 1, 
              loop: false, 
          });

          juegoKaplay.wait(1, () => {
            circle3.play("default");
          });

          await sleep(1000)
          
          circle3.play("hover", {speed: 4});
          juegoKaplay.play("A2", {
              volume: 1, 
              speed: 1, 
              loop: false, 
          });

          juegoKaplay.wait(1, () => {
            circle3.play("default");
          });
     
          await sleep(1000)

          circle3.play("hover", {speed: 4});
          juegoKaplay.play("A2", {
              volume: 1, 
              speed: 1, 
              loop: false, 
          });

          juegoKaplay.wait(1, () => {
            circle3.play("default");
          });

          await sleep(1000)


          /*********************************/

          

          

          


          async function patronesdinamicos(patrones_numeros: number[][], ultimoPatron?: number
          ) {

            async function reproducirSecuencia(secuencia: number[]) {
              for (const numeroAzar of secuencia) {
                let frame = 0;
                let sonido = "";

                switch (numeroAzar) {
                  case 0:
                    frame = 1;
                    sonido = "A0";
                    break;
                  case 1:
                    frame = 0;
                    sonido = "A1";
                    break;
                  case 2:
                    frame = 2;
                    sonido = "A2";
                    break;
                }

                const nuevoSprite = juegoKaplay.add([
                  juegoKaplay.pos(puntoPartida, juegoKaplay.center().y / 2 + puntoPartidaY - 80),
                  juegoKaplay.sprite("notas1"),
                  juegoKaplay.scale(0.1),
                  { z: 2 },
                  "notas1"
                ]);

                nuevoSprite.frame = frame;
                juegoKaplay.play(sonido, { volume: 1, speed: 1.5, loop: false });

                spritesNotas.push(nuevoSprite);
                puntoPartida += 70;

                await juegoKaplay.wait(0.4); // espera 400ms antes de la siguiente nota
              }

              // Aquí ya terminó toda la secuencia
              console.log("Secuencia completada");
            }

            console.log("Patronesdinamicos()")
            console.log("ARREGLO VIEJO ", patrones_numeros)

            spritesNotas = juegoKaplay.get("notas1");
            spritesNotas.forEach((spritesNotas:any)=>{
              spritesNotas.destroy();
            })

            puntoPartida = window.innerWidth/3
            puntoPartidaY= window.innerHeight/2
          
            // Elegir un índice aleatorio diferente al último
            const indiceAleatorio = Math.floor(Math.random() * patrones_numeros.length);
            const patron = patrones_numeros[indiceAleatorio];
            console.log("PATRON SELECCIONADO: ", patron)

            const ultimo_elemento = patron[patron.length - 1]
            const secuencia = patron.slice(0, -1);

            const nuevo_arreglo: number [][] = []

            patrones_numeros.forEach( (arreglo_numeros: number[], index: number) => {
              if(index !== indiceAleatorio) {
                nuevo_arreglo.push([...arreglo_numeros])
              }
            })

            console.log("NUEVO ARREGLO", nuevo_arreglo)


            let delay = esPrimeraRonda ? 5000 : 350; // 10s la primera vez, luego normal
            esPrimeraRonda = false; // Marcar como no primera ronda
          
            await reproducirSecuencia(secuencia);

            console.log("********************************")
            console.log("PATRONES HA EXTRAIDO")
            console.log(ultimo_elemento)
            console.log(indiceAleatorio)
            console.log("********************************")

            await sleep(1000)

            puedePresionar = true

            return {
              "ultimo_elemento": ultimo_elemento,
              "indice_aleatorio": indiceAleatorio,
              "nuevo_arreglo": nuevo_arreglo
            };
          }

          async function validarAciertos(arreglo_patrones: number[][], ultimoPatron: number){

            arreglo_patrones.splice(ultimoPatron, 1); // Elimina el elemento en el índice 2 (30)
            console.log(patrones)

            console.log("NUMERO DE ACIERTOS: ",  aciertos)


            if(vidas <= 0) {
              console.log("TE MORISTE")

              if(existeNivelCuatro){
                const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                
                const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 4 && nivel.estatus === "APROBADO");

                const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,4,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                console.log(modificarResultado)
              }else{
                const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,4,"NO APROBADO")
                console.log(cargarResultado)
              }


              cambiarGanarC(true);
              setStateC(true);
              juegoKaplay.play("perdido", { volume: 1, speed: 1.5, loop: false });
              await sleep(2000)
                
              if(usuario.rol === "ESTUDIANTE"){
                                  
                const obtenerDatosUsuario = async (estudiante_seleccionado: number) => {
    
                  const datosEstudiante = await fetch("http://localhost:5555/estudiantes/" + estudiante_seleccionado)
                  const resultadoConsulta = await datosEstudiante.json()
                  console.log(resultadoConsulta)

                  return resultadoConsulta

                };
              
                const datosEstudiante = await obtenerDatosUsuario(usuario.id_usuario)
              
                console.log(datosEstudiante)


        
                const datosUsuario: Evaluacion_Estudiante = {
                  id_estudiante: datosEstudiante.id_usuario,
                  eficiencia_algoritmica: datosEstudiante.eficiencia_algoritmica,
                  reconocimiento_patrones: "EN PROCESO",
                  identificacion_errores: "EN PROCESO",
                  abstraccion: datosEstudiante.abstraccion,
                  asociacion: (datosEstudiante.asociacion !== "APROBADO") ? "EN PROCESO" : datosEstudiante.asociacion,
                  construccion_algoritmos: datosEstudiante.construccion_algoritmos,
                  p_actividades_completadas: datosEstudiante.p_actividades_completadas,
                  tipo_premiacion: datosEstudiante.tipo_premiacion
                }
              
                const respuestaEvaluacion = await cargarEvaluacionEstudiante(datosUsuario)
                console.log(respuestaEvaluacion)
                                                
              }else{
                console.log("GANO PERO NO ES ESTUDIANTE")
              }
                                
              await sleep(1000)
              /*window.location.href = window.location.href;*/
            }

            if(aciertos==1){
                      
              construccion.destroy();
                
              cambiarGanar(true);
              setState(true);
              juegoKaplay.play("bien", { volume: 1, speed: 1.5, loop: false });
              await sleep(2000)
              

            }else if(aciertos==2){
              
            
              cambiarGanar(true);
              setState(true);
              
        
            }else if(aciertos==3){
              
              console.log("El mensaje es: " + aciertos);
              //patronesdinamicos().clear;
              
              cambiarGanar(true);
              setState(true);
              juegoKaplay.play("aprobado", { volume: 1, speed: 1.5, loop: false });
              await sleep(2000)
              
            //setTimeout(()=>{
              construccion2.destroy();
              ovejas.forEach( (oveja: GameObj<any>) => {
                oveja.play("quiet");
              })

              setStateA(true);
                      
              if(usuario.rol === "ESTUDIANTE"){
                                  
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

                const ganoNivelCuatro = nivelesJugados.some( (nivel: any) => nivel.id_nivel === 4 && nivel.estatus === "APROBADO");

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
                      (datosEstudiante.identificacion_errores !== "APROBADO" && datosEstudiante.construccion_algoritmos == "APROBADO" && datosEstudiante.abstraccion == "APROBADO")
                        ? "APROBADO" 
                        :
                        ((datosEstudiante.identificacion_errores == "APROBADO") ? "APROBADO": "EN PROCESO");
        
                const datosUsuario: Evaluacion_Estudiante = {
                  id_estudiante: datosEstudiante.id_usuario,
                  eficiencia_algoritmica: datosEstudiante.eficiencia_algoritmica,
                  reconocimiento_patrones: "APROBADO",
                  identificacion_errores: ganoIdenticacionErrores,
                  abstraccion: datosEstudiante.abstraccion,
                  asociacion: (datosEstudiante.asociacion !== "APROBADO") ? "EN PROCESO" : datosEstudiante.asociacion,
                  construccion_algoritmos: datosEstudiante.construccion_algoritmos,
                  p_actividades_completadas: porcentajeAumentado,
                  
                  tipo_premiacion: ( datosEstudiante.tipo_premiacion && datosEstudiante.tipo_premiacion.length > 0 ) ? datosEstudiante.tipo_premiacion + ", " + "Corrector de melodías" : "Corrector de melodías" // o string[], si es un arreglo
                }
              
                const respuestaEvaluacion = await cargarEvaluacionEstudiante(datosUsuario)
                console.log(respuestaEvaluacion)
                                                
              }else{
                console.log("GANO PERO NO ES ESTUDIANTE")
              }

              if(existeNivelCuatro){
                const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                
                const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 4 && nivel.estatus === "APROBADO");

                const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,4,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                console.log(modificarResultado)
              }else{
                const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,4,"APROBADO")
                console.log(cargarResultado)
              }
                                
              await new Promise(resolve => setTimeout(resolve, 5000));
              window.location.href = window.location.href;
                          
                
            // },200);
            
            
            colisiones.forEach( (colision: GameObj<any>) => {
                          
              colision.destroy();
            })
        
            }

            puedePresionar = false;

            let respuestaPatronesDinamicos = await patronesdinamicos(patrones);

            ultimo = respuestaPatronesDinamicos.ultimo_elemento
            indiceAlAzar = respuestaPatronesDinamicos.indice_aleatorio
            //patrones = [...respuestaPatronesDinamicos.nuevo_arreglo]

          };

          let vidas: number = 3

          let patrones = [
              [0, 1, 2, 0, 1, 2, 0, 1, 2],
              [0, 2, 0, 2, 0, 2, 0, 2, 0],
              [0, 0, 0, 1, 1, 1, 2, 2, 2],
              [1, 2, 0, 1, 2, 0, 1, 2, 0],
              [2, 1, 0, 2, 1, 0, 2, 1, 0],
              [0, 0, 1, 1, 0, 0, 1, 1, 0],
          ];




            

            circle1.play("default");


          let respuestaPatronesDinamicos = await patronesdinamicos(patrones);



          let ultimo = respuestaPatronesDinamicos.ultimo_elemento
          let indiceAlAzar = respuestaPatronesDinamicos.indice_aleatorio

          patrones = [...respuestaPatronesDinamicos.nuevo_arreglo]

          console.log("Generando el primer patron: ", {
            "ultimo": ultimo,
            "ultimoPatron": indiceAlAzar,
            "nuevo_arreglo": patrones
          })

          console.log(patrones)

          circle1.onClick( async () => {

            if(puedePresionar){
              circle1.play("hover");

            juegoKaplay.wait(0.4, () => {
                circle1.play("default");
            });

            juegoKaplay.play("A0", {
              volume: 1, 
              speed: 1.5, 
              loop: false, 
            });

            if(ultimo == 0){
  
              nomo.play("right");
              arbol.play("bye");

              aciertos = aciertos + 1;
              juegoKaplay.play("bien", { volume: 1, speed: 1.5, loop: false });
              await sleep(2000)
              
              setTimeout(() => {
                arbol.play("quiet");
              }, 2000); 
              
            }else{
              console.log("Fallaste" +ultimo)
              vidas--
              cambiarGanarI(true);
              setStateI(true);
              juegoKaplay.play("fallaste", { volume: 1, speed: 1.5, loop: false });
              await sleep(2000)
            }

            await validarAciertos(patrones,indiceAlAzar);
          }

            


          })

          circle2.onClick( async () => {

            if(puedePresionar){
circle2.play("hover");

            juegoKaplay.wait(0.4, () => {
                circle2.play("default");
            });

            juegoKaplay.play("A1", {
              volume: 1, 
              speed: 1.5, 
              loop: false, 
            });

            if(ultimo === 1){
  
              nomo.play("right");
              arbol.play("bye");
              juegoKaplay.play("bien", { volume: 1, speed: 1.5, loop: false });
              await sleep(2000)

              aciertos = aciertos + 1;

              console.log("sumando mardito ", aciertos)
              
              setTimeout(() => {
                arbol.play("quiet");
              }, 2000); 
              
            }else{
              console.log("Fallaste" + ultimo)
              
              vidas--
              cambiarGanarI(true);
              setStateI(true);
              juegoKaplay.play("fallaste", { volume: 1, speed: 1.5, loop: false });
              await sleep(2000)
            }

            await validarAciertos(patrones,indiceAlAzar);
            }

          })

          circle3.onClick( async () => {

            if(puedePresionar){
              circle3.play("hover");
              juegoKaplay.wait(0.4, () => {
                circle3.play("default");
              });
            
            juegoKaplay.play("A2", {
              volume: 1, 
              speed: 1.5, 
              loop: false, 
            });
            if(ultimo == 2){
  
              nomo.play("right");
              arbol.play("bye");
              aciertos = aciertos + 1;
              juegoKaplay.play("bien", { volume: 1, speed: 1.5, loop: false });
              await sleep(2000)

              setTimeout(() => {
                arbol.play("quiet");
              }, 2000);
              
            }else{
       
              
              vidas--
              cambiarGanarI(true);
              setStateI(true);
              juegoKaplay.play("fallaste", { volume: 1, speed: 1.5, loop: false });
              await sleep(2000)
            }

            
            await validarAciertos(patrones,indiceAlAzar);
            }
            
          })         
          

        }
      ).catch(
        ((error:any) => {
          console.log("lerolerolero")
        })
      )   
    
    }) //Fin - Onload()
         
    
  }
    
      //return <canvas id="game" style={{ width: "100vw", height: "100vh" }} />;;
      
    