import { RolesService } from './roles.service';
import { Role } from './roles.model';
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

  filteredRoles: Role[] = [];
  roles: Role[] = [];
  columns = [
    { field: 'nombreRol', header: 'Nombre' }
  ];
  rolesForm: FormGroup;
  showModal = false;
  isEditing = false;

  constructor(
    private roleService: RolesService,
    private alertsService: AlertsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private validationService: ValidationService,
  ) {
    this.rolesForm = this.fb.group({
      idRol: [null],
      nombreRol: ['', this.validationService.getValidatorsForField('roles','nombreRol')],
      estadoRol: [true]
    });
  }

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe(data => {
      console.log('Roles cargados:', data);
      this.roles = data;
      this.filteredRoles = data;
      console.log('Roles filtrados:', this.filteredRoles);
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.rolesForm.reset({ estadoRol: true });
    this.showModal = true;
  }

  openEditModal(roles: Role) {
    this.isEditing = true;
    this.rolesForm.patchValue(roles);
    this.showModal = true;
  }
  cancelModalMessage(){
    this.alertsService.menssageCancel()
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
      ? this.roleService.updateRoles(roleData) 
      : this.roleService.createRoles(roleData);

    request.subscribe({
      next: () => {
        this.toastr.success('¡Rol guardado con éxito!', 'Éxito');
        this.loadRoles();
        this.closeModal();
      },
      error: () => this.toastr.error('Error al guardar rol', 'Error')
    });
  }

  confirmDelete(role: Role) {
    this.alertsService.confirm(
      `¿Estás seguro de eliminar a ${role.nombreRol} ?`,
      () => this.roleService.deleteRoles(role.idRol).subscribe(() => {
        this.toastr.success('Usuario eliminado exitosamente', 'Éxito');
        this.loadRoles();

      })

    );
  }

  closeModal() {
    this.showModal = false;
  }

  searchRoles(query: string) {
    this.roles = this.roles.filter(roles =>
      roles.nombreRol.toLowerCase().includes(query.toLowerCase())
    );
  }

  exportRoles() { }

  changeRoleStatus(updatedRole: Role) {
    const estadoRol = updatedRole.estadoRol ?? false;
  
    this.roleService.updateStatusRole(updatedRole.idRol, estadoRol).subscribe({
      next: () => {
        [this.roles, this.filteredRoles].forEach(list => {
          const index = list.findIndex(c => c.idRol === updatedRole.idRol);
          if (index !== -1) {
            list[index] = { ...list[index], ...updatedRole };
          }
        });
        this.toastr.success('Estado del rol actualizado con éxito', 'Éxito');
      },
      error: () => {
        this.toastr.error('Error al actualizar el estado del rol', 'Error');
      }
    });
  }  
  
}

