export class CondicionesTecnicasServicios{

    constructor(
        public IdServicio:number, 
        public codigo:string, 
        public descripcion:string, 
        public cantidad:number, 
        public cantidadRecibida:number, 
        public totalCantidad:number, 
        public ultimaEntregaCTS:boolean, 
        public comentarios: string){

    }

    public static fromJson(element: any) {
        return new CondicionesTecnicasServicios(
            element.Id ,
            element.CodigoSondeo, 
            element.Descripcion, 
            element.CantidadSondeo, 
            element.CantidadRecibida, 
            element.CantidadSondeo-element.CantidadRecibida,
            element.UltimaEntrega, 
            element.ComentarioSondeo);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list; 
    }
}