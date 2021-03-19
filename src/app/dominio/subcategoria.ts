export class Subcategoria {
    constructor(
        public nombre: string,
        public idCategoria: number,
        public idPaises: any,
        public comprador: any,
        public codigoAriba: string,
        public cuadrante: string,
        public condicionesContractuales: any,
        public id: number,
        public sap: string) { }

    public static fromJson(element: any) {
        return new Subcategoria(element.Title,
            element.Categoria.ID,
            element.Pais,
            element.Comprador,
            element.CodigoAriba,
            element.Cuadrante,
            element.CondicionesTecnicas.results,
            element.ID,
            element.SAP);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}