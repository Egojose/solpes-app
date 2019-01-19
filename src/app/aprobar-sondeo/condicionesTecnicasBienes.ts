export class CondicionesTecnicasBienes {

    constructor(public IdBienes: number,
        public codigo: string,
        public descripcion: string,
        public modelo: string,
        public fabricante: string,
        public claseSIA: string,
        public cantidad: number,
        public cantidadRecibida:number,
        public totalCantidad:number,
        public UltimaEntregaCTB:boolean,
        public valorEstimado?: string,
        public comentario?: string,
        public CodigoVerificar?: string,
        public ModeloVerificar?: string,
        public FabricanteVerificar?: string,
        public ClaseSIAVerificar?: string,
        public CantidadVerificar?: number,
        public ExistenciasVerificar?: number,
        public NumReservaVerificar?: string,
        public CantidadReservaVerificar?: number,
        public EntradaSolicitanteVerificar?: string,
        public CodigoSondeo?: string,
        public CantidadSondeo?: number,
        public PrecioSondeo?: number,
        public ComentarioSondeo?: string,
        public Estado?: any
    ) {

    }

    public static fromJson(element: any) {
        return new CondicionesTecnicasBienes(element.Id ,element.CodigoVerificar, element.Descripcion, element.Modelo, element.FabricanteVerificar, element.ClaseSIAVerificar, element.CantidadVerificar, element.CantidadRecibida, element.CantidadVerificar-element.CantidadRecibida,element.UltimaEntrega,element.ValorEstimado,element.Comentarios);
    }


    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }


}