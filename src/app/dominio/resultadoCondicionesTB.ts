import { Adjunto } from "./adjunto";

export class resultadoCondicionesTB {

    constructor(
        public IdBienes: number,
        public codigoVerificar: string,
        public descripcion: string,
        public modelo: string,
        public fabricante: string,
        public cantidad: string,
        public cantidadComprar?: number,
        public valorEstimado?: string,
        public precioSondeo?: string,
        public moneda?: string,
        public monedaSondeo?: string,
        public codigoBienes?: string,
        public modeloBienes?: string,
        public fabricanteBienes?: string,
        public cantidadBienes?: number,
        public comentariosBienes?: string,
        public adjuntoCreacion?: any,
        public adjuntoSondeo?: any) { }

    public static fromJson(element: any) {

        let adjuntosBienes: Adjunto [] = [];
        let adjuntoCreacion: Adjunto;
        let adjuntoSondeo: Adjunto;

        let arrayAdjuntos = element.AttachmentFiles.results;
        for (let i = 0; i < arrayAdjuntos.length; i++){
            adjuntosBienes.push(new Adjunto(element.Id, arrayAdjuntos[i].FileName, arrayAdjuntos[i].ServerRelativeUrl));
        }

        adjuntoSondeo = resultadoCondicionesTB.ObtenerAdjunto("sondeoBienes-", adjuntosBienes, adjuntoSondeo);
        adjuntoCreacion = resultadoCondicionesTB.ObtenerAdjunto("solp-", adjuntosBienes, adjuntoCreacion);

        return new resultadoCondicionesTB(element.Id,
            element.CodigoVerificar,
            element.DescripcionVerificar,
            element.ModeloVerificar,
            element.FabricanteVerificar,
            element.CantidadVerificar,
            element.CantidadReservaVerificar,
            element.ValorEstimado,
            element.PrecioSondeo,
            element.TipoMoneda,
            element.MonedaSondeo,
            element.Codigo,
            element.Modelo,
            element.Fabricante,
            element.Cantidad,
            element.Comentarios,
            adjuntoCreacion, 
            adjuntoSondeo);
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