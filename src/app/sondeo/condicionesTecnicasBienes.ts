export class CondicionesTecnicasBienes {


    constructor(public IdBienes: number,
        public codigo: string,
        public descripcion: string,
        public modelo: string,
        public fabricante: string,        
        public cantidad: number,
        public valorEstimado?: string,
        public Comentario?: string,        
        public archivoAdjunto?: any,
        public ComentarioSondeo?:string  
        ) {}

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

        return new CondicionesTecnicasBienes(element.Id, 
            element.Codigo, 
            element.Descripcion, 
            element.Modelo, 
            element.Fabricante,
            element.Cantidad,
            element.ValorEstimado, 
            element.Comentarios,
            RutaArchivo,
            element.ComentarioSondeo);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }


}