import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ValidationService } from '../../shared/validators/validations.service';
import { AlertsService } from '../../shared/alerts/alerts.service';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';

import { RolesService } from './roles.service';
import { PermissionsService } from './permissions.service';
import { Role, Permission } from './roles.model';

@Component({
  selector: 'app-roles',
  standalone: true,
  templateUrl: './roles.component.html',
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
  ],
})
export class RolesComponent implements OnInit {
  filteredRoles: Role[] = [];
  roles: Role[] = [];
  permissions: Permission[] = [];
  columns = [
    { field: 'nombreRol', header: 'Nombre', type: 'text' },
  ];
  rolesForm: FormGroup;
  showModal = false;
  isEditing = false;

  constructor(
    private roleService: RolesService,
    private permissionsService: PermissionsService,
    private alertsService: AlertsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private validationService: ValidationService,
  ) {
    this.rolesForm = this.fb.group({
      idRol: [null],
      nombreRol: ['', this.validationService.getValidatorsForField('roles','nombreRol')],
      estadoRol: [true],
      permissions: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe(data => {
      console.log('Roles cargados:', data);
      this.roles = data;
      this.filteredRoles = data.map(role => ({
        ...role,
        permissions: role.Permissions?.map(p => p.nombrePermiso).join(', ') || ''
      }));
      console.log('Roles filtrados:', this.filteredRoles);
    });
  }

  loadPermissions() {
    this.permissionsService.getAllPermissions().subscribe(data => {
      this.permissions = data;
      this.initPermissionsForm();
    });
  }

  initPermissionsForm() {
    const permissionsControls = this.permissions.map(permission => 
       this.fb.control(false)
    );
    this.rolesForm.setControl('permissions', this.fb.array(permissionsControls));
  }

  openCreateModal() {
    this.isEditing = false;
    this.rolesForm.reset({ estadoRol: true });
    this.initPermissionsForm();
    this.showModal = true;
  }

  openEditModal(role: Role) {
    this.isEditing = true;
    this.rolesForm.patchValue({
      idRol: role.idRol,
      nombreRol: role.nombreRol,
      estadoRol: role.estadoRol
    });
    const permissionsArray = this.rolesForm.get('permissions') as FormArray;
    permissionsArray.controls.forEach((control, index) => {
      control.setValue(role.Permissions?.some(p => p.idPermiso === this.permissions[index].idPermiso) || false);
    });
    this.showModal = true;
  }
      
  saveRole() {
    if (this.rolesForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    const roleData = this.rolesForm.value;
    roleData.permissions = this.permissions
      .filter((_, index) => roleData.permissions[index])
      .map(p => p.nombrePermiso);

    console.log('Datos del rol a enviar:', roleData);

    const request = this.isEditing
      ? this.roleService.updateRoles(roleData)
      : this.roleService.createRoles(roleData);

    request.subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.toastr.success('¡Rol guardado con éxito!', 'Éxito');
        this.loadRoles();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al guardar el rol:', error);
        this.toastr.error('Error al guardar rol', 'Error');
      }
    });
  }

  confirmDelete(role: Role) {
    this.alertsService.confirm(
      `¿Estás seguro de eliminar a ${role.nombreRol}?`,
      () => this.roleService.deleteRoles(role.idRol).subscribe(() => {
        this.toastr.success('Rol eliminado exitosamente', 'Éxito');
        this.loadRoles();
      })
    );
  }

  closeModal() {
    this.showModal = false;
  }

  searchRoles(query: string) {
    this.filteredRoles = this.roles.filter(role =>
      role.nombreRol.toLowerCase().includes(query.toLowerCase())
    );
  }

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

  isPermissionChecked(permissionId: number): boolean {
    const permissions = this.rolesForm.get('permissions') as FormArray;
    return permissions.at(this.permissions.findIndex(p => p.idPermiso === permissionId)).value;
  }

  toggleAllPermissions(event: any) {
    const checked = event.target.checked;
    const permissions = this.rolesForm.get('permissions') as FormArray;
    permissions.controls.forEach(control => control.setValue(checked));
  }

  areAllPermissionsChecked(): boolean {
    const permissions = this.rolesForm.get('permissions') as FormArray;
    return permissions.controls.every(control => control.value);
  }

  exportRoles() {
    // Implementar la lógica de exportación si es necesario
  }

  markFormFieldsAsTouched() {
    Object.values(this.rolesForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.rolesForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.rolesForm.get(fieldName);
    if (control && control.errors) {
      if (control.errors['required']) {
        return 'Este campo es requerido';
      }
      // Agrega más mensajes de error según tus validaciones
    }
    return '';
  }

  cancelModalMessage() {
    // Implementa la lógica para el mensaje de cancelación si es necesario
  }
}