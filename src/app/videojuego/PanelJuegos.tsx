import { KAPLAYCtx } from "kaplay";
import generarEsquemaMapa from "../../MapsGenerator";
import { Nivel1 } from "./1stLevel";
import { Nivel2 } from "./2ndLevel";
import {Nivel3} from "./3rdLevel";
import {Nivel4} from "./4thLevel";
import {Nivel5} from "./5thLevel";
import sleep from "./functions/sleep";
import obtenerNivelesUsuario from "./functions/obtenerNivelesUsuario";

export async function Panel(juegoKaplay:KAPLAYCtx<{},never>, setState:any, cambiarGanar:any,cambiarGanar3:any,setState3:any, cambiarGanarA:any, setStateA:any, 
  cambiarGanarB:any, setStateB:any,cambiarGanarC:any, setStateC:any,cambiarGanar1:any,setState1:any, setStateI:any,cambiarGanarI:any, setStateIni:any,cambiarGanarIni:any, setState5:any,cambiarGanar5:any,     Router:any, usuario?: any) {
    // Referencia persistente para almacenar la instancia de Kaplay
    const SCREEN_RESOLUTION_X: number = window.innerWidth 
    const SCREEN_RESOLUTION_Y: number = window.innerHeight 
    const TILED_MAP__WIDTH_NUMBER: number = 21
    const TILED_MAP_HEIGHT_NUMBER: number = 16
    const TILED_WIDTH: number = SCREEN_RESOLUTION_X / TILED_MAP__WIDTH_NUMBER
    const TILED_HEIGHT: number = SCREEN_RESOLUTION_Y / TILED_MAP_HEIGHT_NUMBER

    let jugoNiveles = false
    let nivelesUsuario: any[] = []
     

    
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

    juegoKaplay.loadSprite("knight", "sprites/p_knight_official.png", {
      sliceX: 6,
      sliceY: 8,
      anims: {
        right: { from: 6, to: 11, loop: true},
        up: { from: 36, to: 38, loop: true },
        down: { from: 24, to: 26, loop: true },
        left: { from: 5, to: 1, loop: true },
        quiet: { from: 31, to: 31, loop: true },
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

    juegoKaplay.loadSprite("castillo", "sprites/buildings/Castle_Blue.png", {
      sliceX: 1,
      sliceY: 1,
    });

    juegoKaplay.loadSprite("torre", "sprites/buildings/Tower_Blue.png", {
      sliceX: 1,
      sliceY: 1,
    });

    juegoKaplay.loadSprite("oveja", "sprites/deco/HappySheep_Bouncing.png", {
      sliceX: 6,
      sliceY: 1,
      anims: {
        quiet: { from: 0, to: 5, loop: true },
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

    juegoKaplay.loadSprite("hongo", "sprites/deco/hongo.png", {
      sliceX: 1,
      sliceY: 1,
    });

    juegoKaplay.loadSprite("torre1", "sprites/buildings/Tower_Yellow.png", {
      sliceX: 1,
      sliceY: 1,
    });

    juegoKaplay.loadSprite("casa", "sprites/buildings/House_Yellow.png", {
      sliceX: 1,
      sliceY: 1,
    });

    juegoKaplay.loadSprite("casa1", "sprites/buildings/House_Blue.png", {
      sliceX: 1,
      sliceY: 1,
    });

    // Cargar sprites adicionales
    ["up", "down", "left", "right"].forEach((dir) => {
      juegoKaplay.loadSprite(dir, `sprites/${dir}-arrow.png`);
    });

    juegoKaplay.loadSprite("redbox", "red-border-box.png");

    if(usuario.id_usuario !== 0){

      const nivelesJugados = await obtenerNivelesUsuario(usuario.id_usuario)

      nivelesUsuario = [...nivelesJugados]
      console.log(nivelesUsuario)

      if(nivelesUsuario.length > 0 ){
        jugoNiveles = true
      }

      console.log("jugoNiveles: ", jugoNiveles )

      console.log(usuario)
      if(usuario.rol === "ESTUDIANTE"){
        console.log("ESTUDIANTE DETECTADO")
        /* Aqui valido que niveles a pasado */
        
      }else{
        console.log("NO ES ESTUDIANTE")
      }
    }

    
    juegoKaplay.onLoad(() => {
        //Practicando aqui
      generarEsquemaMapa(
        juegoKaplay,
        {
          nameFolder: "panel",
          nameFile: "panel.png",
          tileWidth: TILED_WIDTH,
          tileHeight: TILED_HEIGHT,
          pos: juegoKaplay.vec2(0, 0),
        },
        `./panel/panelv.json`,   //archivo de donde voy a extraer el mapa
        
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
          {
            urlTextura: "./nivel2/Tilemap_Elevation.png",
            dimensionTexturasX: 8,
            dimensionTexturasY: 16,
            firstgid: 165
          },
          {
            urlTextura: "./nivel2/Tilemap_Flat.png",
            dimensionTexturasX: 20,
            dimensionTexturasY: 8,
            firstgid: 5 //(esta comienza en 5)
          },
          {
            urlTextura: "./nivel1/Bridge_All.png",
            dimensionTexturasX: 6,
            dimensionTexturasY: 8,
            firstgid: 293 //(esta comienza en 5)
          }         
        ]
      )
      .then(
        async (resultado: any) => {

            cambiarGanarIni(true);
            
            setStateIni(true);
        

          const oveja = juegoKaplay.get("oveja")[0]
          const arboles= juegoKaplay.get("arbol")
          const hongo = juegoKaplay.get("hongo")[0]
          const rock = juegoKaplay.get("rock")[0]
          const casa1 = juegoKaplay.get("casa1")[0]
          const casa = juegoKaplay.get("casa")[0]
          const arbol = juegoKaplay.get("arbol")[0]
          const torre1 = juegoKaplay.get("torre1")[0]
          const player = juegoKaplay.get("player")[0]
          const torre = juegoKaplay.get("torre")[0]
          const castillo = juegoKaplay.get("castillo")[0]
          const ovejas= juegoKaplay.get("oveja")
          const rocks= juegoKaplay.get("rock")
          const hongos= juegoKaplay.get("hongo")
          const zonaInvisible= juegoKaplay.get("botonInvisible")[0]

          const restriccion1= juegoKaplay.get("restriccion1")
          const restriccion2= juegoKaplay.get("restriccion2")
          const restriccion3= juegoKaplay.get("restriccion3")



          console.log(restriccion1)
          console.log(restriccion2)
          console.log(restriccion3)

          let estatusActual = null

          let aproboNivel1 = false;
          let aproboNivel2 = false;
          let aproboNivel3 = false;
          let aproboNivel4 = false;
          let aproboNivel5 = false;

          

          if(jugoNiveles && nivelesUsuario.length > 0){
            nivelesUsuario.forEach( (nivel) => {
              if(nivel.id_nivel === 1 && nivel.estatus === "APROBADO"){
                aproboNivel1 = true
              }
              if(nivel.id_nivel === 2 && nivel.estatus === "APROBADO"){
                aproboNivel2 = true
              }
              if(nivel.id_nivel === 3 && nivel.estatus === "APROBADO"){
                aproboNivel3 = true
              }
              if(nivel.id_nivel === 4 && nivel.estatus === "APROBADO"){
                aproboNivel4 = true
              }
            })
          }

          if(aproboNivel1 && aproboNivel2){
            console.log("LIBERAR NIVEL 3 y 4")
            restriccion1.forEach ( (restriccion) => {
              restriccion.destroy()
            })
            restriccion2.forEach ( (restriccion) => {
              restriccion.destroy()
            })

          }else{
            console.log("NO HA PASADO EL PRIMER Y SEGUNDO NIVEL")
          }

          if(aproboNivel3 && aproboNivel4){
            console.log("LIBERAR NIVEL 5")
            restriccion3.forEach ( (restriccion) => {
              restriccion.destroy()
            })
          }else{
            console.log("NO HA PASAOD EL TERCER Y CUARTO NIVEL")
          }


           ovejas.forEach( (oveja: any) => {
                oveja.play("quiet");
          
            })

            rocks.forEach( (rock: any) => {
              rock.play("quiet");
        
          })

          castillo.onCollide("player", ()=>{
            juegoKaplay.destroy(torre);
            juegoKaplay.destroy(castillo);
            juegoKaplay.destroy(player);
            juegoKaplay.destroyAll("*");
            Nivel3(juegoKaplay, setState3, cambiarGanar3,cambiarGanarA, setStateA,cambiarGanarC, setStateC, Router,usuario,jugoNiveles);
            // We pass the component id for remove it.
          });

          casa1.onCollide("player",()=>{
            juegoKaplay.destroy(torre);
            juegoKaplay.destroy(castillo);
            juegoKaplay.destroy(player);
            juegoKaplay.destroyAll("*");
            Nivel1(juegoKaplay, setState, cambiarGanar, setStateA, cambiarGanarA,setState1, cambiarGanar1,setStateI, cambiarGanarI,setStateC, cambiarGanarC, Router,usuario,jugoNiveles);
            // We pass the component id for remove it.
          });

          casa.onCollide("player",()=>{
            juegoKaplay.destroy(torre);
            juegoKaplay.destroy(castillo);
            juegoKaplay.destroy(player);
            juegoKaplay.destroyAll("*");
            Nivel2(juegoKaplay, setStateB, cambiarGanarB, setStateA, cambiarGanarA,cambiarGanarC, setStateC, Router,usuario,jugoNiveles);
            // We pass the component id for remove it.
          });

          torre.onCollide("player",()=>{
            juegoKaplay.destroy(torre);
            juegoKaplay.destroy(castillo);
            juegoKaplay.destroy(player);
            juegoKaplay.destroyAll("*");
            Nivel4(juegoKaplay, setState, cambiarGanar, setStateA, cambiarGanarA,setState1, cambiarGanar1,setStateC, cambiarGanarC,setStateI, cambiarGanarI, Router,usuario,jugoNiveles);
            // We pass the component id for remove it.
          });

          torre1.onCollide("player",()=>{
            juegoKaplay.destroy(torre);
            juegoKaplay.destroy(castillo);
            juegoKaplay.destroy(player);
            juegoKaplay.destroyAll("*");
            Nivel5(juegoKaplay, setState5, cambiarGanar5, setStateA, cambiarGanarA,setStateC, cambiarGanarC, Router,usuario,jugoNiveles);
            // We pass the component id for remove it.
          });

          juegoKaplay.onKeyPress("space", () => {
            juegoKaplay.play("bien",{ volume: 1, speed: 1.5, loop: false })
          
          });

          
      
          const velocidad = 200;

          //juegoKaplay.onUpdate(()=>{
                    // Movimiento con teclado


          juegoKaplay.onKeyPress("w", () => {
            player.play("up");
            ///player.move(0, -velocidad);
            
          });
          juegoKaplay.onKeyDown("w", () => {
            //  player.play("up");
              player.move(0, -velocidad);
              
            });
            
                        arboles.forEach( (arbol: any) => {
                               arbol.play("quiet");
           
                             })
                             

          juegoKaplay.onKeyRelease(()=>{
            player.play("quiet");

          })  

          juegoKaplay.onKeyDown("s", () => {
            player.move(0, velocidad);
            
          });

          juegoKaplay.onKeyPress("s", () => {
            player.play("down");
            ///player.move(0, -velocidad);
            
          });

          juegoKaplay.onKeyDown("a", () => {
            player.move(-velocidad, 0);
            
          });

          juegoKaplay.onKeyPress("a", () => {
            player.play("left");
            ///player.move(0, -velocidad);
            
          });

          juegoKaplay.onKeyDown("d", () => {
            player.move(velocidad, 0);
            
          });
          juegoKaplay.onKeyPress("d", () => {
            player.play("right");
            ///player.move(0, -velocidad);
            
          });
      
                   // })
      
             
                  
                    

                  }
      ).catch(
        ((error:any) => {
        console.log(error)
        })
      )   

      const velocidad = 440;



    

    }) //Fin - Onload()
    
}
