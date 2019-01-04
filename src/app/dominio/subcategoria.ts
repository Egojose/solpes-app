export class Subcategoria {
    constructor(public nombre: string,
        public idCategoria: number,
        public id: number) { }

    public static fromJson(element: any) {
        return new Subcategoria(element.Title,
            element.CategoriaId,
            element.ID);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}