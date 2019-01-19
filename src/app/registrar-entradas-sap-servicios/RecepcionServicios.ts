export class RecepcionServicios {
    constructor(public Idservicios: number, public descripcion: string, public ubicacion: string, public cantidad: number, public mes: string, public valor: string, public comentario?: string, public IdRecepcionServicios?: number, public ultimaEntregaCTB?: boolean,public NumeroRecepcion?: string, public recibidoSap?: boolean) {

    }

    public static fromJson(element: any) {
        return new RecepcionServicios(element.IdCTServiciosId, element.Descripcion, element.Ubicacion, element.Cantidad, element.Mes, element.Valor, element.Comentario, element.Id, element.NumeroRecepcion, element.recibidoSap);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}