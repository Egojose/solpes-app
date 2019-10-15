export class Compardor{
    constructor( 
        public compradorEmail: string, 
        public compradorNombre: string, 
        public compradorId: number) {}

    public static fromJson(element: any) {
        return new Compardor(
            element.Comprador.EMail, 
            element.Comprador.Title, 
            element.Comprador.ID);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}