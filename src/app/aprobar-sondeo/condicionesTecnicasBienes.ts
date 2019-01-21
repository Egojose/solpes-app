export class CondicionesTecnicasBienes {

    constructor(public IdBienes: number,
        public CodigoSondeo: string,
        public descripcion: string,
        public CantidadSondeo: number,
        public PrecioSondeo: number,
        public ComentarioSondeo: string,
        public Estado?: any
    ) {

    }

    public static fromJson(element: any) {
        return new CondicionesTecnicasBienes(element.Id ,element.CodigoSondeo, element.Descripcion, element.CantidadSondeo, element.PrecioSondeo, element.ComentarioSondeo, element.Estado);
    }


    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }


}