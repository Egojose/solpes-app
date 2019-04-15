export class MotivoSuspension{
    constructor(public nombre: string, public id: number) {}

    public static fromJson(element: any) {
        return new MotivoSuspension(element.Title, element.ID);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}