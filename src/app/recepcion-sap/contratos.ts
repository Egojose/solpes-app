export class Contratos {
    constructor(
        public idSolicitud: number, 
        public contratoMarco: string){

    }

    public static fromJson(element: any) {
        return new Contratos(
            element.Solicitud,
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