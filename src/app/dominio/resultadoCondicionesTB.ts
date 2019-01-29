export class resultadoCondicionesTB {

    constructor(public IdBienes: number,
        public codigo: string,
        public descripcion: string,
        public modelo: string,
        public fabricante: string,
        public cantidad: string,        
        public cantidadComprar?: number,
        public valorEstimado?: string,
        public precioSondeo?: string,
        public moneda?: string,
        public adjunto?: string) { console.log(this.adjunto) }

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
                   else {
                    RutaArchivo == null; 
                   }
                
               }
           });
        }        

        return new resultadoCondicionesTB(element.Id, 
            element.CodigoVerificar, 
            element.DescripcionVerificar, 
            element.ModeloVerificar, 
            element.Fabricante,
            element.CantidadVerificar,             
            element.CantidadReservaVerificar, 
            element.ValorEstimado, 
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