import { Adjunto } from "./adjunto";
export class CondicionesTecnicasBienes {

    constructor(public IdBienes: number,
        public codigo: string,
        public descripcion: string,
        public modelo: string,
        public fabricante: string,
        public cantidad: number,
        public cantidadRecibida:number,
        public totalCantidad:number,
        public UltimaEntregaCTB:boolean,
        public valorEstimado?: string,
        public comentario?: string,
        public CodigoVerificar?: string,
        public ModeloVerificar?: string,
        public FabricanteVerificar?: string,
        public CantidadVerificar?: number,
        public ExistenciasVerificar?: number,
        public NumReservaVerificar?: string,
        public CantidadReservaVerificar?: number,
        public EntradaSolicitanteVerificar?: string,
        public CodigoSondeo?: string,
        public CantidadSondeo?: number,
        public PrecioSondeo?: number,
        public ComentarioSondeo?: string,
        public Estado?: any,
        public adjuntoSondeo?: any,
        public adjuntoCreacion?: any) {}

    public static fromJson(element: any) {

        let adjuntosBienes: Adjunto [] = [];
        let adjuntoCreacion: Adjunto;
        let adjuntoSondeo: Adjunto;
       
        let arrayAdjuntos = element.AttachmentFiles.results;
        for (let i = 0; i < arrayAdjuntos.length; i++){
            adjuntosBienes.push(new Adjunto(element.Id, arrayAdjuntos[i].FileName, arrayAdjuntos[i].ServerRelativeUrl));
        }
        

        adjuntoSondeo = CondicionesTecnicasBienes.ObtenerAdjuntoSondeo("sondeoBienes-", adjuntosBienes, adjuntoSondeo);
        adjuntoCreacion = CondicionesTecnicasBienes.ObtenerAdjuntoSondeo("solp-", adjuntosBienes, adjuntoCreacion);

        return new CondicionesTecnicasBienes(
            element.Id,
            element.Codigo, 
            element.Descripcion, 
            element.Modelo, 
            element.Fabricante, 
            element.Cantidad, 
            element.CantidadRecibida, 
            element.CantidadVerificar-element.CantidadRecibida,
            element.UltimaEntrega,
            element.ValorEstimado,
            element.Comentarios,
            element.CodigoVerificar,
            element.ModeloVerificar,
            element.FabricanteVerificar,
            element.CantidadVerificar,
            element.ExistenciasVerificar,
            element.NumReservaVerificar,
            element.CantidadReservaVerificar,
            element.EntradaSolicitanteVerificar,
            element.CodigoSondeo,
            element.CantidadSondeo,
            element.PrecioSondeo,
            element.ComentarioSondeo,
            element.Estado,
            adjuntoSondeo,
            adjuntoCreacion);
    }

    private static ObtenerAdjuntoSondeo(identificadorAdjunto: string, adjuntosBienes: Adjunto[], adjuntoRetornar: Adjunto) {
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