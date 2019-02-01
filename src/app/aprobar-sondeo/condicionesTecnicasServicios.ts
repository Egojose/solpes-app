export class CondicionTecnicaServicios{
    constructor(        
        public titulo: string,
        public idSolicitud: any,
        public codigoSondeo: string,
        public descripcion: string,
        public cantidadSondeo: number,
        public precioSondeo: number,
        public comentarioSondeo: string,
        public adjunto?: any,
        public id?: number,
        public RutaArchivo?:string,
        public archivo?: any,
        public Codigo?: string,
        public Cantidad?: number,
        public ValorEstimado?: string,
        public Comentario?: string,
        public moneda?: string,
        public monedaSondeo?: string) { }

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

        return new CondicionTecnicaServicios(
            element.Title,
            element.SolicitudId,
            element.CodigoSondeo,
            element.Descripcion,
            element.CantidadSondeo,
            element.PrecioSondeo,
            element.ComentarioSondeo,
            null,
            element.Id,
            RutaArchivo,
            Archivo,
            element.Codigo,
            element.Cantidad,
            element.ValorEstimado,
            element.Comentario,
            element.TipoMoneda,
            element.MonedaSondeo);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}