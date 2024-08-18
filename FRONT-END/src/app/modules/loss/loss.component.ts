import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports'; // Archivo para las importaciones generales
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
// import { ConfirmationServiceMessage } from '../../shared/alerts/confirmation.service';

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
export class LossComponent {
  loss: Loss[]=[];
  filteredLoss: Loss[]=[];

  colums:{field: string, header: string}[]=[
    {field: 'idDevolucionDeBaja', header: 'ID'},
    {field:'idCodigoBarra', header: 'FK_Cod'},
    {field: 'cantidad', header:'Cantidad'}, 
    {field: 'fechaDeBaja', header:'Fecha'}, 
    {field:'motivo', header: 'Motivo'}
  ];

  LossForm: FormGroup;

  showModal= false;
  isEditing=false;

  constructor(
    private lossService: LossService,
    private fb: FormBuilder,
    // private confirmationService: ConfirmationServiceMessage,
    private toastr: ToastrService
  ){
    this.LossForm = this.fb.group({
      idDevolucionDeBaja: [null],
      idCodigoBarra: ['', Validators.required],
      cantidad: ['', Validators.required, Validators.min(0)],
      fechaDeBaja: ['',],
      motivo: ['', Validators.required],      
    });
  }

  ngOnInit() {
    this.loadLoss();
  }

  loadLoss() {
    this.lossService.getLoss().subscribe(
      (data: Loss[]) => {
        this.loss = data;
        this.filteredLoss = data;
      },
      error => console.error('Error al cargar registros:', error)
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
          this.loadLoss();
          this.closeModal();
        },
        error: (error) => console.error('Error al guardar las pérdidas:', error)
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.LossForm.reset();
  }


  searchClients(query: string) {
    this.filteredLoss = this.loss.filter(loss =>
      loss.idDevolucionDeBaja.toFixed().includes(query.toLowerCase()) ||
      loss.idCodigoBarra.toFixed().includes(query.toLowerCase()) ||
      loss.cantidad.toFixed().includes(query.toLowerCase()) ||
      loss.fechaDeBaja.toISOString().includes(query.toLowerCase()) ||
      loss.motivo.toLowerCase().includes(query.toLowerCase())
    );
  }

}
