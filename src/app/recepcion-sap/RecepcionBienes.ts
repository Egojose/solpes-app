export class RecepcionBienes {
    constructor(public Idbienes:number ,public descripcion:string, public cantidad:number, public valor:string, public ultimaEntrega:boolean, public comentario?:string, public IdRecepcionBienes?:number, public ultimaEntregaCTB?:boolean, public Author?: any, public Editor?: any, public NumeroRecepcion?: string, public recibidoSap?: boolean){

    }

    public static fromJson(element: any) {
        return new RecepcionBienes(element.IdCTBienesId,element.Descripcion, element.Cantidad, element.Valor, element.UltimaEntrega, element.Comentario, element.Id, element.Editor, element.NumeroRecepcion, element.recibidoSap);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}