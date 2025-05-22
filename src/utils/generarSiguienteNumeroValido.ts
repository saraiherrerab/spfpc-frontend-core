function devolverSiguienteNumeroValido (validarNumero: number, arregloNumerosProhibidos: number[]) : number {
    arregloNumerosProhibidos.sort((a, b) => a - b);
    return (arregloNumerosProhibidos.includes(validarNumero) ) ? arregloNumerosProhibidos[arregloNumerosProhibidos.length - 1] : validarNumero;
    }

export default devolverSiguienteNumeroValido;

//Es para el mapeador, implemento el codigo ASCII, como no todos son validos
//Esta función sirve para evitar errores en el proceso de mapeo
//De forma que solo seleccione digitos validos del arreglo ASCII