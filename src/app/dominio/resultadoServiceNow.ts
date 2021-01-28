export class ResultadoServiceNow {
    public fabricante: string;
    public material: string;
    public namematerial: string;
    public codLatam: string;
    public codBrasil: string;

    constructor(fabricante: string,
            material: string,
            namematerial: string,
            codLatam: string,
            codBrasil: string
        ) {

            this.fabricante = fabricante;
            this.material = material;
            this.namematerial = namematerial;
            this.codLatam = codLatam;
            this.codBrasil = codBrasil;
        
    }
}