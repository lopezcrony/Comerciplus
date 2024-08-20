import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports'; // Archivo para las importaciones generales
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';
// import {ProductsService} from '../products/products.service'

import { LossService } from './loss.service';
import { Loss } from './loss.model';

@Component({
  selector: 'app-loss',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,    
    CrudModalDirective],
  templateUrl: './loss.component.html',
  styleUrl: './loss.component.css'
})
export class LossComponent implements OnInit {
  loss: Loss[]=[];
  filteredLoss: Loss[]=[];

  colums:{field: string, header: string}[]=[
    {field: 'CodigoProducto', header: 'Codigo'},
    {field: 'NombreProducto', header: 'Producto'},
    {field: 'cantidad', header:'Cantidad'}, 
    {field: 'fechaDeBaja', header:'Fecha'}, 
    {field: 'motivo', header: 'Motivo'}
  ];

  LossForm: FormGroup;

  showModal= false;
  isEditing=false;

  constructor(
    private lossService: LossService,
    private fb: FormBuilder,
    private confirmationService: AlertsService,
    private toastr: ToastrService
  ){
    this.LossForm = this.fb.group({
      idDevolucionDeBaja: [null],
      idCodigoBarra: ['', Validators.required],
      cantidad: ['', Validators.min(0)],
      fechaDeBaja: [new Date()],
      motivo: ['', Validators.required],      
    });
  }

  ngOnInit() {
    this.loadLoss();
  }

  loadLoss() {
    this.lossService.getLoss().subscribe(data => {
        this.loss = data;
        this.filteredLoss = data;
      },
    );
  }

  openCreateModal() {
    this.isEditing = false;
    this.showModal = true;
  }

  saveLoss() {
    if (this.LossForm.valid) {
      const lossData = this.LossForm.value;
      const request = this.isEditing ?
      this.lossService.createLoss(lossData) :
        this.lossService.createLoss(lossData);

        request.subscribe({
          next: () => {
            this.toastr.success('Pérdida guardada con éxito!', 'Éxito');
            this.loadLoss();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error al agregar un registro revise el stock:', error);
            if (error.status === 500) {
              this.toastr.error('No se puede agregar una pérdida revise el stock', 'Error');
            } else {
              this.toastr.error('Ocurrió un error al agregar la pérdida revise el stock.', 'Error');
            }
          }
        });
    }
  }

  closeModal() {
    this.showModal = false;
    this.LossForm.reset();
  }


  searchLoss(query: string) {
    const lowerCaseQuery = query.toLowerCase();
  
    // Define el estado que estás buscando. Aquí asumo que buscas "true" en la query.
    
    this.filteredLoss = this.loss.filter(loss =>
      loss.CodigoProducto.toLowerCase().includes(lowerCaseQuery) ||
      loss.NombreProducto.toLowerCase().includes(lowerCaseQuery) ||
      // loss.fechaDeBaja ||
      // loss.cantidad ||
      loss.motivo.toLowerCase().includes(lowerCaseQuery)
    );
  }

}
