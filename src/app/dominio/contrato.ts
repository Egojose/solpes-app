export class Contratos {

    constructor(
        public IdContratos: number,
        public tipoContrato: string,
        public objContrato: string,
        public fechafirmaContrato: Date,
        public nomProveedor: string,
        public solicitante: string,
        public comprador: string
            ) {

    }

    public static fromJson(element: any) {
        return new Contratos(element.Id , element.TipoContrato, element.ObjContrato, element.FechaFirmaContrato,
            element.NombreProveedor, element.Solicitante, element.Comprador);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }


}