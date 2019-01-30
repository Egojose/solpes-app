export class CondicionTecnicaServicios{
    constructor(
        public titulo: string,
        public idSolicitud: any,
        public codigo: string,
        public codigoSondeo: string,
        public descripcion: string,
        public cantidad: number,
        public cantidadSondeo:number,
        public valorEstimado: number,
        public precioSondeo: string,
        public comentarios: string,
        public comentarioSondeo: string,
        public adjunto?: any,
        public archivo?: any,
        public tipoMoneda?: string,
        public id?: number,
        ) { }

    public static fromJson(element: any) {

        let RutaArchivo = "";
        if (element.Attachments ===true) {
           let ObjArchivos = element.AttachmentFiles.results;
            
           ObjArchivos.forEach(element => {
               let objSplit = element.FileName.split("-");
               if (objSplit.length>0) {
                   let TipoArchivo = objSplit[0]
                   if (TipoArchivo==="sondeoServicios") {
                        RutaArchivo=element.ServerRelativeUrl;
                   }                
               }
           });
        }
        
        let Archivo = "";
        if (element.Attachments ===true) {
           let ObjArchivos = element.AttachmentFiles.results;
            
           ObjArchivos.forEach(element => {
               let objSplit = element.FileName.split("-");
               if (objSplit.length>0) {
                   let TipoArchivo = objSplit[0]
                   if (TipoArchivo==="solp") {
                        Archivo=element.ServerRelativeUrl;
                   }                
               }
           });
        }       

        return new CondicionTecnicaServicios(element.Title,
            element.Solicitud,
            element.Codigo,
            element.CodigoSondeo,
            element.Descripcion,
            element.Cantidad,
            element.CantidadSondeo,
            element.ValorEstimado,
            element.PrecioSondeo,
            element.Comentario,
            element.ComentarioSondeo,
            RutaArchivo,
            Archivo,
            element.TipoMoneda,
            element.ID);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}