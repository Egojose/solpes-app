export class CondicionesTecnicasServiciosLectura{
 
 
  constructor(
      public codigo: string,
      public descripcion: string,
      public cantidad: number,
      public valorEstimado: string,
      public comentario: string
   ) { }

public static fromJson(element: any) {
    return new CondicionesTecnicasServiciosLectura(
        element.Codigo,
        element.Descripcion,
        element.Cantidad,
        element.ValorEstimado,
        element.Comentario
    );
}

public static fromJsonList(elements: any) {
    var list = [];
    for (var i = 0; i < elements.length; i++) {
        list.push(this.fromJson(elements[i]));
    }
    return list;
}
}