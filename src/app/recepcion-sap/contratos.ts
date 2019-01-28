export class Contratos {
    constructor(public idContratos: string, public tipoContrato: string, public contratoMarco: string){

    }

    public static fromJson(element: any) {
        return new Contratos(
            element.Title,
            element.TipoContrato,
            element.CM);            
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}