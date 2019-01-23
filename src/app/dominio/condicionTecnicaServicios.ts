export class CondicionTecnicaServicios{
    constructor(
        public indice: number,
        public titulo: string,
        public idSolicitud: any,
        public codigo: string,
        public descripcion: string,
        public cantidad: number,
        public valorEstimado: number,
        public comentarios: string,
        public archivoAdjunto?: File,
        public rutaAdjunto?: string,
        public tipoMoneda?: string,
        public id?: number) { }

    public static fromJson(element: any) {
        return new CondicionTecnicaServicios(
            element.ID,
            element.Title,
            element.Solicitud,
            element.Codigo,
            element.Descripcion,
            element.Cantidad,
            element.ValorEstimado,
            element.Comentario,
            element.AttachmentFiles,
            element.AttachmentFiles,
            element.TipoMoneda,
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