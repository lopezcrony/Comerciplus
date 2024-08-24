import { RolesService } from './roles.service';
import { Roles } from './roles.model';
import { ValidationService } from '../../shared/validators/validations.service';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-roles',
  standalone: true,
  templateUrl: './roles.component.html',
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective
  ]
})
export class RolesComponent implements OnInit {

  roles: Roles[] = [];
  columns = [
    { field: 'nombreRol', header: 'Nombre' }
  ];
  rolesForm: FormGroup;
  showModal = false;
  isEditing = false;

  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private validationService: ValidationService,
  ) {
    this.rolesForm = this.fb.group({
      idRol: [null],
      nombreRol: ['', this.validationService.getValidatorsForField('roles','nombreRol')]
    });
  }

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.rolesService.getAllRoles().subscribe(data => {
      this.roles = data;
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.rolesForm.reset();
    this.showModal = true;
  }

  openEditModal(roles: Roles) {
    this.isEditing = true;
    this.rolesForm.patchValue(roles);
    this.showModal = true;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.rolesForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  }  

  getErrorMessage(fieldName: string): string {
    const control = this.rolesForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('roles', fieldName, errorKey);
    }
    return '';
  }

  private markFormFieldsAsTouched() {
    Object.values(this.rolesForm.controls).forEach(control => control.markAsTouched());
  }

  saveRole() {
    if (this.rolesForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    const roleData = this.rolesForm.value;
    const request = this.isEditing 
      ? this.rolesService.updateRoles(roleData) 
      : this.rolesService.createRoles(roleData);

    request.subscribe({
      next: () => {
        this.toastr.success('¡Rol guardado con éxito!', 'Éxito');
        this.loadRoles();
        this.closeModal();
      },
      error: () => this.toastr.error('Error al guardar rol', 'Error')
    });
  }

  confirmDelete(roles: Roles) {
    if (confirm('¿Está seguro de que desea eliminar este rol?')) {
      this.rolesService.deleteRoles(roles.idRol).subscribe(() => {
        this.toastr.success('Rol eliminado exitosamente');
        this.loadRoles();
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }

  searchRoles(query: string) {
    this.roles = this.roles.filter(roles =>
      roles.nombreRol.toLowerCase().includes(query.toLowerCase())
    );
  }
}
