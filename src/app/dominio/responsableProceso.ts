import { Pais } from './pais';
export class responsableProceso {
    constructor(
        public titulo: string,
        public pais: any[],
        public porverificarMaterial: number,
        public porRegistrarSolp: number,
        public porConfirmarEntregaBienes: number,
        public porRegistrarSapServicios: number,
        public porRegistrarSapBienes: number
    ) {

    }
    public static fromJson(element: any) {
        return new responsableProceso(element.Title, element.PaisId,element.porVerificarMaterialId, element.porRegistrarSolpSAPId, element.porConfirmarEntregaBienesId,element.porRegistrarSapServiciosId,element.porRegistrarSapBienesId );
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }

}