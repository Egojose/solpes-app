export class RecepcionBienes {
    constructor(public Idbienes: number,
        public descripcion: string,
        public cantidad: number,
        public valor: string,
        public comentario?: string,
        public IdRecepcionBienes?: number,
        public ultimaEntrega?: boolean,
        public numrecepcion?: string) {
    }

    public static fromJson(element: any) {
        return new RecepcionBienes(element.IdCTBienesId,
            element.Descripcion,
            element.Cantidad,
            element.Valor,
            element.Comentario,
            element.Id,
            element.UltimaEntrega,
            element.NumeroRecepcion);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}