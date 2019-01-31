import { Adjunto } from "./adjunto";
import { CondicionesTecnicasServicios } from '../entrega-servicios/condicionTecnicaServicio';

export class CondicionTecnicaServicios{
    constructor(public titulo: string,
        public idSolicitud: any,
        public codigo: string,
        public descripcion: string,
        public cantidad: number,
        public valorEstimado: number,
        public comentarios: string,
        public codigoSondeo?: string,
        public cantidadSondeo?: number,
        public precioSondeo?: string,
        public comentariosSondeo?: string,
        public moneda?: string,
        public adjunto?:any,
        public adjuntoCreacion?:any,
        public id?: number) { }

    public static fromJson(element: any) {
        let adjuntosServicios: Adjunto[] = [];
        let adjuntoCreacion: Adjunto;
        let adjuntoSondeo: Adjunto;

        let arrayAdjuntos = element.AttachmentFiles.results;
        for (let i = 0; i < arrayAdjuntos.length; i++) {
            adjuntosServicios.push(new Adjunto(element.Id, arrayAdjuntos[i].FileName, arrayAdjuntos[i].ServerRelativeUrl));
        }

        adjuntoSondeo = CondicionTecnicaServicios.ObtenerAdjunto("sondeoServicios-", adjuntosServicios, adjuntoSondeo);
        adjuntoCreacion = CondicionTecnicaServicios.ObtenerAdjunto("solp-", adjuntosServicios, adjuntoCreacion);

        
        return new CondicionTecnicaServicios(element.Title,
            element.Solicitud,
            element.Codigo,
            element.Descripcion,
            element.Cantidad,
            element.ValorEstimado,
            element.Comentario,
            element.CodigoSondeo,
            element.CantidadSondeo,
            element.PrecioSondeo,
            element.ComentarioSondeo,
            element.TipoMoneda,
            adjuntoSondeo,
            adjuntoCreacion,
            element.ID);
    }

    private static ObtenerAdjunto(identificadorAdjunto: string, adjuntosBienes: Adjunto[], adjuntoRetornar: Adjunto) {
        if (adjuntosBienes.length > 0) {
            let adjuntoPorBuscar = adjuntosBienes.filter(a => a.filename.startsWith(identificadorAdjunto));
            if (adjuntoPorBuscar.length > 0) {
                let ultimaPosicion = adjuntoPorBuscar.length - 1;
                adjuntoRetornar = adjuntoPorBuscar[ultimaPosicion];
            }
            else {
                adjuntoRetornar = null;
            }
        }
        else {
            adjuntoRetornar = null;
        }
        return adjuntoRetornar;
    }
    
    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}