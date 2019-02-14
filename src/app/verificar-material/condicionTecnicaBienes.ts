import { Adjunto } from "./adjunto";

export class CondicionesTecnicasBienes {

    constructor(public IdBienes: number,
        public codigo: string,
        public descripcion: string,
        public modelo: string,
        public fabricante: string,
        public claseSIA: string,
        public cantidad: number,
        public valorEstimado?: string,
        public comentario?: string,
        public codigoSondeo?: string,
        public cantidadSondeo?: number,
        public precioSondeo?: string,
        public comentarioSondeo?: string,
        public codigoverificar?: string,
        public descripcionverificar?: string,
        public modeloverificar?: string,
        public fabricanteverificar?: string,
        public claseSIAverificar?: string,
        public cantidadverificar?: number,
        public existenciasverificar?: number,
        public numreservaverificar?: string,
        public cantidadreservaverificar?: number,
        public moneda?: string,
        public monedaSondeo?: string,
        public adjunto?:any,
        public adjuntoCreacion?:any,
        public adjuntoActivo?: any,
        public costoInversion?: string,
        public numeroCostoInversion?: string,
        public numeroCuenta?: string) { }

    public static fromJson(element: any) {

        let adjuntosBienes: Adjunto[] = [];
        let adjuntoCreacion: Adjunto;
        let adjuntoSondeo: Adjunto;
        let adjuntoActivo: Adjunto;

        let arrayAdjuntos = element.AttachmentFiles.results;
        for (let i = 0; i < arrayAdjuntos.length; i++) {
            adjuntosBienes.push(new Adjunto(element.Id, arrayAdjuntos[i].FileName, arrayAdjuntos[i].ServerRelativeUrl));
        }

        adjuntoSondeo = CondicionesTecnicasBienes.ObtenerAdjunto("sondeoBienes-", adjuntosBienes, adjuntoSondeo);
        adjuntoCreacion = CondicionesTecnicasBienes.ObtenerAdjunto("solp-", adjuntosBienes, adjuntoCreacion);
        //adjuntoActivo = CondicionesTecnicasBienes.ObtenerAdjunto("ActivoVM-", adjuntosBienes, adjuntoActivo);

        return new CondicionesTecnicasBienes(element.Id,
            element.Codigo,
            element.Descripcion,
            element.Modelo,
            element.Fabricante,
            element.ClaseSIA,
            element.Cantidad,
            element.ValorEstimado,
            element.Comentarios, element.CodigoSondeo, element.CantidadSondeo, element.PrecioSondeo, element.ComentarioSondeo,
            element.CodigoVerificar,
            element.DescripcionVerificar,
            element.ModeloVerificar,
            element.FabricanteVerificar,
            element.ClaseSIAVerificar,
            element.CantidadVerificar,
            element.ExistenciasVerificar,
            element.NumReservaVerificar,
            element.CantidadReservaVerificar,
            element.TipoMoneda,
            element.MonedaSondeo,
            adjuntoSondeo,
            adjuntoCreacion,
            element.costoInversion,
            element.numeroCostoInversion,
            element.numeroCuenta);
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