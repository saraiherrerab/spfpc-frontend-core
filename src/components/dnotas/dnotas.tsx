import React from "react";
import "./dnotas.css";

interface Cursos {
    id_curso: number,
    nombre_curso: string
}

interface Horarios {
    dia_semana: string,
    hora_fin: string,
    hora_inicio: string,
    id_horario: number,
}

interface descripcionesNota {
    titulo: string,
    descripcion: string
}

interface NotasProps {
    titulo: string;
    descripcionN: descripcionesNota[];
    horarios_profesor?: Horarios[];
    cursos_profesor?: Cursos[]
}

export default function Notas({ titulo, descripcionN, horarios_profesor, cursos_profesor }: NotasProps) {
    return (
            <div className="notas-section">
                <h2 className="tituloNotas">{titulo}</h2>
                {

               !horarios_profesor && !cursos_profesor && descripcionN.map ( (descripcionNota: descripcionesNota, index: number) => {
                        if (descripcionNota.titulo.length > 1){
                            return ( 
                                <div key={index} className="fila_nota">
                                    <p className="col30"><strong>{descripcionNota.titulo}</strong></p>
                                    <p className="col70">{descripcionNota.descripcion}</p>
                                </div>
                            )
                        }
                        return ( 
                            <div key={index} className="fila_nota">
                                <p>{descripcionNota.descripcion}</p>
                            </div>
                        )
                    })
                
                }
                {
                    horarios_profesor && horarios_profesor.length > 0
                    ? 
                    horarios_profesor.map((horario: Horarios, index: number) => (
                            <p key={index}>{`${horario.dia_semana} desde ${horario.hora_inicio} hasta las ${horario.hora_fin}`}</p>
                    ))
                    : 
                    null
                }
                {
                    cursos_profesor && cursos_profesor.length > 0
                    ? 
                    cursos_profesor.map((curso: Cursos, index: number) => (
                            <p key={index}>{curso.nombre_curso}</p>
                    ))
                    : 
                    null
                }
            </div>

    );
}