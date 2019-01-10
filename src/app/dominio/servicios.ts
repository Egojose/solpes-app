export class Servicios{

    id: number;
    campoCodigo: string;
    campoDescripcion: string;
    campoCantidad: string;
    campoValorEstimado: string;
    campoAdjunto: string;
    campoComentarios: string;

    constructor(id: number, campoCodigo: string, campoDescripcion: string, campoCantidad: string, campoValorEstimado: string, campoAdjunto: string, campoComentarios: string){
        this.id = id;
        this.campoCodigo = campoCodigo;
        this.campoDescripcion = campoDescripcion;
        this.campoCantidad = campoCantidad;
        this.campoValorEstimado = campoValorEstimado;
        this.campoAdjunto = campoAdjunto;
        this.campoComentarios = campoComentarios;
    }
}