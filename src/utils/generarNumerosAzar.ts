


    function generarNumerosAzar(): number[] {
    const longitud = Math.floor(Math.random() * (10 - 5 + 1)) + 5; // Número aleatorio entre 5 y 10
    return Array.from({ length: longitud }, () => Math.floor(Math.random() * 3)); // Números entre 0 y 5
    }



    export default  generarNumerosAzar;

    //Implementada en las notas musicales