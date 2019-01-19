export class RecepcionBienes {
    constructor(public Idbienes:number ,public descripcion:string, public cantidad:number, public valor:string, public ultimaEntrega:boolean, public comentario?:string, public IdRecepcionBienes?:number, public ultimaEntregaCTB?:boolean, public estadoRB?:string, public fechaRecepcion?:Date){

    }

    public static fromJson(element: any) {          
        return new RecepcionBienes(element.IdCTBienesId,element.Descripcion, element.Cantidad, element.Valor, element.UltimaEntrega, element.Comentario, element.Id, false,element.Estado, element.FechaRecepcion);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}