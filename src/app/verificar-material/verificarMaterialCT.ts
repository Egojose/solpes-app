export class verificarMaterialCT {

    constructor(
        public id: number,
        public codigo: string,
        public descripcion: string,
        public modelo: string,
        public fabricante: string,
        public cantidad: number,
        public codigoverificar?: string,
        public descripcionverificar?: string,
        public cantidadverificar?: number,
        public existenciasverificar?: number,
        public numreservaverificar?: string,
        public cantidadreservaverificar?: number,
        public MaterialVerificado?: Boolean
    ) {
    }

    public static fromJson(element: any) {
        let nombreCodigo;
        let nombreDescripcion;
        let existencias;
        let numReserva;
        let cantidadReserva;
        if (element.MaterialVerificado === true) {
            nombreCodigo = element.CodigoVerificar;
            nombreDescripcion = element.DescripcionVerificar;
            existencias = element.ExistenciasVerificar;
            numReserva=element.NumReservaVerificar;
            cantidadReserva= element.CantidadReservaVerificar;
        } else {
            nombreCodigo = element.Codigo;
            nombreDescripcion = element.Descripcion;
            existencias = element.ExistenciasVerificar;
            numReserva = element.NumReservaVerificar;
            cantidadReserva = element.CantidadReservaVerificar;
        }
        return new verificarMaterialCT(element.Id, nombreCodigo, nombreDescripcion, element.Modelo, element.Fabricante, element.Cantidad,"","",0,existencias, numReserva, cantidadReserva,element.MaterialVerificado);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}