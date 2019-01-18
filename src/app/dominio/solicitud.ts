export class Solicitud {
    constructor(
        public titulo: string,
        public tipoSolicitud: string,
        public cm: string,
        public solicitante: string,
        public empresa: number,
        public ordenadorGastos: number,
        public pais: number,
        public categoria: string,
        public subcategoria: string,
        public comprador: string,
        public fechaEntregaDeseada: Date,
        public alcance: string,
        public justificacion: string,
        public condicionesContractuales: any,
        public estado?: string,
        public id?: number) { }

    public static fromJson(element: any) {
        return new Solicitud(element.Title, 
            element.TipoSolicitud, 
            element.CM, 
            element.Solicitante, 
            element.Empresa, 
            element.OrdenadorGastos, 
            element.Pais, 
            element.Categoria, 
            element.Subcategoria,
            element.Comprador,
            element.FechaDeseadaEntrega, 
            element.Alcance, 
            element.Justificacion, 
            element.CondicionesContractuales, 
            element.Estado, 
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