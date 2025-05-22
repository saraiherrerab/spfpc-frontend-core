import { Asset, KAPLAYCtx, SpriteData, Vec2 } from "kaplay";
import devolverSiguienteNumeroValido from "./utils/generarSiguienteNumeroValido";


    /* Bitacora de Luis (Nota número 1 para mi amorcito): Empecé a comentar las secciones de código que he hecho para explicarte que 
    voy haciendo mi amor precioso, así vas entendiendo que es lo que busque lograr con cada implementación y tengas una base para explorar
    todas las funciones del código.
    
    La función "generarEsquemaMapa() se encarga de leer las representaciones del mundo generadas por Tiled (en formato JSON) para imprimir ese mapa
    en la pantalla. Estos mapas contienen propiedades importantes (a las que puedes acceder con punto al ser objetos, ejemplo: world.layer.data), entre ellas
    las más importante es la propiedad "layers" que contiene todas las capas de ese mundo, así mismo, cada capa tiene un atributo "data" que contiene el ID 
    de cada fracción de imagen que se genera cuando cargamos el conjunto de patrones en Tiled.

    
    */


    const TILED_HEIGTH_NUMBER:number = 15

    interface informacionNivel {
      urlTextura: string,
      dimensionTexturasX: number,
      dimensionTexturasY: number,
      firstgid: number
    }

    const TILED_MAP__WIDTH_NUMBER: number = 21

    const generarEsquemaMapa = async (
      
    contextoKaplay: KAPLAYCtx<{},never>, // contextoKaplay es el objeto que representa todo el juego y se obtiene de la función "kaplay()"
    configuracionMapa: { nameFolder: string, nameFile: string,tileWidth: number,tileHeight: number,pos: Vec2,}, // la configuración del mapa representa las dimensiones que debe tener cada cuadro y la posición del primero para empezar a dibujar
    urlMapa: string, //Es la URL en la que se encuentra la carpeta con las imagenes del mapa en formato JSON
    informacionMapa: informacionNivel[], //Contiene en orden todas las imagenes que se utilizaron en cada capa para generar el mundo.
    dimesionesMapaX: number = 20,
    dimesionesMapaY: number = 15,
  ) : Promise<any> => {
  
    return fetch(urlMapa).then(
      (res) => res.json()
    )
    .then(
      (worldJson:any) => {

        console.log("LLAMANDO A LA FUNCION GENERAR MAPA")


        contextoKaplay.loadSprite("mundo", `${configuracionMapa.nameFolder}/${configuracionMapa.nameFile}`, {
          sliceX: 1,
          sliceY: 1,
        });

        contextoKaplay.onDraw(() => {
          contextoKaplay.drawSprite({
            sprite: "mundo",
            width: window.innerWidth,
            height: window.innerHeight
          });
        });
 


        //Extraemos los arreglos que contienen el firtsgid (Posición donde comienzan cada una de las imagenes de cada capa)
        const tilesetOrder: any= informacionMapa
  
        //cargamos todas las texturas que seran usadas para generar el mapa en orden
        const spritesCargados:  Asset<SpriteData>[] = []
        informacionMapa.forEach( (informacionNivel: informacionNivel, index: number) => {
            spritesCargados.push(contextoKaplay.loadSprite(`tiles-${index+1}`, informacionNivel.urlTextura, {
              sliceX: informacionNivel.dimensionTexturasX,
              sliceY: informacionNivel.dimensionTexturasY,
            })
          )
        })
  
        const anchoCuadrado: number = window.innerWidth / worldJson.width
        const altoCuadrado: number = window.innerHeight / worldJson.height
      
        const tileMap: { [key: string] : number}[] = [{}]
  
        const valoresProhibidos: number[] = [39,48,49,50,51,52,53,54,55,56,57]
  
        const mapaGenerado = worldJson?.layers
  
        //Luego para cada CAPA que contiene números que no pueden ser procesados por el generador de niveles
        //Es necesario que realizacemos una reasignación con un caracter ASCII, tomando en cuenta que hay caracteres que 
        //No pueden ser procesados como una cadena (Valores Prohibidos)
        mapaGenerado.forEach((layer:any, numeroLayer: number) => {
          //Para cada capa inicializamos un contador que contiene el código ASCII del "$" para reemplazarlo en el caso de que el número
          //extraido sea mayor a 9
          let contador = 36;
  
          if(layer.type === "tilelayer"){
  
            //Luego por cada uno de los números que representan una capa realizamos lo siguiente:
            if (Array.isArray(layer.data) && layer.data.length > 0) {
              console.log("HAGAMOS ALGO")
              layer.data?.forEach( (tileNumber: number, index: number) => {
    
                
                //Validamos que el TileMap el cual contiene una relación llave valor con el caracter 
                //y su equivalente en la capa, por ejemplo $: 36, esté inicializado.
                if (!(numeroLayer >= 0 && numeroLayer < tileMap.length)) {
                  tileMap.push({})
                }
    
                //Si el "Tilemap" en la capa actual no ha mapeado el número
                if(Object.values(tileMap[numeroLayer]).includes(tileNumber) === false){
    
                  //Validmos si es un número de dos dígitos y en caso de que lo sea, debemos validar el
                  //ultimo valor posible del contador.
                  contador = devolverSiguienteNumeroValido(contador,valoresProhibidos)
    
                  //Una vez validado, si el número a evaluar es de dos digitos y el contador está entre
                  //los numeros validos
                  if(tileNumber.toString().length > 1 && contador >= 33 && contador <=165 ){
                
                    //Al mapeo de la capa evaluada le asignamos una correspondencia entre el valor ASCCI y el numero
                    (tileMap[numeroLayer])[String.fromCharCode(contador)] = tileNumber as number;
    
                    //Actualizamos el mapa de la misma posicion con el nuevo caracter
                    worldJson.layers[numeroLayer].data[index] = String.fromCharCode(contador);
    
                    //Avanzamos el contador para tomar el nuevo valor ASCII
                    contador++;
                  }else if(contador > 165){
                    //En caso de que el contador haya superado el límite de asignaciones
                    throw new Error("La cantidad de cuadros a superado el limite establecido");
                  }else {
    
                    //Si el mapeo realizado es de un número de un sólo digito entonces asignamos directamente ese numero 
                    (tileMap[numeroLayer])[tileNumber.toString() as string] = tileNumber as number
                  }
    
                }else{
    
                  //En la caso de extraer un número que ya ha sido mapeado y ya tiene asignado un valor ASCII
                  //Buscamos la llave a la que le corresponde ese valor
                  //Y actualizamos el mapa con ese caracter encontrado.
                  const keyEncontrada = Object.entries(tileMap[numeroLayer]).find(([_, value]) => value === tileNumber)?.[0];
                  worldJson.layers[numeroLayer].data[index] = keyEncontrada
                }
          
              });
            }else{
              console.log("NO HAGA NADA")
            }

            
  
  
          }

          let proporcionX = ( window.innerWidth / (32 * TILED_MAP__WIDTH_NUMBER) )
          let proporcionY = (window.innerHeight / (32 * TILED_HEIGTH_NUMBER))
  
          if(layer.type === "objectgroup" && layer.name === "colisionarbol"){
  
            layer.objects.forEach( (zonaColision: any) => {
  
              //if(numeroColision === 4){
                // Zona de caid


                
                contextoKaplay.add([
                  contextoKaplay.pos( (zonaColision.x / 32) *( window.innerWidth / 20), Math.floor((zonaColision.y / 32 )*(window.innerHeight / 15))),
                  contextoKaplay.scale(1),
                  contextoKaplay.body({isStatic: true}),
                  contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0.0), (zonaColision.width / 32) * ( window.innerWidth / 20) , zonaColision.height * proporcionY)}),
                  { width: zonaColision.width * proporcionX, height: zonaColision.height * proporcionY }, // Agrega propiedades manualmente
                  "colisionarbol"
                ]);
  
              //}
              
  
            });
  
  
              
          }

          if(layer.type === "objectgroup" && layer.name === "colisiones"){
  
            layer.objects.forEach( (zonaColision: any) => {
  
              //if(numeroColision === 4){
                // Zona de caid

     
                
                contextoKaplay.add([
                  contextoKaplay.pos( (zonaColision.x / 32) *( window.innerWidth / 20), Math.floor((zonaColision.y / 32 )*(window.innerHeight / 15))),
                  contextoKaplay.scale(1),
                  contextoKaplay.body({isStatic: true}),
                  contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0.0), (zonaColision.width / 32) * ( window.innerWidth / 20) , zonaColision.height * proporcionY)}),
                  { width: zonaColision.width * proporcionX, height: zonaColision.height * proporcionY }, // Agrega propiedades manualmente
                  "square-colision"
                ]);
  
              //}
              
  
            });
  
  
              
          }
          if(layer.type === "objectgroup" && layer.name === "heart1"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const heart1 = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("heart1"),
                contextoKaplay.scale(2),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.7, altoCelda*0.7)}),
                contextoKaplay.anchor("center"),
                "heart1",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);

              heart1.tag("heart1")
    
  
              
          }

          if(layer.type === "objectgroup" && layer.name === "nomo"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const nomo = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("nomo"),
                contextoKaplay.scale(1),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.7, altoCelda*0.7)}),
                contextoKaplay.anchor("center"),
                "nomo",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);

              nomo.tag("nomo")
              

  
  
              
          }

          if(layer.type === "objectgroup" && layer.name === "construccion"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const construccion = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("construccion"),
                contextoKaplay.scale(1),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.7, altoCelda*0.7)}),
                contextoKaplay.anchor("center"),
                "construccion",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);

              construccion.tag("construccion")
              
        
  
  
              
          }

          if(layer.type === "objectgroup" && layer.name === "construccion2"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const construccion2 = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("construccion2"),
                contextoKaplay.scale(1),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.7, altoCelda*0.7)}),
                contextoKaplay.anchor("center"),
                "construccion2",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);

              construccion2.tag("construccion2")

  
  
              
          }

          if(layer.type === "objectgroup" && layer.name === "construccion3"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const construccion3 = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("construccion3"),
                contextoKaplay.scale(1),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.7, altoCelda*0.7)}),
                contextoKaplay.anchor("center"),
                "construccion3",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);

              construccion3.tag("construccion3")
              

  
  
              
          }

          if(layer.type === "objectgroup" && layer.name === "boton1"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const boton1 = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("boton1"),
                contextoKaplay.scale(1),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.7, altoCelda*0.7)}),
                contextoKaplay.anchor("center"),
                "boton1",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);

              boton1.tag("boton1")
              
        
  
  
              
          }

          if(layer.type === "objectgroup" && layer.name === "boton2"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const boton2 = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("boton2"),
                contextoKaplay.scale(1),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.7, altoCelda*0.7)}),
                contextoKaplay.anchor("center"),
                "boton2",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);

              boton2.tag("boton2")
              

  
              
          }

          if(layer.type === "objectgroup" && layer.name === "boton2"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const boton3 = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("boton3"),
                contextoKaplay.scale(2),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.7, altoCelda*0.7)}),
                contextoKaplay.anchor("center"),
                "boton3",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);

              boton3.tag("boton3")
              
      
  
  
              
          }

          if(layer.type === "objectgroup" && layer.name === "heart2"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const heart2 = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("heart2"),
                contextoKaplay.scale(2),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.7, altoCelda*0.7)}),
                contextoKaplay.anchor("center"),
                "heart2",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);

              heart2.tag("heart2")
              
     
  
  
              
          }
          if(layer.type === "objectgroup" && layer.name === "heart3"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const heart3 = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("heart1"),
                contextoKaplay.scale(2),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.2, altoCelda*0.2)}),
                contextoKaplay.anchor("center"),
                "heart3",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);

              heart3.tag("heart3")
              
    
  
  
              
          }
          if(layer.type === "objectgroup" && layer.name === "up"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const up = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("up"),
                contextoKaplay.scale(4),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.2, altoCelda*0.2)}),
                contextoKaplay.anchor("center"),
                "up",
                { z: 2 } // Asegura que el jugador esté en una capa superior
              ]);

              up.tag("player")
              
 
          }
          if(layer.type === "objectgroup" && layer.name === "down"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const down = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("down"),
                contextoKaplay.scale(4),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.2, altoCelda*0.2)}),
                contextoKaplay.anchor("center"),
                "down",
                { z: 2 } // Asegura que el jugador esté en una capa superior
              ]);

              down.tag("down")
              

  
  
              
          }
          if(layer.type === "objectgroup" && layer.name === "left"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const left = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("left"),
                contextoKaplay.scale(4),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.2, altoCelda*0.2)}),
                contextoKaplay.anchor("center"),
                "left",
                { z: 2 } // Asegura que el jugador esté en una capa superior
              ]);

              left.tag("left")

  
  
              
          }
          if(layer.type === "objectgroup" && layer.name === "right"){
  
            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const right = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2) -5),
                contextoKaplay.sprite("right"),
                contextoKaplay.scale(4),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.2, altoCelda*0.2)}),
                contextoKaplay.anchor("center"),
                "right",
                { z: 2 } // Asegura que el jugador esté en una capa superior
              ]);

              right.tag("right")
              

  
  
              
          }
          if(layer.type === "objectgroup" && layer.name === "cartel"){

            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const cartel = contextoKaplay.add([
                contextoKaplay.pos(posicionX +200,posicionY+100),
                contextoKaplay.sprite("cartel"),
                contextoKaplay.scale(0.1),
                contextoKaplay.health(3),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.7, altoCelda*0.7)}),
                contextoKaplay.body(),
                contextoKaplay.anchor("center"),
                "cartel",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);

              cartel.tag("cartel")
              

          }

          if(layer.type === "objectgroup" && layer.name === "player"){

            const anchoCelda: number = ( window.innerWidth / dimesionesMapaX)
            const altoCelda: number = ( window.innerHeight / dimesionesMapaY)
  
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda;
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda

              // Jugador
              const player = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2),posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("knight"),
                contextoKaplay.scale(1),
                contextoKaplay.health(3),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.6, altoCelda*0.6)}),
                contextoKaplay.body(),
                contextoKaplay.anchor("center"),
                "player",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);

              player.tag("player")
              
   
          }
          if(layer.type === "objectgroup" && layer.name === "enemy"){
            const anchoCelda: number = ( window.innerWidth / 20);
            const altoCelda: number = ( window.innerHeight / 15)


            layer.objects.forEach( (enemiguito: any) => {
              let posicionX: number = (enemiguito.x / 32) * ( anchoCelda);
              let posicionY: number = (enemiguito.y / 32) * ( altoCelda)
              let enemy = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2), posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("enemy"),
                contextoKaplay.scale(1),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda, altoCelda)}),
                contextoKaplay.anchor("center"),
                "enemy",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);
  
              enemy.tag("enemy")
            })
            
            
          }
          if(layer.type === "objectgroup" && layer.name === "castillo"){
  
            let posicionX: number = (layer.objects[0].x / 32) * ( window.innerWidth / 20);
            let posicionY: number = (layer.objects[0].y / 32) * ( window.innerHeight / 15)

            const castillo = contextoKaplay.add([
              contextoKaplay.pos(posicionX + (( window.innerWidth / 20) / 2), posicionY +  ( window.innerHeight / 15)),
              contextoKaplay.sprite("castillo"),
              contextoKaplay.scale(0.5),
              contextoKaplay.area(),
              contextoKaplay.anchor("center"),
              contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), layer.objects[0].width * 5, layer.objects[0].height * 5)}),
              "castillo",
              { z: 1 } // Asegura que el jugador esté en una capa superior
            ]);

            castillo.tag("castillo")
            
          }
          if(layer.type === "objectgroup" && layer.name === "casa"){
  
            let posicionX: number = (layer.objects[0].x / 32) * ( window.innerWidth / 20);
            let posicionY: number = (layer.objects[0].y / 32) * ( window.innerHeight / 15)

            const casa = contextoKaplay.add([
              contextoKaplay.pos(posicionX, posicionY - 100),
              contextoKaplay.sprite("casa"),
              contextoKaplay.scale(0.7),
              contextoKaplay.area(),
              "casa",
              { z: 1 } // Asegura que el jugador esté en una capa superior
            ]);

            casa.tag("casa")
            
          }

          if(layer.type === "objectgroup" && layer.name === "casa1"){
  
            let posicionX: number = (layer.objects[0].x / 32) * ( window.innerWidth / 20);
            let posicionY: number = (layer.objects[0].y / 32) * ( window.innerHeight / 15)

            const casa1 = contextoKaplay.add([
              contextoKaplay.pos(posicionX, posicionY - 100),
              contextoKaplay.sprite("casa1"),
              contextoKaplay.scale(0.7),
              contextoKaplay.area(),
              "casa1",
              { z: 1 } // Asegura que el jugador esté en una capa superior
            ]);

            casa1.tag("casa1")
            
          }

          if(layer.type === "objectgroup" && layer.name === "torre"){
  
          let posicionX: number = (layer.objects[0].x / 32) * ( window.innerWidth / 20);
          let posicionY: number = (layer.objects[0].y / 32) * ( window.innerHeight / 15)

          const torre = contextoKaplay.add([
            contextoKaplay.pos(posicionX, posicionY - 100),
            contextoKaplay.sprite("torre"),
            
            contextoKaplay.scale(0.7),
            contextoKaplay.area(),
            "torre"
          ]);

          torre.tag("torre")
          
          }

          if(layer.type === "objectgroup" && layer.name === "torre1"){
  
            let posicionX: number = (layer.objects[0].x / 32) * ( window.innerWidth / 20);
            let posicionY: number = (layer.objects[0].y / 32) * ( window.innerHeight / 15)
  
            const torre1 = contextoKaplay.add([
              contextoKaplay.pos(posicionX, posicionY - 100),
              contextoKaplay.sprite("torre1"),
              
              contextoKaplay.scale(0.7),
              contextoKaplay.area(),
              "torre1"
            ]);
  
            torre1.tag("torre1")
            
          }

          if(layer.type === "objectgroup" && layer.name === "arbol"){

        const anchoCelda: number = ( window.innerWidth / 20);
        const altoCelda: number = ( window.innerHeight / 15)
  
        let posicionX: number = (layer.objects[0].x / 32) * anchoCelda
        let posicionY: number = (layer.objects[0].y / 32) * altoCelda

        const escala: number = 0.5

        layer.objects.forEach( (arbolito: any) => {

          let posicionX: number = (arbolito.x / 32) * anchoCelda
          let posicionY: number = (arbolito.y / 32) * altoCelda

          const arbol = contextoKaplay.add([
            contextoKaplay.pos(posicionX + (anchoCelda / 2), posicionY  + (altoCelda / 2)),
            contextoKaplay.sprite("arbol"),
            contextoKaplay.scale(escala),
            contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), (anchoCelda / escala) , (altoCelda / escala))}),
            
            contextoKaplay.anchor("center"),
            "arbol"
          ]);
  
          arbol.tag("arbol")

        })
  
        


        
          }
          if(layer.type === "objectgroup" && layer.name === "hongo"){

            const anchoCelda: number = ( window.innerWidth / 20);
            const altoCelda: number = ( window.innerHeight / 15)
      
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda
    
            const escala: number = 0.5
    
            layer.objects.forEach( (arbolito: any) => {
    
              let posicionX: number = (arbolito.x / 32) * anchoCelda
              let posicionY: number = (arbolito.y / 32) * altoCelda
    
              const hongo = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2), posicionY  + (altoCelda / 2)),
                contextoKaplay.sprite("hongo"),
                contextoKaplay.scale(1),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.7, altoCelda*0.7)}),
                contextoKaplay.anchor("center"),
                "hongo"
              ]);
      
              hongo.tag("hongo")
    
            })
      
            
    
    
            
          }

          if(layer.type === "objectgroup" && layer.name === "rock"){

            const anchoCelda: number = ( window.innerWidth / 20);
            const altoCelda: number = ( window.innerHeight / 15)
      
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda
    
            const escala: number = 0.5
    
            layer.objects.forEach( (arbolito: any) => {
    
              let posicionX: number = (arbolito.x / 32) * anchoCelda
              let posicionY: number = (arbolito.y / 32) * altoCelda
    
              const rock = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2), posicionY  + (altoCelda / 2)),
                contextoKaplay.sprite("rock"),
                contextoKaplay.scale(1),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.7, altoCelda*0.7)}),
                contextoKaplay.anchor("center"),
                "rock"
              ]);
      
              rock.tag("rock")
    
            })

          }
          if(layer.type === "objectgroup" && layer.name === "oveja"){

            const anchoCelda: number = ( window.innerWidth / 20);
            const altoCelda: number = ( window.innerHeight / 15)
      
            let posicionX: number = (layer.objects[0].x / 32) * anchoCelda
            let posicionY: number = (layer.objects[0].y / 32) * altoCelda
    
            const escala: number = 0.5
    
            layer.objects.forEach( (arbolito: any) => {
    
              let posicionX: number = (arbolito.x / 32) * anchoCelda
              let posicionY: number = (arbolito.y / 32) * altoCelda
    
              const oveja = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2), posicionY  + (altoCelda / 2)),
                contextoKaplay.sprite("oveja"),
                contextoKaplay.scale(1),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda*0.7, altoCelda*0.7)}),
                contextoKaplay.anchor("center"),
                "oveja"
              ]);
      
              oveja.tag("oveja")
    
            })

          }
                  
          if(layer.type === "objectgroup" && layer.name === "enemigo"){

            const anchoCelda: number = ( window.innerWidth / 20);
            const altoCelda: number = ( window.innerHeight / 15)


            layer.objects.forEach( (enemiguito: any) => {
              let posicionX: number = (enemiguito.x / 32) * ( anchoCelda);
              let posicionY: number = (enemiguito.y / 32) * ( altoCelda)
              let enemy = contextoKaplay.add([
                contextoKaplay.pos(posicionX + (anchoCelda / 2), posicionY + (altoCelda / 2)),
                contextoKaplay.sprite("enemigo"),
                contextoKaplay.scale(1),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda, altoCelda)}),
                contextoKaplay.anchor("center"),
                "enemigo",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);
  
              enemy.tag("enemigo")
            })
      
          }


          if(layer.type === "objectgroup" && layer.name === "imagen1"){

            const anchoCelda: number = ( window.innerWidth / 20);
            const altoCelda: number = ( window.innerHeight / 15)


            layer.objects.forEach( (imagenNivel: any) => {
              
              console.log(imagenNivel)
              let posicionX: number = (imagenNivel.x / 32) * ( anchoCelda);
              let posicionY: number = (imagenNivel.y / 32) * ( altoCelda)

              let imagen = contextoKaplay.add([
                contextoKaplay.pos(((posicionX) + ((imagenNivel.width / 32) * anchoCelda)/2), ((posicionY) + (imagenNivel.height / 32) * altoCelda) - (3/2) * altoCelda ),
                contextoKaplay.sprite("arbol"),
                contextoKaplay.scale(0.8),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), (imagenNivel.width / 32) * anchoCelda, (imagenNivel.height / 32) * altoCelda)}),
                contextoKaplay.anchor("center"),
                "imagen1",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);
  
              imagen.tag("imagen1")
            })
      
          }

          if(layer.type === "objectgroup" && layer.name === "imagen2"){

            const anchoCelda: number = ( window.innerWidth / 20);
            const altoCelda: number = ( window.innerHeight / 15)


            layer.objects.forEach( (imagenNivel: any) => {
              
              console.log(imagenNivel)
              let posicionX: number = (imagenNivel.x / 32) * ( anchoCelda);
              let posicionY: number = (imagenNivel.y / 32) * ( altoCelda)

              let imagen = contextoKaplay.add([
                contextoKaplay.pos(((posicionX) + ((imagenNivel.width / 32) * anchoCelda)/2), ((posicionY) + (imagenNivel.height / 32) * altoCelda) - (3/2) * altoCelda ),
                contextoKaplay.sprite("arbol"),
                contextoKaplay.scale(0.8),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), (imagenNivel.width / 32) * anchoCelda, (imagenNivel.height / 32) * altoCelda)}),
                contextoKaplay.anchor("center"),
                "imagen2",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);
  
              imagen.tag("imagen2")
            })
      
          }

          if(layer.type === "objectgroup" && layer.name === "imagen3"){

            const anchoCelda: number = ( window.innerWidth / 20);
            const altoCelda: number = ( window.innerHeight / 15)


            layer.objects.forEach( (imagenNivel: any) => {
              
              console.log(imagenNivel)
              let posicionX: number = (imagenNivel.x / 32) * ( anchoCelda);
              let posicionY: number = (imagenNivel.y / 32) * ( altoCelda)

              let imagen = contextoKaplay.add([
                contextoKaplay.pos(((posicionX) + ((imagenNivel.width / 32) * anchoCelda)/2), ((posicionY) + (imagenNivel.height / 32) * altoCelda) - (3/2) * altoCelda ),
                contextoKaplay.sprite("arbol"),
                contextoKaplay.scale(0.8),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), (imagenNivel.width / 32) * anchoCelda, (imagenNivel.height / 32) * altoCelda)}),
                contextoKaplay.anchor("center"),
                "imagen3",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);
  
              imagen.tag("imagen3")
            })
      
          }

          if(layer.type === "objectgroup" && layer.name === "imagengrande"){

            const anchoCelda: number = ( window.innerWidth / 20);
            const altoCelda: number = ( window.innerHeight / 15)


            layer.objects.forEach( (imagengrande: any) => {
              let posicionX: number = (imagengrande.x / 32) * ( anchoCelda);
              let posicionY: number = (imagengrande.y / 32) * ( altoCelda)

              let imagen_g = contextoKaplay.add([
                contextoKaplay.pos(((posicionX) + ((imagengrande.width / 32) * anchoCelda)/2), ((posicionY) + (imagengrande.height / 32) * altoCelda) - (3/2) * altoCelda ),
                contextoKaplay.sprite("arbol"),
                contextoKaplay.scale(0.8),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda, altoCelda)}),
                contextoKaplay.anchor("center"),
                "imagen_grande",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);
  
              imagen_g.tag("imagen_grande")
            })
      
          }

          if(layer.type === "objectgroup" && layer.name === "boton"){

            const anchoCelda: number = ( window.innerWidth / 20);
            const altoCelda: number = ( window.innerHeight / 15)


            layer.objects.forEach( (botonInvisible: any) => {
              let posicionX: number = (botonInvisible.x / 32) * ( anchoCelda);
              let posicionY: number = (botonInvisible.y / 32) * ( altoCelda)

              let imagen_g = contextoKaplay.add([
                contextoKaplay.pos(posicionX , posicionY),
                contextoKaplay.sprite("arbol"),
                contextoKaplay.scale(1),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), anchoCelda * 3, altoCelda * 3)}),
                contextoKaplay.anchor("center"),
                "botonInvisible",
                {z: 1}
              ]);
              imagen_g.tag("botonInvisible")
            })
      
          }

          if(layer.type === "objectgroup" && layer.name === "restriccion3"){

            const anchoCelda: number = ( window.innerWidth / 20);
            const altoCelda: number = ( window.innerHeight / 15)


            layer.objects.forEach( (imagenNivel: any) => {
              
              console.log(imagenNivel)
              let posicionX: number = (imagenNivel.x / 32) * ( anchoCelda);
              let posicionY: number = (imagenNivel.y / 32) * ( altoCelda)

              let imagen = contextoKaplay.add([
                contextoKaplay.pos(((posicionX) + (anchoCelda)/2), ((posicionY) + ( altoCelda / 2))),
                contextoKaplay.sprite("arbol"),
                contextoKaplay.scale(0.8),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), (imagenNivel.width / 32) * anchoCelda, (imagenNivel.height / 32) * altoCelda)}),
                contextoKaplay.anchor("center"),
                contextoKaplay.body({isStatic: true}),
                "restriccion3",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);
  
              imagen.tag("restriccion3")
            })
      
          }

          if(layer.type === "objectgroup" && layer.name === "restriccion2"){

            const anchoCelda: number = ( window.innerWidth / 20);
            const altoCelda: number = ( window.innerHeight / 15)


            layer.objects.forEach( (imagenNivel: any) => {
              
              console.log(imagenNivel)
              let posicionX: number = (imagenNivel.x / 32) * ( anchoCelda);
              let posicionY: number = (imagenNivel.y / 32) * ( altoCelda)

              let imagen = contextoKaplay.add([
                contextoKaplay.pos(((posicionX) + (anchoCelda)/2), ((posicionY) + ( altoCelda / 2))),
                contextoKaplay.sprite("arbol"),
                contextoKaplay.scale(0.8),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), (imagenNivel.width / 32) * anchoCelda, (imagenNivel.height / 32) * altoCelda)}),
                contextoKaplay.anchor("center"),
                contextoKaplay.body({isStatic: true}),
                "restriccion2",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);
  
              imagen.tag("restriccion2")
            })
      
          }

          if(layer.type === "objectgroup" && layer.name === "restriccion1"){

            const anchoCelda: number = ( window.innerWidth / 20);
            const altoCelda: number = ( window.innerHeight / 15)


            layer.objects.forEach( (imagenNivel: any) => {
              
              console.log(imagenNivel)
              let posicionX: number = (imagenNivel.x / 32) * ( anchoCelda);
              let posicionY: number = (imagenNivel.y / 32) * ( altoCelda)

              let imagen = contextoKaplay.add([
                contextoKaplay.pos(((posicionX) + (anchoCelda)/2), ((posicionY) + ( altoCelda / 2))),
                contextoKaplay.sprite("arbol"),
                contextoKaplay.scale(0.8),
                contextoKaplay.area({shape: new contextoKaplay.Rect(contextoKaplay.vec2(0,0), (imagenNivel.width / 32) * anchoCelda, (imagenNivel.height / 32) * altoCelda)}),
                contextoKaplay.anchor("center"),
                contextoKaplay.body({isStatic: true}),
                "restriccion1",
                { z: 1 } // Asegura que el jugador esté en una capa superior
              ]);
  
              imagen.tag("restriccion1")
            })
      
          }

        });
        
      
        type TileComponent = ReturnType<typeof contextoKaplay.sprite> | ReturnType<typeof contextoKaplay.scale>;
        const tileMapping: Record<string, () => TileComponent[]>[] = []
  
        //Una vez realizada la asignación entre valores ASCII y valores númericos del mapa
        //Es necesario asignar a un SPRITE a cada uno de esos valores, por lo que para
        //lograrlo hacemos lo siguiente:
        tileMap.forEach( (layer: any, numeroLayer: number) => {
  
          //Para cada valor ASCII de la capa que se está evaluado hacemos lo siguiente
          Object.keys(layer).forEach((key:any, index: number) => {
  
  
  
            //Si la capa que estamos extrayendo es la primera, extraemos el valor numerico asociado al codigo ASCII o "key"
            //De lo contrario, si es una capa superior, debemos restar el punto de origen de las imagenes SPRITE usadas para
            //hallar los frames originales.
  
            const frame = (numeroLayer === 0 ) ? layer[key] : (layer[key] !== 0 && layer[key] !== "0" )  ? layer[key] - tilesetOrder[numeroLayer].firstgid + 1 : 0; // Obtener el frame correcto del tileMap
  
            // Asegurar que tileMapping[index] existe como un objeto antes de asignar valores
            if (!tileMapping[numeroLayer]) {
              tileMapping[numeroLayer] = {};
            }
  
            //Si la clave que se está evaluando no es cero, entonces quiere decir que tiene un sprite asociado y no es vacio
            //Por lo que hacemos lo siguiente
            if(key !== 0 && key !== "0" ){
  
              //Al TileMapping (Mapa entre codigo ASCII y el SPRITE le asignamos el frame encontrado (menos una posicion porque TILED empieza en 1))
               tileMapping[numeroLayer][key] = () => [
                contextoKaplay.sprite(`tiles-${numeroLayer+1}`, { frame: (frame as number) - 1, width: anchoCuadrado, height: altoCuadrado }),
                contextoKaplay.scale(1)
               ]
  
            }else{
              //De lo contrario si encuentra un cero, le asignamos una imagen especial transparente para cubrir el espacio vacio
              (tileMapping[numeroLayer])[key] = () => [
                contextoKaplay.sprite(`title-0`, { width: anchoCuadrado, height: altoCuadrado })
               ]
            }
               
          });
  
        })
      
        
  
        /*
        worldJson.layers.forEach((layer: any, numeroLayer: number) => {
        
          let resultadoMapa = [];
          if (layer.type === "tilelayer" ) {
            const { data, width } = layer;
            const mapa = [];
            for (let i = 0; i < width; i++) {
              mapa.push(data.slice(i * width, (i + 1) * width));
            }
  
            const resultadoMapeo = mapa.map((fila: any) =>
              fila.map((cell: any) => cell.toString()).join("")
            );
  
            resultadoMapa = [...resultadoMapeo]
  
          
            contextoKaplay.addLevel(resultadoMapa, {
              tileWidth: anchoCuadrado,
              tileHeight: altoCuadrado,
              pos: configuracionMapa.pos,
              tiles: { ...tileMapping[numeroLayer] },
            })
          }
  
  
          
          
        })
        */
  
      }
  
      
    )
    .catch( (error: any) => {
      console.error(error)
    });
  
    
    }

    export default generarEsquemaMapa;




    


