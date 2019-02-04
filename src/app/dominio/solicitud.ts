export class Solicitud {
    constructor(
        public titulo: string,
        public tipoSolicitud: string,
        public cm: string,
        public solicitante: string,
        public empresa: any,
        public ordenadorGastos: any,
        public pais: any,
        public categoria: string,
        public subcategoria: string,
        public comprador: any,
        public codigoAriba: string,
        public fechaEntregaDeseada: Date,
        public alcance: string,
        public justificacion: string,
        public condicionesContractuales: any,
        public estado?: string,
        public responsable?: number,
        public compraBienes?: boolean,
        public compraServicios?: boolean,
        public consecutivo?: number,
        public autor?: number,
        public nombreResponsable?: any,
        public compraOrdenEstadistica?: boolean,
        public numeroOrdenEstadistica?: string,
        public id?: number,
        public FaltaRecepcionBienes?: boolean,
        public FaltaRecepcionServicios?: boolean,
        public FueSondeo?: boolean) { }

    public static fromJson(element: any) {
        return new Solicitud(
            element.Title, 
            element.TipoSolicitud, 
            element.CM, 
            element.Solicitante, 
            element.Empresa, 
            element.OrdenadorGastos, 
            element.Pais, 
            element.Categoria, 
            element.Subcategoria,
            element.Comprador,
            element.CodigoAriba,
            element.FechaDeseadaEntrega, 
            element.Alcance, 
            element.Justificacion, 
            element.CondicionesContractuales, 
            element.Estado, 
            element.Responsable,
            element.CompraBienes,
            element.CompraServicios,
            element.Consecutivo,
            element.AuthorId,
            element.Responsable.Title,
            element.OrdenEstadistica,
            element.NumeroOrdenEstadistica,
            element.ID,
            element.FaltaRecepcionBienes,
            element.FaltaRecepcionServicios,
            element.FueSondeo);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}