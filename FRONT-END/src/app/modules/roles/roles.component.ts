import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';


import { RolesService } from './roles.service';
import { Roles } from './roles.model';


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
    private toastr: ToastrService
  ) {
    this.rolesForm = this.fb.group({
      idRol: [null],
      nombreRol: ['', Validators.required]
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

  saveRole() {
    if (this.rolesForm.valid) {
      const role: Roles = this.rolesForm.value;
      if (this.isEditing) {
        this.rolesService.updateRoles(role).subscribe(() => {
          this.toastr.success('Rol actualizado exitosamente');
          this.loadRoles();
          this.closeModal();
        });
      } else {
        this.rolesService.createRoles(role).subscribe(() => {
          this.toastr.success('Rol creado exitosamente');
          this.loadRoles();
          this.closeModal();
        });
      }
    }
  }

  confirmDelete(roles: Roles) {
    if (confirm('¿Está seguro de que desea eliminar este rol?')) {
      this.rolesService.deleteRoles(roles.idRol).subscribe(() => {
        this.toastr.success('Rol eliminado exitosamente');
        this.loadRoles();
      });
    }
  }

  deleteAllRoles() { }

  closeModal() {
    this.showModal = false;
  }

  searchRoles(query: string) {
    this.roles = this.roles.filter(roles =>
      roles.nombreRol.toLowerCase().includes(query.toLowerCase())
    );
  }
}
