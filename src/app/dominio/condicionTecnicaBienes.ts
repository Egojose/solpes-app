export class CondicionTecnicaBienes {
    constructor(
        public indice: number,
        public titulo: string,
        public idSolicitud: any,
        public codigo: string,
        public descripcion: string,
        public modelo: string,
        public fabricante: string,
        public cantidad: number,
        public valorEstimado: number,
        public comentarios: string,
        public archivoAdjunto?: File,
        public rutaAdjunto?: string,
        public tipoMoneda?: string,
        public id?: number) { }

    public static fromJson(element: any) {
        return new CondicionTecnicaBienes(
            element.ID,
            element.Title,
            element.Solicitud,
            element.Codigo,
            element.Descripcion,
            element.Modelo,
            element.Fabricante,
            element.Cantidad,
            element.ValorEstimado,
            element.Comentarios,
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