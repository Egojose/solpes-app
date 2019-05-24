export class ReporteContratos {
    constructor(
        public tipoContrato: string,
        public numSolpSap: string,
        public contrato: string,
        public requiereNumOrdenInicio: boolean,
        public objContrato: string,
        public contratoObra: boolean,
        public fechaEntregaCSC: string,
        public fechaCargadoDocuSign: string,
        public fechaFirmadoOrdenadorGasto: string,
        public fechaFirmadoProveedor: string,
        public monedaContrato: string,
        public TMRSAP: any,
        public ivaContrato: string,
        public valorContractual: string,
        public valorFinalSinIva: string,
        public valorFinal: string,
        public referencia: string,
        public lineaBaseContrato: string,
        public ahorroGenerado: string,
        public descripcionCalculoAhorro: string,
        public vigenciaContrato: string,
        public requiereSST: boolean,
        public requierePoliza: boolean,
        public fechaEntregaPoliza: string,
        public fechaEntregaRealPoliz: string,
        public fechaEstadoPoliza:string,
        public condicionPoliza: string,
        public acreedor: string,
        public digitoVerifiacion: string,
        public nombreProveedor: string,
        public emailProveedor: string,
        public solicitante: string,
        public comprador: string,
        public observacionesAdicionales: string,
        public consecutivo: any,
        public aribaSourcing: string,
        public causalExcepcion: string) {}

        public static fromJson(element: any) {
            return new ReporteContratos(
                element.TipoContrato,
                element.NumSolpSAP,
                element.CM,
                element.RequiereNumOrdenInicio,
                element.ObjContrato,
                element.ContratoObra,
                element.FechaEntregaCSC !== null ? ReporteContratos.ObtenerFormatoFecha(new Date(element.FechaEntregaCSC)) : "",
                element.FechaEnvioProveedor !== null ? ReporteContratos.ObtenerFormatoFecha(new Date(element.FechaEnvioProveedor)) : "",
                element.FechaFirmaContrato !== null ? ReporteContratos.ObtenerFormatoFecha(new Date(element.FechaFirmaContrato)) : "" ,
                element.FechaDevolucionProveedor !== null ? ReporteContratos.ObtenerFormatoFecha(new Date(element.FechaDevolucionProveedor)) : "",
                element.MonedaContrato,
                element.TMRSAP,
                element.IvaContrato,
                element.ValorContractual,
                element.ValorFinalSinIva,
                element.ValorFinal,
                element.Referencia,
                element.LineaBaseContrato,
                element.AhorroGenerado,
                element.DescripcionCalculoAhorroGenerado,
                element.VigenciaContrato,
                element.RequiereSST,
                element.RequierePoliza,
                element.FechaEntregaPoliza !== null ? ReporteContratos.ObtenerFormatoFecha(new Date(element.FechaEntregaPoliza)) : "",
                element.FechaEntregaRealPoliza !== null ? ReporteContratos.ObtenerFormatoFecha(new Date(element.FechaEntregaRealPoliza)) : "",
                element.FechaEstadoPoliza !== null ? ReporteContratos.ObtenerFormatoFecha(new Date(element.FechaEstadoPoliza)) : "",
                element.CondicionPoliza,
                element.Acreedor,
                element.DigitoVerificacion,
                element.NombreProveedor,
                element.EmailProveedor,
                element.Solicitante,
                element.Comprador,
                element.ObservacionesAdicionales,
                element.Solicitud.Consecutivo,
                element.AribaSourcing,
                element.CausalExcepcion)
            }

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
            return [year, month, day].join('-');
        } 
}