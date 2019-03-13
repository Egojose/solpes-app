export class ReporteSolicitud {
    constructor(
        public consecutivo: string,
        public estado: string,
        public tipoSolicitud: string,
        public numeroSolpSap: string,
        public solicitante: string,
        public numeroContrato: string,
        public cm: string,
        public ordenadorGastos: any,
        public comprador: any,
        public categoria: string,
        public subcategoria: string,
        public pais: any,
        public alcance: string,
        public fueSondeo: boolean,
        public fechaSolicitud: Date,
        public fechaSondeo: Date,
        public fechaRevisarSodeo: Date,
        public fechaVerificarMaterial: Date,
        public fechaRegistrarActivo: Date,
        public fechaRegistrarSolpSap: Date,
        public fechaRegistrarContrato: Date,
        public fechaEnvioProveedor: Date,
        public departamento?: string) {}

        
        public static fromJson(element: any) {
            return new ReporteSolicitud(
                element.Consecutivo,
                element.Estado,
                element.TipoSolicitud,
                element.NumSolSAP,
                element.Solicitante,
                element.NumeroDeContrato,
                element.CM,
                element.OrdenadorGastos.Title,
                element.Comprador.Title,
                element.Categoria,
                element.Subcategoria,
                element.Pais.Title,
                element.Alcance,
                element.FueSondeo,
                element.FechaDeCreacion,
                element.FechaSondeo,
                element.FechaRevisarSondeo,
                element.FechaVerificarMaterial,
                element.FechaRegistrarActivo,
                element.FechaRegistrarSolpsap,
                element.FechaRegistrarContrato,
                element.FechaEnvioProveedor, 
                element.Author.Department)
        }

        public static fromJsonList(elements: any) {
            var list = [];
            for (var i = 0; i < elements.length; i++) {
                list.push(this.fromJson(elements[i]));
            }
            return list;
        }
}