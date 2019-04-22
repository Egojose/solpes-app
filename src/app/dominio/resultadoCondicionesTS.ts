import { Adjunto } from "./adjunto";

export class resultadoCondicionesTS {

    constructor(public IdBienes: number,
        public codigoVerificar: string,
        public descripcion: string,              
        public cantidad: number,
        public valorEstimado?: number,
        public precioSondeo?: number,
        public moneda?: string,
        public monedaSondeo?: string,
        public codigoServicios?: string,
        public cantidadServicios?: number,
        public comentariosServicios?: string,
        public adjuntoCreacion?: any,
        public adjuntoSondeo?: any,
        public idContrato?: string) { }

    public static fromJson(element: any) {

        let adjuntosServicios: Adjunto [] = [];
        let adjuntoCreacion: Adjunto;
        let adjuntoSondeo: Adjunto;

        let arrayAdjuntos = element.AttachmentFiles.results;
        for (let i = 0; i < arrayAdjuntos.length; i++){
            adjuntosServicios.push(new Adjunto(element.Id, arrayAdjuntos[i].FileName, arrayAdjuntos[i].ServerRelativeUrl));
        }

        adjuntoSondeo = resultadoCondicionesTS.ObtenerAdjunto("sondeoServicios-", adjuntosServicios, adjuntoSondeo);
        adjuntoCreacion = resultadoCondicionesTS.ObtenerAdjunto("solp-", adjuntosServicios, adjuntoCreacion);

        return new resultadoCondicionesTS(
            element.Id, 
            element.CodigoSondeo, 
            element.Descripcion,                       
            element.CantidadSondeo,
            element.ValorEstimado,
            element.PrecioSondeo, 
            element.TipoMoneda,
            element.MonedaSondeo,
            element.Codigo,
            element.Cantidad,
            element.Comentario,
            adjuntoCreacion, 
            adjuntoSondeo,
            element.IdContrato);
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
        else{
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