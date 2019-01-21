export class CondicionesTecnicasBienes {

    constructor(public IdBienes: number,
        public codigo: string,
        public descripcion: string,
        public modelo: string,
        public fabricante: string,        
        public cantidad: number,
        public valorEstimado?: string,
        public comentario?: string,
        public archivoAdjunto?: File        
        ) {}

    public static fromJson(element: any) {
        return new CondicionesTecnicasBienes(element.Id, 
            element.Codigo, 
            element.Descripcion, 
            element.Modelo, 
            element.Fabricante,
            element.Cantidad,
            element.ValorEstimado, 
            element.Comentarios);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }


}