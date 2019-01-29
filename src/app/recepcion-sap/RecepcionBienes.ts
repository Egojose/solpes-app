export class RecepcionBienes {
    constructor(
        public IdSolicitud: number,
        public Idbienes:number ,
        public descripcion:string, 
        public cantidad:number, 
        public valor:string, 
        public ultimaEntrega:boolean, 
        public comentario?:string, 
        public IdRecepcionBienes?:number, 
        public ultimaEntregaCTB?:boolean, 
        public Author?: any, 
        public Editor?: any, 
        public NumeroRecepcion?: string, 
        public recibidoSap?: boolean,
        public adjunto?: any){}

    public static fromJson(element: any) {
        
        let RutaArchivo = "";
        if (element.Attachments ===true) {
           let ObjArchivos = element.AttachmentFiles.results;
            
           ObjArchivos.forEach(element => {
               let objSplit = element.FileName.split("-");
               if (objSplit.length>0) {
                   let TipoArchivo = objSplit[0]
                   if (TipoArchivo==="EntregaBienes") {
                        RutaArchivo=element.ServerRelativeUrl;
                   }                
               }
           });
        }

        return new RecepcionBienes(
            element.IdSolicitud,
            element.IdCTBienesId,
            element.Descripcion, 
            element.Cantidad, 
            element.Valor, 
            element.UltimaEntrega, 
            element.Comentario, 
            element.Id,
            null,
            element.Author, 
            element.Editor.Title, 
            element.NumeroRecepcion, 
            element.recibidoSap,
            RutaArchivo);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}