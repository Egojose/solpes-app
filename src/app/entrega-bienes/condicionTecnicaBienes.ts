export class CondicionesTecnicasBienes {

    constructor(
        public IdBienes:number,
        public codigo:string, 
        public descripcion:string, 
        public modelo:string, 
        public fabricante:string, 
        public claseSIA:string, 
        public cantidad:number, 
        public cantidadRecibida:number,
        public totalCantidad:number, 
        public UltimaEntregaCTB:boolean){

    }

    public static fromJson(element: any) {
        return new CondicionesTecnicasBienes(element.Id ,element.CodigoVerificar, element.DescripcionVerificar, element.Modelo, element.FabricanteVerificar, element.ClaseSIAVerificar, element.CantidadVerificar, element.CantidadRecibida, element.CantidadVerificar-element.CantidadRecibida,element.UltimaEntrega);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }


}