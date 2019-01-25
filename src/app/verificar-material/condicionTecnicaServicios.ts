export class CondicionTecnicaServicios{
    constructor(public titulo: string,
        public idSolicitud: any,
        public codigo: string,
        public descripcion: string,
        public cantidad: number,
        public valorEstimado: number,
        public comentarios: string,
        public codigoSondeo?: string,
        public cantidadSondeo?: number,
        public precioSondeo?: string,
        public comentariosSondeo?: string,
        public RutaArchivo?:string,
        public archivo?: any,
        public id?: number) { }

    public static fromJson(element: any) {
        let RutaArchivo = "";
        if (element.Attachments ===true) {
           let ObjArchivos = element.AttachmentFiles.results;
            
           ObjArchivos.forEach(element => {
               let objSplit = element.FileName.split("-");
               if (objSplit.length>0) {
                   let TipoArchivo = objSplit[0]
                   if (TipoArchivo==="solp") {
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
            element.Descripcion,
            element.Cantidad,
            element.ValorEstimado,
            element.Comentario,
            element.CodigoSondeo,
            element.CantidadSondeo,
            element.PrecioSondeo,
            element.ComentarioSondeo,
            RutaArchivo,
            Archivo,
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