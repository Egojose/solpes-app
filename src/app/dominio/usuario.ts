export class Usuario{

    id: number;
    nombre: string;
    email: string;

    constructor(nombre: string, email: string, id: number){
        this.id = id;
        this.nombre = nombre;
        this.email = email;
    }

    public static fromJson(element: any) {
        return new Usuario(element.Title, element.Email, element.Id);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}