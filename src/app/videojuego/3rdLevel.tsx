import { GameObj, KAPLAYCtx } from "kaplay";
import generarEsquemaMapa from "../../MapsGenerator";
import Evaluacion_Estudiante from "./interfaces/informacion_estudiante.interface";
import cargarEvaluacionEstudiante from "./functions/cargarEvaluacionEstudiante";
import cargarNivelUsuario from "./functions/cargarNivelUsuario";
import obtenerNivelesUsuario from "./functions/obtenerNivelesUsuario";
import modificarNivelUsuario from "./functions/modificarNivelUsuario";

export async function Nivel3(juegoKaplay:KAPLAYCtx<{},never>, setState3:any, cambiarGanar3:any, setStateA:any, cambiarGanarA:any,setStateC:any, cambiarGanarC:any, Router:any,usuario: any,jugoNiveles:boolean){

        function sleep(ms: number) {
          return new Promise(resolve => setTimeout(resolve, ms));   
        }

        let existeNivelTres = false
        if(jugoNiveles){
          const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
          console.log(nivelesUsuario)
          existeNivelTres = nivelesUsuario.some( (nivel: any) => nivel.id_nivel === 3);
        }else{
          console.log("NO HA JUGADO - PRIMERA VEZ")
        }


        let terminoJuego: boolean = false;
        
        

        let posicionAnteriorXGlobal = 0;
        let posicionAnteriorYGlobal= 0;

        const SCREEN_RESOLUTION_X: number = window.innerWidth 
        const SCREEN_RESOLUTION_Y: number = window.innerHeight 
        const TILED_MAP__WIDTH_NUMBER: number = 20
        const TILED_MAP_HEIGHT_NUMBER: number = 15
        const TILED_WIDTH: number = SCREEN_RESOLUTION_X / TILED_MAP__WIDTH_NUMBER
        const TILED_HEIGHT: number = SCREEN_RESOLUTION_Y / TILED_MAP_HEIGHT_NUMBER

        const NUMERO_MINIMO_MOVIMIENTOS: number = 26;
        let contadorMovimientos: number = 0;
        let movimientoValido: boolean = true;

        console.log("Comenzando a generar nivel 2")
        console.log(juegoKaplay.get("*"))

        let lives = 3
        let cantidadhongos = 0
        let barraPressed = 0

  
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
  
        juegoKaplay.loadSprite("enemigo", "sprites/TNT_Blue (1).png", {
          sliceX: 7,
          sliceY: 3,
          anims: {
            left_a: { from: 20, to: 14, loop: false },
            right_a: { from: 7, to: 13, loop: false },
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

        juegoKaplay.loadSprite("heart1", "sprites/heart.png", {
          sliceX: 1,
          sliceY: 1,
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

        juegoKaplay.loadSprite("hongo", "sprites/deco/hongo.png", {
          sliceX: 1,
          sliceY: 1,
        });

        juegoKaplay.loadSprite("torre", "sprites/buildings/Tower_Blue.png", {
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

        juegoKaplay.loadSprite("cartel", "sprites/cartel.jpeg", {
          sliceX: 1,
          sliceY: 1,
        });

        juegoKaplay.loadSound("nivel3", "./oveja-dialogos/nivel3.wav");
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
                  nameFolder: "nivel3",
                  nameFile: "nivel3.png",
                  tileWidth: TILED_WIDTH,
                  tileHeight: TILED_HEIGHT,
                  pos: juegoKaplay.vec2(0, 0),
                },
                `./nivel3/nivel3.json`,
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
                    urlTextura: "./nivel1/Tilemap_Flat.png",
                    dimensionTexturasX: 20,
                    dimensionTexturasY: 8,
                    firstgid: 5
                  },
                  {
                    urlTextura: "./nivel1/Bridge_All.png",
                    dimensionTexturasX: 6,
                    dimensionTexturasY: 8,
                    firstgid: 165
                  },
                  {
                    urlTextura: "./nivel1/Rocks_01.png",
                    dimensionTexturasX: 32,
                    dimensionTexturasY: 4,
                    firstgid: 213
                  },
                ]
              ).then(
                (resultado: any) => {

                  
                  cambiarGanar3(true);
                  juegoKaplay.play("nivel3", { volume: 1, speed: 1, loop: false });
                  setState3(true);

                  setTimeout(() => {
                    setState3(false);
                  }, 10000); 

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


                        if(existeNivelTres){
                          const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                          
                          const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 3 && nivel.estatus === "APROBADO");
        
                          const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,3,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                          console.log(modificarResultado)
                        }else{
                          const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,3,"NO APROBADO")
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
                                          identificacion_errores: "EN PROCESO",
                                          abstraccion: datosEstudiante.abstraccion,
                                          asociacion:datosEstudiante.asociacion,
                                          construccion_algoritmos: "EN PROCESO",
                                          p_actividades_completadas: datosEstudiante.p_actividades_completadas,
                                          tipo_premiacion: datosEstudiante.tipo_premiacion
                                        }
                                      
                                        const respuestaEvaluacion = await cargarEvaluacionEstudiante(datosUsuario)
                                        console.log(respuestaEvaluacion)
                                                                        
                                      }else{
                                        console.log("GANO PERO NO ES ESTUDIANTE")
                                      }

                        juegoKaplay.destroy(heart3);
                        juegoKaplay.destroy(player)
                        cambiarGanarC(true); 
                        setStateC(true);
                        juegoKaplay.play("perdido", { volume: 1, speed: 1, loop: false });
                        

                        await sleep(2000)

                        setStateC(false);

                        await sleep(500)
                    
                        await terminarJuego();
                      };        
                  }

                  
                  console.log("Resultado de generar nivel 2")
                  console.log(juegoKaplay.get("*"))
                  console.log(juegoKaplay.get("player"))
                  console.log(juegoKaplay.get("enemy"))


                  const player = juegoKaplay.get("player")[0]
                  const torre = juegoKaplay.get("torre")[0]
                  const colisionarbol = juegoKaplay.get("colisionarbol")
                  const rock = juegoKaplay.get("rocks")[0]
                  const oveja = juegoKaplay.get("oveja")[0]
                  const hongo = juegoKaplay.get("hongo")[0]
                  const enemigo = juegoKaplay.get("enemy")[0]
                  const arbol = juegoKaplay.get("arbol")[0]
                  const cartel = juegoKaplay.get("cartel")[0]
                  const heart1 = juegoKaplay.get("heart1")[0]
                  const heart2 = juegoKaplay.get("heart2")[0]
                  const heart3 = juegoKaplay.get("heart3")[0]
                  const up = juegoKaplay.get("up")[0]
                  const down = juegoKaplay.get("down")[0]
                  const left = juegoKaplay.get("left")[0]
                  const right = juegoKaplay.get("right")[0]

                  const arregloVidas: GameObj[] = []

                  arregloVidas.push(heart1)
                  arregloVidas.push(heart2)
                  arregloVidas.push(heart3)

                  console.log(oveja)
                  console.log(colisionarbol)
                  console.log(hongo)
                  console.log(rock)
                  console.log(up)
                  console.log(down)
                  console.log(left)
                  console.log(right)
                  console.log(heart1)
                  console.log(heart2)
                  console.log(heart3)
                  console.log(player)
                  console.log(enemigo)
                  console.log(juegoKaplay.get("enemy"))
                  console.log(arbol)
                  console.log(torre)
                  console.log(cartel)
                  console.log(enemigo.pos.x)
                  console.log(enemigo.pos.y)
                  oveja.play("quiet");
                  const enemigos = juegoKaplay.get("enemy")
                  const rocks = juegoKaplay.get("rock")
                  const arboles= juegoKaplay.get("arbol")
                  const colisiones = juegoKaplay.get("square-colision")
                  console.log(colisiones)


                  torre.onCollide("player", async (jugador: GameObj) => {
                    cambiarGanarA(true); 
                    juegoKaplay.play("aprobado", { volume: 1, speed: 1.5, loop: false });

                    

                    await sleep(2000)
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
    
                      const ganoNivelTres = nivelesJugados.some( (nivel: any) => nivel.id_nivel === 3 && nivel.estatus === "APROBADO");
    
                      console.log(ganoNivelTres)
    
                      const porcentajeAumentado =
                      // Si el estudiante ya aprobó, se mantiene el porcentaje.
                      ganoNivelTres
                      ? datosEstudiante.p_actividades_completadas
                      // Si está en proceso o no ha jugado, se suma un 20%.
                      : datosEstudiante.p_actividades_completadas + 20;

                      console.log(datosEstudiante)

                      console.log(porcentajeAumentado)
                      
                      
                      console.log((contadorMovimientos <= 26) ? 100 : Math.ceil((26 / contadorMovimientos) * 100))

                      const ganoIdenticacionErrores: string = 
                      (datosEstudiante.identificacion_errores !== "APROBADO" && datosEstudiante.reconocimiento_patrones == "APROBADO" && datosEstudiante.abstraccion == "APROBADO")
                      ? "APROBADO" 
                      :
                      ((datosEstudiante.identificacion_errores == "APROBADO") ? "APROBADO": "EN PROCESO");

                      const datosUsuario: Evaluacion_Estudiante = {
                        id_estudiante: datosEstudiante.id_usuario,
                        eficiencia_algoritmica: (contadorMovimientos <= (39)) ? Math.ceil(datosEstudiante.eficiencia_algoritmica + 100) / 2 : Math.ceil(datosEstudiante.eficiencia_algoritmica + Math.ceil((39 / contadorMovimientos) * 100)) / 2,
                        reconocimiento_patrones: datosEstudiante.reconocimiento_patrones,
                        identificacion_errores: ganoIdenticacionErrores,
                        abstraccion: datosEstudiante.abstraccion,
                        asociacion: "APROBADO",
                        construccion_algoritmos: "APROBADO",
                        p_actividades_completadas: porcentajeAumentado,
                        tipo_premiacion: datosEstudiante.tipo_premiacion
                      }
                    
                      const respuestaEvaluacion = await cargarEvaluacionEstudiante(datosUsuario)
                      console.log(respuestaEvaluacion)
                                  
                    }else{
                      console.log("GANO PERO NO ES ESTUDIANTE")
                    }

                    if(existeNivelTres){
                          const nivelesUsuario = await obtenerNivelesUsuario(usuario.id_usuario)
                          
                          const aproboNivelUno = nivelesUsuario.some((nivel: any) => nivel.id_nivel === 3 && nivel.estatus === "APROBADO");
        
                          const modificarResultado = await modificarNivelUsuario(usuario.id_usuario,3,(aproboNivelUno) ? "APROBADO" : "NO APROBADO")
                          console.log(modificarResultado)
                    }else{
                          const cargarResultado = await cargarNivelUsuario(usuario.id_usuario,3,"APROBADO")
                          console.log(cargarResultado)
                    }

                    await sleep(1000)
                    window.location.href = window.location.href
                    
                    
                  })
                  
                  setTimeout(() => {
                    hongo.onCollide("player", (jugador: any) => {
                        cantidadhongos++
                        console.log(cantidadhongos)
                      
                        hongo.destroy();
                    
                    });
                  }, 2000); // Espera 2000 milisegundos (2 segundos)

                  // Movimiento con teclado

                  arboles.forEach( (arbol: GameObj<any>) => {
                    arbol.play("quiet");
                  })
                  
                 

                  juegoKaplay.onKeyDown("space", () => {
                    if (cantidadhongos === 1) {
                      // Itera sobre la lista de árboles y destruye cada uno
                      arboles.forEach((arbol: GameObj<any>) => {
                        arbol.destroy();
                        
                      });

                      colisionarbol.forEach( (colision: GameObj<any>) => {
                        colision.destroy();
                      })
                      // Opcionalmente, puedes vaciar la lista de árboles si ya no los necesitas
                    }
                  });

                  rocks.forEach( (rock: GameObj<any>) => {
                    rock.play("quiet");
                  })

                  enemigos.forEach( (enemigo: GameObj<any>) => {

                    let squareDer = juegoKaplay.add([
                      juegoKaplay.pos(enemigo.pos.x + (TILED_WIDTH / 2),enemigo.pos.y - (TILED_HEIGHT / 2)+10),
                      juegoKaplay.scale(1),
                      juegoKaplay.area({shape: new juegoKaplay.Rect(juegoKaplay.vec2(0,0), TILED_WIDTH, TILED_HEIGHT-20), // Rectángulo más pequeño
                      }),
                      "square",
                      { z: 2 } // Asegura que el jugador esté en una capa superior
                    ]);
  
                    let squareIzq = juegoKaplay.add([
                      juegoKaplay.pos(enemigo.pos.x - 3*(TILED_WIDTH / 2),enemigo.pos.y - (TILED_HEIGHT / 2)+10),
                      juegoKaplay.scale(1),
                      juegoKaplay.area({shape: new juegoKaplay.Rect(juegoKaplay.vec2(0,0), TILED_WIDTH, TILED_HEIGHT-20), // Rectángulo más pequeño
                      }),
                      "square",
                      { z: 2 } // Asegura que el jugador esté en una capa superior
                    ]);

                    squareDer.onCollide("player", async (jugador: any) => {
                        lives=lives-1;
                        //console.log(lives)
                        enemigo.play("right_a");
                        await validarVidas()
                       // Espera 2000 milisegundos (2 segundos)
                    });
 
                    squareIzq.onCollide("player", async (jugador: any) => {
                        lives=lives-1;
                        //console.log(lives)
                        enemigo.play("right_a");
                        await validarVidas()
                      
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
                 
                  const velocidad = 64;
    
                  const zonasGolpe = juegoKaplay.get("square")
                  console.log(zonasGolpe)

                  // Movimiento con teclado
                  juegoKaplay.onKeyPress("w", () => {

                    const objetoPosicionAnterior = {
                      x: player.pos.x,
                      y: player.pos.y
                    }

                    console.log("Posición antes de presionar la tecla ", {
                      x: player.pos.x,
                      y: player.pos.y
                    })
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

                        await sleep(100)

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

                  juegoKaplay.onKeyPress("s", () => {

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

                        await sleep(100)
 
                        player.pos.x = posicionAnteriorXGlobal
                        player.pos.y = posicionAnteriorYGlobal

                        movimientoValido = false

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

                  juegoKaplay.onKeyPress("a", () => {

                  
                    posicionAnteriorXGlobal = player.pos.x
                    posicionAnteriorYGlobal = player.pos.y

                    player.moveTo(posicionAnteriorXGlobal - TILED_WIDTH,posicionAnteriorYGlobal);
                    player.play("left");

                    colisiones.forEach( (colision: GameObj<any>) => {
                    
                      colision.onCollide("player", (jugador: any) => {
                        player.pos.x = posicionAnteriorXGlobal
                        player.pos.y = posicionAnteriorYGlobal

                        movimientoValido = false

                      })

                    })

                    zonasGolpe.forEach( (zona: GameObj<any>) => {
                    
                        zona.onCollide("player", async (jugador: any) => {

                          await sleep(100)
                          
                          player.pos.x = posicionAnteriorXGlobal
                          player.pos.y = posicionAnteriorYGlobal

                          movimientoValido = false

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
                  
                  juegoKaplay.onKeyPress("d", async () => {

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

                          await sleep(100)
                      
                          player.pos.x = posicionAnteriorXGlobal
                          player.pos.y = posicionAnteriorYGlobal

                          movimientoValido = false

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

                  // Movimiento con clic
                  up.onClick(() => {

                    console.log(player.pos.x)
                    console.log(player.pos.y)

                    const posicionAnteriorX = player.pos.x
                    const posicionAnteriorY = player.pos.y

                    player.moveTo(posicionAnteriorX,posicionAnteriorY - TILED_HEIGHT);
                    player.play("up");
                    
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
                    });

                    if(movimientoValido){
                      contadorMovimientos = contadorMovimientos + 1;
                      console.log("MOVIMIENTO VALIDO - CONTADOR ", contadorMovimientos)
                    }else{
                      console.log("MOVIMIENTO INVALIDO - CONTADOR ", contadorMovimientos)
                      movimientoValido = false;
                    }

                  });
                  down.onClick(() => {
                    console.log(player.pos.x)
                    console.log(player.pos.y)

                    const posicionAnteriorX = player.pos.x
                    const posicionAnteriorY = player.pos.y

                    player.moveTo(posicionAnteriorX,posicionAnteriorY + TILED_HEIGHT);
                    player.play("down");

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
                  right.onClick(() => {
                    console.log(player.pos.x)
                    console.log(player.pos.y)

                    const posicionAnteriorX = player.pos.x
                    const posicionAnteriorY = player.pos.y

                    player.moveTo(posicionAnteriorX + TILED_WIDTH,posicionAnteriorY);
                    player.play("right");

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

                  enemigo.play("quiet")
                 
                  player.onDeath(() => {
                    juegoKaplay.destroy(player);
                  });
                  
    
                  console.log("IMPRIMIENDO COORDENADAS DE JUGADOR")
                  console.log({
                    1: {x: player.pos.x, y: 0},
                    2: {x: player.pos.x + player.width, y: 0},
                    3: {x:0,y:player.pos.y + player.height},
                    4: {x: player.pos.x + player.width, y: player.pos.y + player.height}
                  })
                  
                  player.onCollide("redRoom", (redRoom:any) => {
                    console.log("SIGUIENTE NIVEl")
                    
                    juegoKaplay.tween(
                      juegoKaplay.camPos().x, 
                          redRoom.pos.x + redRoom.width + 1920/ 2, 
                          1, 
                          (value:any) => juegoKaplay.camPos(value, juegoKaplay.camPos().y), 
                          juegoKaplay.easings.linear
                    )
                    
                  })
    
                }
              ).catch(
                ((error:any) => {
                  console.log(error)
                })
              )
  
  
        }) //Fin - Onload()

  }