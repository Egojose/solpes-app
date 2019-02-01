import { Adjunto } from "./adjunto";

export class RecepcionBienes {
    constructor(
        public IdSolicitud: number,
        public Idbienes: number,
        public descripcion: string,
        public cantidad: number,
        public valor: string,
        public ultimaEntrega: boolean,
        public comentario?: string,
        public IdRecepcionBienes?: number,
        public autor?: any,
        public Responsable?: any,
        public NumeroRecepcion?: string,
        public recibidoSap?: boolean,
        public numeroPedido?: string,
        public adjuntoEntregaBienes?: any) { }

    public static fromJson(element: any) {

        let adjuntosEntregaBienes: Adjunto[] = [];
        let adjuntoEntregaBienes: Adjunto;

        let arrayAdjuntos = element.AttachmentFiles.results;
        for (let i = 0; i < arrayAdjuntos.length; i++) {
            adjuntosEntregaBienes.push(new Adjunto(element.Id, arrayAdjuntos[i].FileName, arrayAdjuntos[i].ServerRelativeUrl));
        }

        adjuntoEntregaBienes = RecepcionBienes.ObtenerAdjunto("EntregaBienes-", adjuntosEntregaBienes, adjuntoEntregaBienes);

        return new RecepcionBienes(
            element.IdSolicitudId,
            element.IdCTBienesId,
            element.Descripcion,
            element.Cantidad,
            element.Valor,
            element.UltimaEntrega,
            element.Comentario,
            element.Id,
            element.Author.Title,
            element.ResponsableSAPId,
            element.NumeroRecepcion,
            element.recibidoSap,
            element.NumeroPedido,
            adjuntoEntregaBienes);
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