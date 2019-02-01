import { Adjunto } from "./adjunto";

export class CondicionTecnicaServicios{
  IdServicios: any;
 
  constructor(
    public titulo: string,
    public idSolicitud: any,
    public codigo: string,
    public codigoSondeo: string,
    public descripcion: string,
    public cantidad: number,
    public valorEstimado: number,
    public comentarios: string,
    public tipoMoneda?: string,
    public PrecioSondeo?: number,
    public id?: number,
    public adjunto?:any,
    public adjuntoCreacion?:any,
    public ComentarioSondeo?: string,
    public tipoMonedaSondeo?: string) { }

    public static fromJson(element: any) {

        let adjuntosServicios: Adjunto [] = [];
        let adjuntoCreacion: Adjunto;
        let adjuntoSondeo: Adjunto;
       
        let arrayAdjuntos = element.AttachmentFiles.results;
        for (let i = 0; i < arrayAdjuntos.length; i++){
            adjuntosServicios.push(new Adjunto(element.Id, arrayAdjuntos[i].FileName, arrayAdjuntos[i].ServerRelativeUrl));
        }
        
        adjuntoSondeo = CondicionTecnicaServicios.ObtenerAdjunto("sondeoServicios-", adjuntosServicios, adjuntoSondeo);
        adjuntoCreacion = CondicionTecnicaServicios.ObtenerAdjunto("solp-", adjuntosServicios, adjuntoCreacion);

        return new CondicionTecnicaServicios(element.Title,
            element.Solicitud,
            element.Codigo,
            element.CodigoSondeo,
            element.Descripcion,
            element.Cantidad,
            element.ValorEstimado,
            element.Comentario,
            element.TipoMoneda,
            element.PrecioSondeo,
            element.ID,
            null, //adjuntoSondeo,
            adjuntoCreacion,
            '', //element.ComentarioSondeo
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