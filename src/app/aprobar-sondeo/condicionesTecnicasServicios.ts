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
        public RutaArchivo?:string) { }

    public static fromJson(element: any) {
        let RutaArchivo;
        if (element.Attachments === true) {
            RutaArchivo = element.AttachmentFiles.results[0].ServerRelativeUrl
        }
        else {
            RutaArchivo = "false"
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