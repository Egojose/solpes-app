export class ReporteSolicitud {
    constructor(
        public consecutivo: string,
        public estado: string,
        public Responsable: string,
        public tipoSolicitud: string,
        public numeroSolpSap: string,
        public solicitante: string,
        // public numeroContrato: string,
        public ordenadorGastos: any,
        public comprador: any,
        public categoria: string,
        public subcategoria: string,
        public pais: any,
        public alcance: string,
        public fueSondeo: boolean,
        public fechaSolicitud: string,
        public fechaSondeo: string,
        public fechaRevisarSodeo: string,
        public fechaVerificarMaterial: string,
        public fechaRegistrarActivo: string,
        public fechaRegistrarSolpSap: string,
        public fechaSuspension: string,
        public fechaFinSuspension: string,
        public motivoSuspension: string,
        public fechaRegistrarContrato: string,
        public fechaEnvioProveedor: string,
        public ReasignaEnSondeo: string,
        public fechaReasignadoSondeo: string,
        public ReasignaEnContratos: string,
        public fechaReasignadoContratos: string,
        public departamento?: string,
        public fechaAcordada?: string,
        public cuadrante?:string
        ) {}

        
        public static fromJson(element: any) {
            return new ReporteSolicitud(
                element.Consecutivo,
                element.Estado,
                element.Responsable.Title,
                element.TipoSolicitud,
                element.NumSolSAP,
                element.Solicitante,
                // element.NumeroDeContrato,
                element.OrdenadorGastos.Title,
                element.Comprador.Title,
                element.Categoria,
                element.Subcategoria,
                element.Pais.Title,
                element.Alcance,
                element.FueSondeo,
                element.FechaDeCreacion !== null ? ReporteSolicitud.ObtenerFormatoFecha(new Date(element.FechaDeCreacion)) : "",
                element.FechaSondeo !== null ? ReporteSolicitud.ObtenerFormatoFecha(new Date(element.FechaSondeo)) : "",
                element.FechaRevisarSondeo !== null ? ReporteSolicitud.ObtenerFormatoFecha(new Date(element.FechaRevisarSondeo)) : "",
                element.FechaVerificarMaterial !== null ? ReporteSolicitud.ObtenerFormatoFecha(new Date(element.FechaVerificarMaterial)) : "",
                element.FechaRegistrarActivo !== null ? ReporteSolicitud.ObtenerFormatoFecha(new Date(element.FechaRegistrarActivo)) : "",
                element.FechaRegistrarSolpsap !== null ? ReporteSolicitud.ObtenerFormatoFecha(new Date(element.FechaRegistrarSolpsap)) : "",
                element.FechaSuspension !== null? ReporteSolicitud.ObtenerFormatoFecha(new Date(element.FechaSuspension)) : "" ,
                element.FechaReactivacion !== null? ReporteSolicitud.ObtenerFormatoFecha(new Date(element.FechaReactivacion)) : "",
                element.MotivoDeSuspension,
                element.FechaRegistrarContrato !== null ? ReporteSolicitud.ObtenerFormatoFecha(new Date(element.FechaRegistrarContrato)) : "",
                element.FechaEnvioProveedor !== null ? ReporteSolicitud.ObtenerFormatoFecha(new Date(element.FechaEnvioProveedor)) : "", 
                element.ResponsableReasignarSondeo,
                element.FechaReasignadoSondeo !== null ? ReporteSolicitud.ObtenerFormatoFecha(new Date(element.FechaReasignadoSondeo)) : "",
                element.ResponsableReasignarContratos,
                element.FechaReasignadoContratos !== null ? ReporteSolicitud.ObtenerFormatoFecha(new Date(element.FechaReasignadoContratos)) : "",
                element.Author.Department,
                element.FechaAcordada !== null ? ReporteSolicitud.ObtenerFormatoFecha(new Date(element.FechaAcordada)) : '',
                element.Cuadrante
                
            )}

        public static fromJsonList(elements: any) {
            var list = [];
            for (var i = 0; i < elements.length; i++) {
                list.push(this.fromJson(elements[i]));
            }
            return list;
        }

        public static ObtenerFormatoFecha(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            return [day, month, year].join('-');
        } 
}