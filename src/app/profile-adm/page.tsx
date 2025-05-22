'use client'
import { useEffect, useRef, useState } from "react";
import './styles.css';
import { useRouter } from "next/navigation";
import Notas  from "../../components/dnotas/dnotas";
import Foto from "../../components/foto/foto";
import Datos from  "../../components/dbasicos/dbasicos";
import Nombre from "../../components/nombre/nombre";

export default function Profileadm() {

  const [usuario, setUsuario] = useState(
    {
      rol: "",
      nombre: "",
      cedula: "",
      edad: 0,
      curriculum: ""
    }
  );

  const obtenerDatosUsuario = () => {
    const datos = localStorage.getItem('usuario');
    if (datos !== null) {
      const usuario = JSON.parse(datos); // ahora es seguro
      setUsuario({...usuario})
    }
  }

  useEffect( () => {
    obtenerDatosUsuario()
  },[])

  const Router = useRouter();

    return <>
      
      <div className="perfil body_profile">
          <div className="datosUsario">
            <Foto imageUrl="./cvpic.jpg"></Foto>
            <div className="titulo">
              <Nombre tituloN={(usuario.rol != null || usuario.rol != "" ) ? usuario.rol : ""} nombre={usuario.nombre}></Nombre>
            </div>
            <Datos titulo="Cedula" descripcion={ usuario.cedula }></Datos>
            <Datos titulo="Edad" descripcion={ usuario.edad.toString() }></Datos>
            <Datos titulo="Teléfono" descripcion={ usuario.edad.toString() }></Datos>
            <Datos titulo="Correo" descripcion={ usuario.edad.toString() }></Datos>
          </div>
          
           

            
            

            

          
      </div>
     
    </>
    
  }