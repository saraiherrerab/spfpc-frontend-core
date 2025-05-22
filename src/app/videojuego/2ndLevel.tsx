import { GameObj, KAPLAYCtx } from "kaplay";
import generarEsquemaMapa from "../../MapsGenerator";
import Evaluacion_Estudiante from "./interfaces/informacion_estudiante.interface";
import cargarEvaluacionEstudiante from "./functions/cargarEvaluacionEstudiante";
import obtenerNivelesUsuario from "./functions/obtenerNivelesUsuario";
import cargarNivelUsuario from "./functions/cargarNivelUsuario";
import modificarNivelUsuario from "./functions/modificarNivelUsuario";

export async function Nivel2(juegoKaplay:KAPLAYCtx<{},never>, setStateB:any, cambiarGanarB:any, setStateA:any, cambiarGanarA:any,setStateC:any, cambiarGanarC:any, Router:any,usuario: any,jugoNiveles:boolean){

        let existeNivelUno = false
        if(jugoNiveles){
          const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
          console.log(nivelesUsuario)
          existeNivelUno = nivelesUsuario.some( (nivel: any) => nivel.id_nivel === 1);
        }else{
          console.log("NO HA JUGADO - PRIMERA VEZ")
        }
        const SCREEN_RESOLUTION_X: number = window.innerWidth 
        const SCREEN_RESOLUTION_Y: number = window.innerHeight 
        const TILED_MAP__WIDTH_NUMBER: number = 20
        const TILED_MAP_HEIGHT_NUMBER: number = 15
        const TILED_WIDTH: number = SCREEN_RESOLUTION_X / TILED_MAP__WIDTH_NUMBER
        const TILED_HEIGHT: number = SCREEN_RESOLUTION_Y / TILED_MAP_HEIGHT_NUMBER

        let posicionAnteriorXGlobal = 0;
        let posicionAnteriorYGlobal= 0;

        const NUMERO_MINIMO_MOVIMIENTOS: number = 26;
        let contadorMovimientos: number = 0;
        let movimientoValido: boolean = true;


        function sleep(ms: number) {
          return new Promise(resolve => setTimeout(resolve, ms));   
        }

        console.log("Comenzando a generar para llegar a ovejas")

        console.log(usuario)
        console.log(juegoKaplay.get("*"))

        let lives = 3
    
        juegoKaplay.loadSprite("robot", "sprites/robotin.png", {
          sliceX: 4,
          sliceY: 12,
          anims: {
            right: { from: 16, to: 19, loop: false },
            up: { from: 20, to: 23, loop: false},
            down: { from: 12, to: 15, loop: false},
            left: { from: 24, to: 27, loop: false},
            quiet: { from: 0, to: 0, loop: false},
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
        juegoKaplay.loadSprite("knight", "sprites/p_knight_official.png", {
          sliceX: 6,
          sliceY: 8,
          anims: {
            right: { from: 6, to: 11, loop: false },
            up: { from: 36, to: 38, loop: false },
            down: { from: 24, to: 26, loop: false },
            left: { from: 5, to: 1, loop: false },
            quiet: { from: 31, to: 31, loop: false },
          },
        });
        juegoKaplay.loadSprite("enemy", "sprites/TNT_Blue (1).png", {
          sliceX: 7,
          sliceY: 3,
          anims: {
            left_a: { from: 20, to: 14, loop: false },
            right_a: { from: 7, to: 13, loop: false },
            quiet: { from: 0, to: 0, loop: false },
          },
        });
        juegoKaplay.loadSprite("heart1", "sprites/heart.png", {
          sliceX: 1,
          sliceY: 1,
        });
        juegoKaplay.loadSprite("heart2", "sprites/heart.png", {
          sliceX: 1,
          sliceY: 1,
        });
        juegoKaplay.loadSprite("heart3", "sprites/heart.png", {
          sliceX: 1,
          sliceY: 1,
        }); 
        juegoKaplay.loadSprite("scarecrow", "sprites/scarecrow.png", {
          sliceX: 1,
          sliceY: 1,
        }); 
        juegoKaplay.loadSprite("heart", "sprites/heart.png", {
          sliceX: 1,
          sliceY: 1,
        });
        juegoKaplay.loadSprite("title-0", "prueba/title-0.png", {
          sliceX: 1,
          sliceY: 1,
        });


        juegoKaplay.loadSound("nivel2", "./oveja-dialogos/nivel2.wav");
        juegoKaplay.loadSound("aprobado", "./oveja-dialogos/aprobado.wav");
        juegoKaplay.loadSound("perdido", "./oveja-dialogos/perdido.wav");
        juegoKaplay.loadSound("fallaste", "./oveja-dialogos/fallaste.wav");
        juegoKaplay.loadSound("bien", "./oveja-dialogos/bien.wav");

        // Cargar sprites adicionales
        ["up", "down", "left", "right"].forEach((dir) => {
          juegoKaplay.loadSprite(dir, `sprites/${dir}-arrow.png`);
        });
  
        juegoKaplay.loadSprite("redbox", "red-border-box.png");
        
  
        juegoKaplay.onLoad(async () => {

            generarEsquemaMapa(
                juegoKaplay,
                {
                  nameFolder: "nivel1",
                  nameFile: "nivel1_mapeo.png",
                  tileWidth: TILED_WIDTH,
                  tileHeight: TILED_HEIGHT,
                  pos: juegoKaplay.vec2(0, 0),
                },
                `./nivel1/nivel1_mapeo.json`,
                [
                  {
                    urlTextura: "./nivel1/Water.png",
                    dimensionTexturasX: 2,
                    dimensionTexturasY: 2,
                    firstgid: 1
                  },
                  {
                    urlTextura: "./nivel1/Tilemap_Flat.png",
                    dimensionTexturasX: 20,
                    dimensionTexturasY: 8,
                    firstgid: 5
                  },
                  {
                    urlTextura: "./nivel1/Tilemap_Elevation.png",
                    dimensionTexturasX: 8,
                    dimensionTexturasY: 16,
                    firstgid: 165
                  },
                  {
                    urlTextura: "./nivel1/Tilemap_Flat.png",
                    dimensionTexturasX: 20,
                    dimensionTexturasY: 8,
                    firstgid: 5
                  },
                  {
                    urlTextura: "./nivel1/Tilemap_Flat.png",
                    dimensionTexturasX: 20,
                    dimensionTexturasY: 8,
                    firstgid: 5
                  },
                  {
                    urlTextura: "./nivel1/Bridge_All.png",
                    dimensionTexturasX: 6,
                    dimensionTexturasY: 8,
                    firstgid: 293
                  },
                  {
                    urlTextura: "./nivel1/Rocks_01.png",
                    dimensionTexturasX: 32,
                    dimensionTexturasY: 4,
                    firstgid: 341
                  },
                  {
                    urlTextura: "./nivel1/Rocks_04.png",
                    dimensionTexturasX: 32,
                    dimensionTexturasY: 4,
                    firstgid: 469
                  },
                  {
                    urlTextura: "./nivel1/Foam.png",
                    dimensionTexturasX: 48,
                    dimensionTexturasY: 6,
                    firstgid: 597
                  },
                ]
              ).then(
                (resultado: any) => {

                  async function terminarJuego () {
                    window.location.href = window.location.href
                  }

                  async function validarVidas(){

                      if (lives === 2){
                          juegoKaplay.destroy(heart1);
                      }

                      if(lives === 1){
                        juegoKaplay.destroy(heart2);
                      }

                      if( lives ===0 ){

                        
                        if(existeNivelUno){
                          const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                          
                          const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 1 && nivel.estatus === "APROBADO");
        
                          const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,1,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                          console.log(modificarResultado)
                        }else{
                          const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,1,"NO APROBADO")
                          console.log(cargarResultado)
                        }

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
                            reconocimiento_patrones: datosEstudiante.reconocimiento_patrones,
                            identificacion_errores: ( datosEstudiante.identificacion_errores !== "APROBADO") ? "EN PROCESO" : datosEstudiante.identificacion_errores,
                            abstraccion: datosEstudiante.abstraccion,
                            asociacion:datosEstudiante.asociacion,
                            construccion_algoritmos: ( datosEstudiante.construccion_algoritmos !== "APROBADO") ? "EN PROCESO" : datosEstudiante.construccion_algoritmos,
                            p_actividades_completadas: datosEstudiante.p_actividades_completadas,
                            tipo_premiacion: datosEstudiante.tipo_premiacion
                          }
                        
                          const respuestaEvaluacion = await cargarEvaluacionEstudiante(datosUsuario)
                          console.log(respuestaEvaluacion)
                                                                        
                        }else{
                          console.log("perdio PERO NO ES ESTUDIANTE")
                        }

                        juegoKaplay.destroy(heart3);
                        juegoKaplay.destroy(player)
                        cambiarGanarC(true); 
                        juegoKaplay.play("perdido", { volume: 1, speed: 1, loop: false });
                        setStateC(true);

                        await sleep(2000)

                        setStateC(false);

                        await sleep(2000)
                    
                        await terminarJuego();
                      };        
                  }
                  
                  cambiarGanarB(true);
                  juegoKaplay.play("nivel2", { volume: 1, speed: 1, loop: false });
                  setStateB(true);
                  setTimeout(() => {
                    setStateB(false);
                  }, 10000); 

                  console.log("Resultado de generar nivel 2")
                  console.log(juegoKaplay.get("*"))
                  console.log(juegoKaplay.get("player"))

                  const oveja = juegoKaplay.get("oveja")[0]
                 
                  const rock = juegoKaplay.get("rock")[0]
                  const ovejas= juegoKaplay.get("oveja")
                  const rocks= juegoKaplay.get("rock")
                  
                  const up = juegoKaplay.get("up")[0]
                  const down = juegoKaplay.get("down")[0]
                  const left = juegoKaplay.get("left")[0]
                  const right = juegoKaplay.get("right")[0]
                  const heart1 = juegoKaplay.get("heart1")[0]
                  const heart2 = juegoKaplay.get("heart2")[0]
                  const heart3 = juegoKaplay.get("heart3")[0]
                  const player = juegoKaplay.get("player")[0]
                  const zonasGolpe = juegoKaplay.get("square")
                  
                  const enemigos = juegoKaplay.get("enemy")
                  enemigos.forEach( (enemigo: GameObj<any>) => {

                    let squareDer = juegoKaplay.add([
                      juegoKaplay.pos(enemigo.pos.x + TILED_WIDTH, enemigo.pos.y),
                      juegoKaplay.scale(1),
                      juegoKaplay.area({shape: new juegoKaplay.Rect(juegoKaplay.vec2(0,0), TILED_WIDTH, TILED_HEIGHT), // Rectángulo más pequeño
                      }),
                      juegoKaplay.anchor("center"),
                      "square",
                      { z: 2 } // Asegura que el jugador esté en una capa superior
                    ]);
  
                    let squareIzq = juegoKaplay.add([
                      juegoKaplay.pos(enemigo.pos.x - TILED_WIDTH,enemigo.pos.y),
                      juegoKaplay.scale(1),
                      juegoKaplay.area({shape: new juegoKaplay.Rect(juegoKaplay.vec2(0,0), TILED_WIDTH, TILED_HEIGHT), // Rectángulo más pequeño
                      }),
                      juegoKaplay.anchor("center"),
                      "square",
                      { z: 2 } // Asegura que el jugador esté en una capa superior
                    ]);
      
                    squareDer.onCollide("player", async (jugador: any) => {
                        lives=lives-1;
                        //console.log(lives)
                        enemigo.play("right_a");
                        await validarVidas()

                        player.pos.x = posicionAnteriorXGlobal
                        player.pos.y = posicionAnteriorYGlobal
                       // Espera 2000 milisegundos (2 segundos)
                    });
 
                    squareIzq.onCollide("player", async (jugador: any) => {
                        lives=lives-1;
                        //console.log(lives)
                        enemigo.play("right_a");
                        await validarVidas()

                        player.pos.x = posicionAnteriorXGlobal
                        player.pos.y = posicionAnteriorYGlobal
                      
                    });

                    enemigo.onCollide("player", async (jugador: any) => {
                        console.log("CHOCO")

                        console.log("Posición después de presionar la tecla ", {
                          x: player.pos.x,
                          y: player.pos.y
                        })

                        lives--
                        await validarVidas()

                        player.pos.x = posicionAnteriorXGlobal
                        player.pos.y = posicionAnteriorYGlobal
                    })


                    
                  })

                  const colisiones = juegoKaplay.get("square-colision")
                  console.log(colisiones)
                  
                  console.log(heart1)
                  console.log(heart2)
                  console.log(heart3)

                  ovejas.forEach( (oveja: any) => {
                    oveja.play("quiet");
                    oveja.onCollide("player", async (jugador: GameObj) => {

                      
                      cambiarGanarA(true); 
                      setStateA(true);
                      juegoKaplay.play("aprobado", { volume: 1, speed: 1.5, loop: false });

                      

                      

                      
                      await sleep(2000)
                      

                      if(usuario.rol === "ESTUDIANTE"){

                        const obtenerDatosUsuario = async (estudiante_seleccionado: number) => {
            
                          const datosEstudiante = await fetch("http://localhost:5555/estudiantes/" + estudiante_seleccionado)
                          const resultadoConsulta = await datosEstudiante.json()
                          console.log(resultadoConsulta)

                          return resultadoConsulta

                        };

                        const datosEstudiante = await obtenerDatosUsuario(usuario.id_usuario);

                        const nivelesJugados = await obtenerNivelesUsuario(usuario.id_usuario);
                        console.log(nivelesJugados)
      
                        const ganoNivelUno = nivelesJugados.some( (nivel: any) => nivel.id_nivel === 1 && nivel.estatus === "APROBADO");
      
                        console.log(ganoNivelUno)
      
                        const porcentajeAumentado =
                        // Si el estudiante ya aprobó, se mantiene el porcentaje.
                        ganoNivelUno
                        ? datosEstudiante.p_actividades_completadas
                        // Si está en proceso o no ha jugado, se suma un 20%.
                        : datosEstudiante.p_actividades_completadas + 20;

                        console.log(datosEstudiante)

                        console.log(porcentajeAumentado)

                        console.log((contadorMovimientos <= 26) ? 100 : Math.ceil((26 / contadorMovimientos) * 100))
                
                        const datosUsuario: Evaluacion_Estudiante = {
                          id_estudiante: datosEstudiante.id_usuario,
                          eficiencia_algoritmica: (contadorMovimientos <= 26) ? 100 : Math.ceil((26 / contadorMovimientos) * 100),
                          reconocimiento_patrones: datosEstudiante.reconocimiento_patrones,
                          identificacion_errores: (datosEstudiante.identificacion_errores !== "APROBADO") ? "EN PROCESO" : datosEstudiante.identificacion_errores,
                          abstraccion: datosEstudiante.abstraccion,
                          asociacion: datosEstudiante.asociacion,
                          construccion_algoritmos:  (datosEstudiante.construccion_algoritmos !== "APROBADO") ? "EN PROCESO" : datosEstudiante.identificacion_errores,
                          p_actividades_completadas: porcentajeAumentado,
                          tipo_premiacion: datosEstudiante.tipo_premiacion // o string[], si es un arreglo
                        }

                        const respuestaEvaluacion = await cargarEvaluacionEstudiante(datosUsuario)
                        console.log(respuestaEvaluacion)
              
                      }else{
                        console.log("GANO PERO NO ES ESTUDIANTE")
                      }

                      if(existeNivelUno){
                          const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                          
                          const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 1 && nivel.estatus === "APROBADO");
        
                          const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,1,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                          console.log(modificarResultado)
                        }else{
                          const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,1,"APROBADO")
                          console.log(cargarResultado)
                        }
                  
                      await terminarJuego()
                      
                    })
              
                  })
    
                  rocks.forEach( (rock: any) => {
                    rock.play("quiet");
                  })

                  // Flechas


                  console.log(zonasGolpe)

                  const velocidad = 64;

                

                  // Movimiento con clic
                  up.onClick(() => {
                    console.log("PRESIONANDO FLECHA UP")
                    const objetoPosicionAnterior = {
                      x: player.pos.x,
                      y: player.pos.y
                    }

                    console.log("Posición antes de presionar la tecla ", objetoPosicionAnterior)

                    posicionAnteriorXGlobal = player.pos.x
                    posicionAnteriorYGlobal = player.pos.y


                    player.moveTo(posicionAnteriorXGlobal,posicionAnteriorYGlobal - TILED_HEIGHT);
                    player.play("up");
                    
                    colisiones.forEach( (colision: GameObj<any>) => {
                    
                      colision.onCollide("player", (jugador: any) => {

                        player.pos.x = posicionAnteriorXGlobal
                        player.pos.y = posicionAnteriorYGlobal

                        movimientoValido = false
                        
                      })

                    })

                    zonasGolpe.forEach( (zona: GameObj<any>) => {
                    
                      zona.onCollide("player", async (jugador: any) => {

                        player.pos.x = posicionAnteriorXGlobal
                        player.pos.y = posicionAnteriorYGlobal

                      })

                    })

                    if(movimientoValido){
                      contadorMovimientos = contadorMovimientos + 1;
                      console.log("MOVIMIENTO VALIDO - CONTADOR ", contadorMovimientos)
                    }else{
                      console.log("MOVIMIENTO INVALIDO - CONTADOR ", contadorMovimientos)
                      movimientoValido = true;
                    }
                    
                    
                  });
                  down.onClick(() =>{

                    console.log(player.pos.x)
                    console.log(player.pos.y)

                    posicionAnteriorXGlobal = player.pos.x
                    posicionAnteriorYGlobal = player.pos.y

                    player.moveTo(posicionAnteriorXGlobal,posicionAnteriorYGlobal + TILED_HEIGHT);
                    player.play("down");

                    colisiones.forEach( (colision: GameObj<any>) => {
                    
                      colision.onCollide("player", (jugador: any) => {
                        
                        player.pos.x = posicionAnteriorXGlobal
                        player.pos.y = posicionAnteriorYGlobal

                        movimientoValido = false

                      })

                    })

                    zonasGolpe.forEach( (zona: GameObj<any>) => {
                    
                      zona.onCollide("player", async (jugador: any) => {

                        player.pos.x = posicionAnteriorXGlobal
                        player.pos.y = posicionAnteriorYGlobal

                      })

                    })

                    if(movimientoValido){
                      contadorMovimientos = contadorMovimientos + 1;
                      console.log("MOVIMIENTO VALIDO - CONTADOR ", contadorMovimientos)
                    }else{
                      console.log("MOVIMIENTO INVALIDO - CONTADOR ", contadorMovimientos)
                      movimientoValido = true;
                    }

                  });
                  left.onClick(() => {
                    console.log(player.pos.x)
                    console.log(player.pos.y)

                    const posicionAnteriorX = player.pos.x
                    const posicionAnteriorY = player.pos.y

                    player.moveTo(posicionAnteriorX - TILED_WIDTH,posicionAnteriorY);
                    player.play("left");

                    colisiones.forEach( (colision: GameObj<any>) => {
                    
                      colision.onCollide("player", (jugador: any) => {
                        player.pos.x = posicionAnteriorX
                        player.pos.y = posicionAnteriorY

                        movimientoValido = false;
                      })

                    })

                    enemigos.forEach( (enemigo: GameObj<any>) => {
                    
                      enemigo.onCollide("player", (jugador: any) => {
                        player.pos.x = posicionAnteriorX
                        player.pos.y = posicionAnteriorY

                        movimientoValido = false;
                      })

                    })

                    zonasGolpe.forEach( (zona: GameObj<any>) => {
                    
                        zona.onCollide("player", async (jugador: any) => {

                          await sleep(100)
                          
                          player.pos.x = posicionAnteriorX
                          player.pos.y = posicionAnteriorY

                          movimientoValido = false;
                        })

                    })

                    if(movimientoValido){
                      contadorMovimientos = contadorMovimientos + 1;
                      console.log("MOVIMIENTO VALIDO - CONTADOR ", contadorMovimientos)
                    }else{
                      console.log("MOVIMIENTO INVALIDO - CONTADOR ", contadorMovimientos)
                      movimientoValido = false;
                    }

                  });
                  right.onClick(() =>{

                    posicionAnteriorXGlobal = player.pos.x
                    posicionAnteriorYGlobal = player.pos.y

                    player.moveTo(posicionAnteriorXGlobal + TILED_WIDTH,posicionAnteriorYGlobal);
                    player.play("right");

                    colisiones.forEach( (colision: GameObj<any>) => {
                    
                      colision.onCollide("player", (jugador: any) => {
                        player.pos.x = posicionAnteriorXGlobal
                        player.pos.y = posicionAnteriorYGlobal

                        movimientoValido = false

                      })

                    })

                    zonasGolpe.forEach( (zona: GameObj<any>) => {
                    
                      zona.onCollide("player", async (jugador: any) => {

                        player.pos.x = posicionAnteriorXGlobal
                        player.pos.y = posicionAnteriorYGlobal

                      })

                    })

                    if(movimientoValido){
                      contadorMovimientos = contadorMovimientos + 1;
                      console.log("MOVIMIENTO VALIDO - CONTADOR ", contadorMovimientos)
                    }else{
                      console.log("MOVIMIENTO INVALIDO - CONTADOR ", contadorMovimientos)
                      movimientoValido = true;
                    }
                    
                  });
                  
                
              }
              ).catch(
                ((error:any) => {
                  console.log(error)
                })
              )
  
  
        }) //Fin - Onload()

  }