export class CondicionContractual {

    nombre: string;
    id: number;
    valor:string;
    

    constructor(nombre: string, id: number, valor?: string) {
        this.nombre = nombre;
        this.id = id;
        this.valor = valor;
    }
}