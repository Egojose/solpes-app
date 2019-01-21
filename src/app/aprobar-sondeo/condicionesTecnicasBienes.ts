export class CondicionesTecnicasBienes {

    constructor(public IdBienes: number,
        public CodigoSondeo: string,
        public descripcion: string,
        public CantidadSondeo: number,
        public PrecioSondeo: number,
        public Comentario: string,
        public Estado?: any,
        public RutaArchivo?:string            
    ) {

    }

    public static fromJson(element: any) {
        let RutaArchivo;
        if (element.Attachments === true) {
            RutaArchivo = element.AttachmentFiles.results[0].ServerRelativeUrl
        }
        else {
            RutaArchivo = "false"
        }
        return new CondicionesTecnicasBienes(element.Id ,element.CodigoSondeo, element.Descripcion, element.CantidadSondeo, element.PrecioSondeo, element.Comentario, element.Estado,RutaArchivo);
    }


    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }


}