'use client'

 import { useEffect, useRef, useState } from "react";
 import kaplay from "kaplay";
 import { Panel } from "./PanelJuegos";
 import './styles.css';
import { useRouter } from "next/navigation";

interface Estudiante {
  id_usuario: number;
  telefono: string;
  nombre: string;
  apellido: string;
  correo: string;
  edad: number;
  foto: string;
  usuario: string;
  clave_acceso: string;
  cedula: string;
  id_estudiante: number;
  condicion_medica: string;
  eficiencia_algoritmica: number;
  reconocimiento_patrones: string; 
  abstraccion: string;
  asociacion: string;
  identificacion_errores: string;
  construccion_algoritmos: string;
  p_actividades_completadas: number;
  tipo_premiacion: string;
  id_grupo: number;
}

//let respuesta=1;
 function Inicial(props:any) {
  // Declaración del estado con useState dentro del cuerpo del componente
 
  // Función para manejar el clic del botón
 
  return (
    <>

      {props.respuesta ? (
        <>
          {props.respuesta && (
            <div className="message-container-inicial">
              
            </div>
          )}
        </>
      ) : null}
    </>
  );

}

 //let respuesta=1;
 function Cartel(props:any) {
  // Declaración del estado con useState dentro del cuerpo del componente
 
  // Función para manejar el clic del botón
 
  return (
    <>

      {props.respuesta ? (
        <>
          {props.respuesta && (
            <div className="message-container">
              
            </div>
          )}
        </>
      ) : null}
    </>
  );

}

 function Cartel5(props:any) {
  // Declaración del estado con useState dentro del cuerpo del componente
 
  // Función para manejar el clic del botón
 
  return (
    <>

      {props.respuesta ? (
        <>
          {props.respuesta && (
            <div className="message-container5">
              
            </div>
          )}
        </>
      ) : null}
    </>
  );

}

 function CartelIncorrecto(props:any) {
  // Declaración del estado con useState dentro del cuerpo del componente
 
  // Función para manejar el clic del botón
 
  return (
    <>

      {props.respuesta ? (
        <>
          {props.respuesta && (
            <div className="message-container-incorrecto">
              
            </div>
          )}
        </>
      ) : null}
    </>
  );

}

function CartelNivel1(props:any) {
  // Declaración del estado con useState dentro del cuerpo del componente

  // Función para manejar el clic del botón
 
  return (
    <>

      {props.respuesta ? (
        <>
          {props.respuesta && (
            <div className="message-container-nivel1">
              
            </div>
          )}
        </>
      ) : null}
    </>
  );

}

function CartelA(props:any) {
  // Declaración del estado con useState dentro del cuerpo del componente
 
  // Función para manejar el clic del botón
 
  return (
    <>

      {props.respuesta ? (
        <>
          {props.respuesta && (
            <div className="message-containerA">
              
            </div>
          )}
        </>
      ) : null}
    </>
  );

}

function CartelB(props:any) {
  // Declaración del estado con useState dentro del cuerpo del componente
 

  // Función para manejar el clic del botón
 
  return (
    <>

      {props.respuesta ? (
        <>
          {props.respuesta && (
            <div className="message-containerB">
              
            </div>
          )}
        </>
      ) : null}
    </>
  );

}

function CartelC(props:any) {
  // Declaración del estado con useState dentro del cuerpo del componente
 
  // Función para manejar el clic del botón
 
  return (
    <>

      {props.respuesta ? (
        <>
          {props.respuesta && (
            <div className="message-containerC">
              
            </div>
          )}
        </>
      ) : null}
    </>
  );

}

 function Cartel3(props:any) {
  // Declaración del estado con useState dentro del cuerpo del componente
 
  // Función para manejar el clic del botón
 
  return (
    <>

      {props.respuesta ? (
        <>
          {props.respuesta && (
            <div className="message-container3">
              
            </div>
          )}
        </>
      ) : null}
    </>
  );

}

 let SCREEN_RESOLUTION_X: number = 0;
 let SCREEN_RESOLUTION_Y: number = 0;

 function Page() {
    const [cambiarMostrar1, setState1] = useState(false);
    const [ganar1, cambiarGanar1] = useState(true);
    const [cambiarMostrar5, setState5] = useState(false);
    const [ganar5, cambiarGanar5] = useState(true);
    const [cambiarMostrarIni, setStateIni] = useState(false);
    const [ganarIni, cambiarGanarIni] = useState(true);
    const [cambiarMostrarI, setStateI] = useState(false);
    const [ganarI, cambiarGanarI] = useState(true);
    const [cambiarMostrar, setState] = useState(false);
    const [cambiarMostrar3, setState3] = useState(false);
    const [cambiarMostrarA, setStateA] = useState(false);
    const [cambiarMostrarB, setStateB] = useState(false);
    const [cambiarMostrarC, setStateC] = useState(false);
    const [ganar, cambiarGanar] = useState(true);
    const [ganar3, cambiarGanar3] = useState(true);
    const [ganarA, cambiarGanarA] = useState(true);
    const [ganarB, cambiarGanarB] = useState(true);
    const [ganarC, cambiarGanarC] = useState(true);
    const Router= useRouter();
     // Función para cambiar el estado
    const amoALuis = () => {
      setState(!cambiarMostrar); // Cambia el estado entre true y false
    };
    const amoALuisI = () => {
      setStateI(!cambiarMostrarI); // Cambia el estado entre true y false
    };
    const amoALuis1 = () => {
      setState(!cambiarMostrar); // Cambia el estado entre true y false
    };
    const amoALuis3 = () => {
      setState3(!cambiarMostrar3); // Cambia el estado entre true y false
    };
    const amoALuisA = () => {
      setStateA(!cambiarMostrarA); // Cambia el estado entre true y false
    };
    const amoALuisB = () => {
      setStateB(!cambiarMostrarB); // Cambia el estado entre true y false
    };
    const amoALuisC = () => {
      setStateC(!cambiarMostrarC); // Cambia el estado entre true y false
    };
    const amoALuisIni = () => {
      setStateIni(!cambiarMostrarIni); // Cambia el estado entre true y false
    };
    const amoALuis5 = () => {
      setState5(!cambiarMostrar5); // Cambia el estado entre true y false
    };

   const juegoKaplayRef = useRef<any>(null);

   const [usuario, setUsuario] = useState<Estudiante | null>(null); // inicia como null


 
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

    const usuarioGuardado = localStorage.getItem("usuario");
      const informacionUsuario = usuarioGuardado
        ? JSON.parse(usuarioGuardado)
        : {
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
          };

      setUsuario(informacionUsuario);
     
     
     // Inicializar Kaplay solo si no está creado
     if (!juegoKaplayRef.current) {
       juegoKaplayRef.current = kaplay({
         width:  SCREEN_RESOLUTION_X,
         height: SCREEN_RESOLUTION_Y,
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
       juegoKaplay.loadSound("bien", "./oveja-dialogos/bien.wav");
       
       // Nivel1(juegoKaplay);
       Panel(juegoKaplay, setState, cambiarGanar,cambiarGanar3,setState3,cambiarGanarA, setStateA,cambiarGanarB, setStateB,
        cambiarGanarC, setStateC,cambiarGanar1, setState1,cambiarGanarI, setStateI,cambiarGanarIni, setStateIni,cambiarGanar5, setState5, Router,informacionUsuario);
         
      }
   
    resizeCanvas(); // Ajustar en la carga inicial
 
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
     
  }, []);
 

 
   return (<> 
     
        <canvas id="game" style={{ width: "100vw", height: "100vh", position:"relative" }} />
        
        <Cartel 
            respuesta={cambiarMostrar} 
            cambiarRespuesta={() => amoALuis()} 
            cambiarGanar={() => cambiarGanar(true)} 
        />

        <Inicial 
            respuesta={cambiarMostrarIni} 
            cambiarRespuesta={() => amoALuisIni()} 
            cambiarGanar={() => cambiarGanarIni(true)} 
        />

        <CartelIncorrecto 
            respuesta={cambiarMostrarI} 
            cambiarRespuesta={() => amoALuisI()} 
            cambiarGanar={() => cambiarGanarI(true)} 
        />

        <Cartel3 
            respuesta={cambiarMostrar3} 
            cambiarRespuesta={() => amoALuis3()} 
            mensaje={ganar3 ? "Correcto, sigue así" : "Oh no, intenta de nuevo"} 
            cambiarGanar3={() => cambiarGanar3(true)} 
        />

        <CartelA 
            respuesta={cambiarMostrarA} 
            cambiarRespuesta={() => amoALuisA()} 
            mensaje={ganarA ? "Correcto, sigue así" : "Oh no, intenta de nuevo"} 
            cambiarGanarA={() => cambiarGanarA(true)} 
        />

        <CartelB 
            respuesta={cambiarMostrarB} 
            cambiarRespuesta={() => amoALuisB()} 
            mensaje={ganarA ? "Correcto, sigue así" : "Oh no, intenta de nuevo"} 
            cambiarGanarA={() => cambiarGanarB(true)} 
        />

        <CartelC 
            respuesta={cambiarMostrarC} 
            cambiarRespuesta={() => amoALuisC()} 
            mensaje={ganarC ? "Correcto, sigue así" : "Oh no, intenta de nuevo"} 
            cambiarGanarC={() => cambiarGanarC(true)} 
        />

        <Cartel5 
            respuesta={cambiarMostrar5} 
            cambiarRespuesta={() => amoALuis5()} 
            mensaje={ganar5 ? "Correcto, sigue así" : "Oh no, intenta de nuevo"} 
            cambiarGanar5={() => cambiarGanar5(true)} 
        />

        <CartelNivel1 
            respuesta={cambiarMostrar1} 
            cambiarRespuesta={() => amoALuis1()} 
            mensaje={ganar1 ? "Correcto, sigue así" : "Oh no, intenta de nuevo"} 
            cambiarGanar1={() => cambiarGanar1(true)} 
        />
      </>)
     
 
 }
 
 
 
 export default Page;