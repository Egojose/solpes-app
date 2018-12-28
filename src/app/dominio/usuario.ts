export class Usuario{
    
    id: number;
    nombre: string;
    email: string;

    constructor(id: number, nombre: string, email: string){
        this.id = id;
        this.nombre = nombre;
        this.email = email;
    }
}