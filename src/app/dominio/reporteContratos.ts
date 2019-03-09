export class ReporteContratos {
    constructor(public titulo: string,
        public tipoContrato: string,
        public numSolpSap: string,
        public contrato: string,
        public requiereNumOrdenInicio: boolean,
        public objContrato: string,
        public fechaFirmaContrato: Date,
        public contratoObra: boolean,
        public fechaEntregaCSC: Date,
        public fechaEnvioProveedor: Date,
        public fechaDevolucionProveedor: Date,
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
        public requierePoliza: boolean) {}

        public static fromJson(element: any) {
            return new ReporteContratos(element.Title,
                element.TipoContrato,
                element.NumSolpSap,
                element.CM,
                element.RequiereNumOrdenInicio,
                element.ObjContrato,
                element.FechaFirmaContrato,
                element.ContratoObra,
                element.FechaEntregaCSC,
                element.FechaEnvioProveedor,
                element.FechaDevolucionProveedor,
                element.MonedaContrato,
                element.TMRSAP,
                element.IvaContrato,
                element.ValorContractual,
                element.ValorFinalSinIVa,
                element.ValorFinal,
                element.Referencia,
                element.LineaBaseContrato,
                element.AhorroGenerado,
                element.DescripcionCalculoAhorroGenerado,
                element.VigenciaContrato,
                element.RequiereSST,
                element.RequierePoliza)
            }

        public static fromJsonList(elements: any) {
            var list = [];
            for (var i = 0; i < elements.length; i++) {
                list.push(this.fromJson(elements[i]));
            }
            return list;
        } 
}