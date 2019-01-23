export class resultadoCondicionesTB {

    constructor(public IdBienes: number,
        public codigo: string,
        public descripcion: string,
        public modelo: string,
        public fabricante: string,        
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
                   if (TipoArchivo==="sondeoBienes") {
                        RutaArchivo=element.ServerRelativeUrl;
                   }
                
               }
           });
        }        

        return new resultadoCondicionesTB(element.Id, 
            element.Codigo, 
            element.Descripcion, 
            element.Modelo, 
            element.Fabricante,             
            element.CantidadVerificar, 
            element.ValorEstimado, 
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