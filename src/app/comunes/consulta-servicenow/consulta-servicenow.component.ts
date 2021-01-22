import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-consulta-servicenow',
  templateUrl: './consulta-servicenow.component.html',
  styleUrls: ['./consulta-servicenow.component.css']
})
export class ConsultaServicenowComponent implements OnInit {
  @Input() codigoMaterial: string;
  @Input() nombre: string;
  @Input() modelo: string;
  @Input() fabricante: string
  obj = {
    codigo: this.codigoMaterial,
    nombre: this.nombre,
    modelo: this.modelo,
    fabricante: this.fabricante
  }
  @Output() dataEvent: EventEmitter<any> = new EventEmitter<any>();
  

  constructor() { }

  ngOnInit() {
  }

  mostrarValores() {
    // this.dataEvent.emit('Se comunica con el child component')
    this.dataEvent.emit(JSON.stringify(this.obj))
  }

}
    

