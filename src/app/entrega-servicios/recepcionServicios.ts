export class RecepcionServicios{

    constructor( public idServicio:number, public descripcion:string, public cantidad:number, public valor:string,public ultimaEntrega:boolean, public comentario?: string, public ubicacion?:string, public mes?:string ,public IdRecepcionServicios?:number, public ultimaEntregaCTS?:boolean, public estadoRS?:string ,public fechaRecepcion?:Date){

    }

    public static fromJson(element: any) {          
        return new RecepcionServicios(element.IdCTServiciosId, element.Descripcion, element.Cantidad, element.Valor, element.UltimaEntrega, element.Comentario, element.Ubicacion, element.Mes ,element.Id , false,element.Estado,element.FechaRecepcion);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}