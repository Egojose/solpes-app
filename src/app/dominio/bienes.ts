export class Bienes{

    id: number;
    campoCodigo: string;
    campoDescripcion: string;
    campoModelo: string;
    campoFabricante: string;
    campoClaseSia: string;
    campoCantidad: string;
    campoValorEstimado: string;
    campoAdjunto: string;
    campoComentarios: string;


    constructor(id: number, campoCodigo: string, campoDescripcion: string, campoModelo: string, campoFabricante: string, campoClaseSia: string, campoCantidad: string, campoValorEstimado: string, campoAdjunto: string, campoComentarios: string){
        this.id = id;
        this.campoCodigo = campoCodigo;
        this.campoDescripcion = campoDescripcion;
        this.campoModelo = campoModelo;
        this.campoFabricante = campoFabricante;
        this.campoClaseSia = campoClaseSia;
        this.campoCantidad = campoCantidad;
        this.campoValorEstimado = campoValorEstimado;
        this.campoAdjunto = campoAdjunto;
        this.campoComentarios = campoComentarios;
    }
}