/*
const nivelPrincipal = generarEsquemaMapa(
    juegoKaplay,
    {
      tileWidth: TILED_WIDTH,
      tileHeight: TILED_HEIGTH,
      pos: juegoKaplay.vec2(0, 0),
    },
    `./nivel2/prueba2.json`,
    
    [
      {
        urlTextura: "./nivel2/Water.png",
        dimensionTexturasX: 2,
        dimensionTexturasY: 2,
        firstgid: 1
      },
      {
        urlTextura: "./nivel2/Tilemap_Flat.png",
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
        urlTextura: "./nivel2/Tilemap_Flat.png",
        dimensionTexturasX: 20,
        dimensionTexturasY: 8,
        firstgid: 5
      }
    ]
  )
 .then(
             (resultado: any) => {
               // Jugador
 
               const player = juegoKaplay.add([
                 juegoKaplay.pos(1300,50 ),
                 juegoKaplay.sprite("knight"),
                 juegoKaplay.scale(2),
                 juegoKaplay.body(),
                 juegoKaplay.area({shape: new juegoKaplay.Rect(juegoKaplay.vec2( 30,20 ), 60, 60), // Rectángulo más pequeño
                 }),
                 juegoKaplay.health(3),
                 "player",
                 { z: 1 } // Asegura que el jugador esté en una capa superior
               ]);
 
               const live1 = juegoKaplay.add([
                 juegoKaplay.pos(220,20),
                 juegoKaplay.sprite("heart"),
                 juegoKaplay.scale(4),
                 juegoKaplay.area({shape: new juegoKaplay.Rect(juegoKaplay.vec2( 10,5), 15, 20), // Rectángulo más pequeño
                 }),
                 juegoKaplay.body(),
                 "heart1",
                 { z: 1 } // Asegura que el jugador esté en una capa superior
               ]);
 
               const live2 = juegoKaplay.add([
                 juegoKaplay.pos(350,20),
                 juegoKaplay.sprite("heart"),
                 juegoKaplay.scale(4),
                 juegoKaplay.area({shape: new juegoKaplay.Rect(juegoKaplay.vec2( 10,5), 15, 20), // Rectángulo más pequeño
                 }),
                 juegoKaplay.body(),
                 "heart2",
                 { z: 1 } // Asegura que el jugador esté en una capa superior
               ]);
 
               
               const live3 = juegoKaplay.add([
                 juegoKaplay.pos(480,20),
                 juegoKaplay.sprite("heart"),
                 juegoKaplay.scale(4),
                 juegoKaplay.area({shape: new juegoKaplay.Rect(juegoKaplay.vec2( 10,5), 15, 20), // Rectángulo más pequeño
                 }),
                 juegoKaplay.body(),
                 "heart3",
                 { z: 1 } // Asegura que el jugador esté en una capa superior
               ]);
 
               // Flechas
               const arrows = {
                 up: juegoKaplay.add([
                   juegoKaplay.pos(0, (juegoKaplay.center().y)/8),
                   juegoKaplay.sprite("up"),
                   juegoKaplay.scale(2),
                   juegoKaplay.area(),
                   { z: 1 } // Asegura que el jugador esté en una capa superior
                 ]),
                 down: juegoKaplay.add([
                   juegoKaplay.pos(0 ,(juegoKaplay.center().y)/4),
                   juegoKaplay.sprite("down"),
                   juegoKaplay.scale(2),
                   juegoKaplay.area(),
                   { z: 1 } // Asegura que el jugador esté en una capa superior
                 ]),
                 left: juegoKaplay.add([
                   juegoKaplay.pos(0,(juegoKaplay.center().y)/2),
                   juegoKaplay.sprite("left"),
                   juegoKaplay.scale(2),
                   juegoKaplay.area(),
                   { z: 1 } // Asegura que el jugador esté en una capa superior
                 ]),
                 right: juegoKaplay.add([
                   juegoKaplay.pos(0,(juegoKaplay.center().y)),
                   juegoKaplay.sprite("right"),
                   juegoKaplay.scale(2),
                   juegoKaplay.area(),
                   { z: 1 } // Asegura que el jugador esté en una capa superior
                 ]),
               };
 
               const velocidad = 440;
 
               // Movimiento con teclado
               juegoKaplay.onKeyDown("w", () => {
                 player.move(0, -velocidad);
               });
               juegoKaplay.onKeyDown("s", () => {
                 player.move(0, velocidad);
               });
               juegoKaplay.onKeyDown("a", () => {
                 player.move(-velocidad, 0);
               });
               juegoKaplay.onKeyDown("d", () => {
                 player.move(velocidad, 0);
               });
 
               // Movimiento con clic
               arrows.up.onClick(() => {
                 player.move(0, -velocidad);
                 player.play("up");
               });
               arrows.down.onClick(() => {
                 player.move(0, velocidad);
                 player.play("down");
               });
               arrows.left.onClick(() => {
                 player.move(-velocidad, 0);
                 player.play("left");
               });
               arrows.right.onClick(() => {
                 player.move(velocidad, 0);
                 player.play("right");
               });
 
 
 
               juegoKaplay.onCollide("player", "square-colision",(self:any, other:any) => {
                 console.log("Colisión detectada con:");
 
                 console.log(other)
                 if (player.pos.x + player.width * (1920 / ORIGINAL_GAME_SCREEN_X ) >= other.pos.x && 
                   player.pos.x <  other.pos.x && 
                   player.pos.y + player.height *(1080 / ORIGINAL_GAME_SCREEN_Y)>  other.pos.y && 
                   player.pos.y <  other.pos.y + other.height) {
                   console.log("Colisión con el borde izquierdo del objeto");
                   player.move(-100,0)
                 }
                 if (player.pos.x <= other.pos.x + other.width * (1920 / ORIGINAL_GAME_SCREEN_X ) && 
                   player.pos.y + player.width* (1920 / ORIGINAL_GAME_SCREEN_X ) > other.pos.x + other.width* (1920 / ORIGINAL_GAME_SCREEN_Y ) && 
                   player.pos.y + player.height*(1080 / ORIGINAL_GAME_SCREEN_Y) > other.pos.y && 
                   player.pos.y < other.pos.y + other.height*(1080 / ORIGINAL_GAME_SCREEN_Y)) {
                   console.log("Colisión con el borde derecho del objeto");
                   player.move(100,0)
                 }
                 if (player.pos.y + player.height*(1080 / ORIGINAL_GAME_SCREEN_Y) >= other.pos.y && 
                   player.pos.y < other.pos.y && 
                   player.pos.x + player.width* (1920 / ORIGINAL_GAME_SCREEN_X ) > other.pos.x && 
                   player.pos.x < other.pos.x + other.width* (1920 / ORIGINAL_GAME_SCREEN_X )) {
                   console.log("Colisión con el borde superior del objeto");
                   player.move(0,100)
                 }
                 if (player.pos.y <= other.pos.y + other.height*(1080 / ORIGINAL_GAME_SCREEN_Y) && 
                   player.pos.y + player.height *(1080 / ORIGINAL_GAME_SCREEN_Y)> other.pos.y + other.height*(1080 / ORIGINAL_GAME_SCREEN_Y) && 
                   player.pos.x + player.width* (1920 / ORIGINAL_GAME_SCREEN_X ) > other.pos.x && 
                   player.pos.x < other.pos.x + other.width * (1920 / ORIGINAL_GAME_SCREEN_X )) {
                   console.log("Colisión con el borde inferior del objeto");
                   player.move(0,-100)
               }
               
               
               
               });
 
               enemy.play("quiet")

               // Intentando eliminar las vidas
               juegoKaplay.onUpdate(()=>{
                 if (lives==2){
                   juegoKaplay.destroy(live1);
                 }else if(lives==1){
                   juegoKaplay.destroy(live2);
                 }else if(lives==0){
                   juegoKaplay.destroy(live3);
                 };
               })
 
               player.onDeath(() => {
                 juegoKaplay.destroy(player);
               });
              
             }
           ).catch(
             ((error:any) => {
             })
           )   
  */