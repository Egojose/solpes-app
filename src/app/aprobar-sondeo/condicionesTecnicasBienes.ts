import { Adjunto } from "./adjunto";

export class CondicionesTecnicasBienes {

    constructor(
        public IdBienes: number,
        public CodigoSondeo: string,
        public descripcion: string,
        public CantidadSondeo: number,
        public PrecioSondeo: number,
        public ComentarioSondeo: string,
        public Estado?: any,
        public adjunto?:any,
        public adjuntoCreacion?:any,
        public Codigo?: string, 
        public Modelo?: string,
        public Fabricante?: string,
        public Cantidad?: number,
        public ValorEstimado?: string,
        public Comentarios?: string) {}

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
        
        return new CondicionesTecnicasBienes(
            element.Id,
            element.CodigoSondeo,
            element.Descripcion,
            element.CantidadSondeo,
            element.PrecioSondeo, 
            element.ComentarioSondeo, 
            element.Estado,
            //RutaArchivo,Archivo,
            adjuntoSondeo,
            adjuntoCreacion,
            element.Codigo, 
            element.Modelo, 
            element.Fabricante, 
            element.Cantidad, 
            element.ValorEstimado, 
            element.Comentarios);
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