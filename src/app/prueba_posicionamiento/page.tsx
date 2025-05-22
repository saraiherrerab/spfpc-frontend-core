'use client'

import { useEffect, useRef } from "react";
import kaplay from "kaplay";
import generarEsquemaMapa from "../../MapsGenerator";

let SCREEN_RESOLUTION_X: number = 0;
let SCREEN_RESOLUTION_Y: number = 0;
 
function Page() {

   const juegoKaplayRef = useRef<any>(null);
 
   useEffect(() => {
    SCREEN_RESOLUTION_X = window.innerWidth 
    SCREEN_RESOLUTION_Y = window.innerHeight 
    const resizeCanvas = () => {
      const canvas = document.getElementById("game") as HTMLCanvasElement;
      if (canvas) {
        canvas.width = window.innerWidth 
        canvas.height = window.innerHeight 
      }
    };
     
     
     // Inicializar Kaplay solo si no está creado
     if (!juegoKaplayRef.current) {
       juegoKaplayRef.current = kaplay({
         letterbox: false,
         global: false,
         debug: true, // Cambiar a false en producción
         debugKey: "f1",
         canvas: document.getElementById("game") as HTMLCanvasElement,
         pixelDensity: 1,
       });
 
       const juegoKaplay = juegoKaplayRef.current;
       juegoKaplay.setBackground(71,171,169)
       juegoKaplay.loadRoot("./");

       juegoKaplay.loadSprite("title-0", "prueba/title-0.png", {
        sliceX: 1,
        sliceY: 1,
       });

      juegoKaplay.loadSprite("pawn", "sprites/characters/Pawn_Purple.png", {
        sliceX: 6,
        sliceY: 6,
        anims: {
          right: { from: 18, to: 23, loop: false },
          quiet: { from: 0, to: 0, loop: false },
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

        let SCREEN_RESOLUTION_X = window.innerWidth;
        let SCREEN_RESOLUTION_Y = window.innerHeight;

        const TILED_MAP__WIDTH_NUMBER: number = 20
        const TILED_MAP_HEIGHT_NUMBER: number = 15

        const TILED_WIDTH: number = SCREEN_RESOLUTION_X / TILED_MAP__WIDTH_NUMBER
        const TILED_HEIGHT: number = SCREEN_RESOLUTION_Y / TILED_MAP_HEIGHT_NUMBER

        juegoKaplay.onLoad(async () => {
            //Practicando aqui
            SCREEN_RESOLUTION_X = window.innerWidth 
            SCREEN_RESOLUTION_Y = window.innerHeight 
    
          const nivelPrincipal = generarEsquemaMapa(
            juegoKaplay,
            {
              nameFolder: "prueba",
              nameFile: "mapa_de_prueba.png",
              tileWidth: TILED_WIDTH,
              tileHeight: TILED_HEIGHT,
              pos: juegoKaplay.vec2(0, 0),
            },
            `./prueba/mapa_de_prueba.json`,   //archivo de donde voy a extraer el mapa
            
            [ //Aca lo importante es que debo introducir el orden de las texturas en el que va, capa por capa
                {
                    urlTextura: "./nivel2/Tilemap_Flat.png",
                    dimensionTexturasX: 20,
                    dimensionTexturasY: 8,
                    firstgid: 1 //(esta comienza en 5)
                }
            ]
          )
          .then(
            async (resultado: any) => {

                console.log('Dimensiones de la pantalla: ', window.innerWidth, " ", window.innerHeight);

                //El mapa tiene unas proporciones de 20 x 15 cuadrados 
            
                console.log('Dimensiones de cada cuadrado: ', TILED_WIDTH, " ", TILED_HEIGHT);

                const prueba_de_ubicacion_x: number = TILED_WIDTH / 2
                const prueba_de_ubicacion_y: number = TILED_HEIGHT / 2

                const player = juegoKaplay.add([
                    juegoKaplay.pos(prueba_de_ubicacion_x ,prueba_de_ubicacion_y ),
                    juegoKaplay.sprite("knight"),
                    juegoKaplay.scale(1),
                    juegoKaplay.area({shape: new juegoKaplay.Rect(juegoKaplay.vec2(0,0), 64, 64)}),
                    juegoKaplay.body(),
                    juegoKaplay.anchor("center"), // 🔥 Centra el sprite Y sus componentes
                    "player",
                    { z: 1 } // Asegura que el jugador esté en una capa superior
                ]);

                player.play("right");

                await new Promise(resolve => setTimeout(resolve, 1000));

                player.moveTo(prueba_de_ubicacion_x + (TILED_WIDTH * 2),prueba_de_ubicacion_y)

                await new Promise(resolve => setTimeout(resolve, 1000));

                player.moveTo(prueba_de_ubicacion_x + (TILED_WIDTH * 4),prueba_de_ubicacion_y)

            }).catch(
                ((error:any) => {
                  console.log("lerolerolero")
                })
            )   
      
      
        }) //Fin - Onload()
    }
   
    resizeCanvas(); // Ajustar en la carga inicial
 
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
     
  }, []);
 

 
   return (
   
         
            <canvas id="game" />

    )
     
 
}
 
 
 
 export default Page;