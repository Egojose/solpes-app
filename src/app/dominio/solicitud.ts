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
        public cuadrante: string,
        public fechaEntregaDeseada: Date,
        public alcance: string,
        public justificacion: string,
        public condicionesContractuales: any,
        public estado?: string,
        public responsable?: any,
        public compraBienes?: boolean,
        public compraServicios?: boolean,
        public consecutivo?: number,
        public autor?: number,
        public nombreResponsable?: any,
        public compraOrdenEstadistica?: boolean,
        public numeroOrdenEstadistica?: string,
        public solicitantePersona?: any,
        public id?: number,
        public FaltaRecepcionBienes?: boolean,
        public FaltaRecepcionServicios?: boolean,
        public FueSondeo?: boolean,
        public fechaCreacion?: Date,
        public suspendida?: boolean,
        public reactivada?: boolean,
        public categoriaReasignar?: string,
        public subcategoriaReasignar?: string
       ) { }

    public static fromJson(element: any) {
        return new Solicitud(
            element.Title, 
            element.TipoSolicitud, 
            element.CM, 
            element.Solicitante, 
            (element.Empresa != null) ? element.Empresa : null, 
            (element.OrdenadorGastos) ? element.OrdenadorGastos : null, 
            (element.Pais != null) ? element.Pais : null, 
            element.Categoria, 
            element.Subcategoria,
            (element.Comprador != null) ? element.Comprador : null,
            element.CodigoAriba,
            element.Cuadrante,
            element.FechaDeseadaEntrega, 
            element.Alcance, 
            element.Justificacion, 
            element.CondicionesContractuales, 
            element.Estado, 
            (element.Responsable != null) ? element.Responsable : null,
            element.CompraBienes,
            element.CompraServicios,
            element.Consecutivo,
            element.AuthorId,
            (element.Responsable != null) ? element.Responsable.Title : null,
            element.OrdenEstadistica,
            element.NumeroOrdenEstadistica,
            element.SolicitantePersonaId,
            element.ID,
            element.FaltaRecepcionBienes,
            element.FaltaRecepcionServicios,
            element.FueSondeo,
            element.FechaDeCreacion,
            element.Suspendida,
            element.Reactivada,
            element.CategoriaReasignar,
            element.SubcategoriaReasignar
           );
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}