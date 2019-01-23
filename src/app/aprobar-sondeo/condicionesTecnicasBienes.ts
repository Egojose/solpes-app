export class CondicionesTecnicasBienes {

    constructor(public IdBienes: number,
        public CodigoSondeo: string,
        public descripcion: string,
        public CantidadSondeo: number,
        public PrecioSondeo: number,
        public ComentarioSondeo: string,
        public Estado?: any,
        public RutaArchivo?:string,
        public Codigo?: string, 
        public Modelo?: string,
        public Fabricante?: string,
        public Cantidad?: number,
        public ValorEstimado?: string,
        public Comentarios?: string

    ) {

    }

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
        return new CondicionesTecnicasBienes(element.Id ,element.CodigoSondeo, element.Descripcion, element.CantidadSondeo, element.PrecioSondeo, element.ComentarioSondeo, element.Estado,RutaArchivo,
            element.Codigo, element.Modelo, element.Fabricante, element.Cantidad, element.ValorEstimado, element.Comentarios);
    }


    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }


}