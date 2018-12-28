export class TipoSolicitud {

    constructor(public nombre: string, public tieneCm: boolean, public id: number) {}

    public static fromJson(element: any) {
        return new TipoSolicitud(element.Title, element.TieneCM, element.ID);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}