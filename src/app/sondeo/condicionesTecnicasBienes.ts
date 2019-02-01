import { Adjunto } from "./adjunto";

export class CondicionesTecnicasBienes {
    
    constructor(public IdBienes: number,
        public codigo: string,
        public descripcion: string,
        public modelo: string,
        public fabricante: string,
        public cantidad: number,
        public cantidadSondeo: number,
        public valorEstimado?: string,
        public tipoMoneda?: string,
        public precioSondeo?: string,
        public Comentario?: string,
        public adjunto?:any,
        public adjuntoCreacion?:any,
        public ComentarioSondeo?: string,
        public codigoSondeo?: string,
        public tipoMonedaSondeo?: string) { }

    public static fromJson(element: any) {

        let adjuntosBienes: Adjunto [] = [];
        let adjuntoCreacion: Adjunto;
        let adjuntoSondeo: Adjunto;
       
        let arrayAdjuntos = element.AttachmentFiles.results;
        for (let i = 0; i < arrayAdjuntos.length; i++){
            adjuntosBienes.push(new Adjunto(element.Id, arrayAdjuntos[i].FileName, arrayAdjuntos[i].ServerRelativeUrl));
        }
        
        adjuntoSondeo = CondicionesTecnicasBienes.ObtenerAdjunto("sondeoBienes-", adjuntosBienes, adjuntoSondeo);
        adjuntoCreacion = CondicionesTecnicasBienes.ObtenerAdjunto("solp-", adjuntosBienes, adjuntoCreacion);

        return new CondicionesTecnicasBienes(element.Id,
            element.Codigo,
            element.Descripcion,
            element.Modelo,
            element.Fabricante,
            element.Cantidad,
            element.CantidadSondeo,
            element.ValorEstimado,
            element.TipoMoneda,
            element.PrecioSondeo,
            element.Comentarios,
            null, //adjunto
            adjuntoCreacion,
            '', //comentario sondeo
            element.CodigoSondeo,
            element.MonedaSondeo);
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