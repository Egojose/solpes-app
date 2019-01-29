export class resultadoCondicionesTS {

    constructor(public IdBienes: number,
        public codigo: string,
        public descripcion: string,              
        public cantidad: number,
        public valorEstimado?: string,
        public moneda?: string,
        public adjunto?: any) { }

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

        return new resultadoCondicionesTS(
            element.Id, 
            element.CodigoSondeo, 
            element.Descripcion,                       
            element.CantidadSondeo, 
            element.PrecioSondeo, 
            element.TipoMoneda,
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