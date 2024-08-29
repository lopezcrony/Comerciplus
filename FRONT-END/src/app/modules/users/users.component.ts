import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DropdownModule } from 'primeng/dropdown';
import { AlertsService } from '../../shared/alerts/alerts.service';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';

import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';
import { User } from './users.model';
import { Roles } from '../roles/roles.model';
import { ValidationService } from '../../shared/validators/validations.service';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
    DropdownModule,
    FloatLabelModule
  ],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  roles: Roles[] = [];
  columns = [
    { field: 'cedulaUsuario', header: 'Cédula' },
    { field: 'nombreUsuario', header: 'Nombre' },
    { field: 'apellidoUsuario', header: 'Apellido' },
    { field: 'telefonoUsuario', header: 'Teléfono' },
    { field: 'correoUsuario', header: 'Correo' },
    { field: 'nombreRol', header: 'Rol' }
  ];
  userForm: FormGroup;
  showModal = false;
  isEditing = false;

  constructor(
    private userService: UsersService,
    private roleService: RolesService,
    private alertsService: AlertsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private validationService: ValidationService,
  ) {
    this.userForm = this.fb.group({
      idUsuario: [null],
      idRol: ['', validationService.getValidatorsForField('users', 'idRol')],
      cedulaUsuario: ['', validationService.getValidatorsForField('users', 'cedulaUsuario')],
      nombreUsuario: ['', validationService.getValidatorsForField('users', 'nombreUsuario')],
      apellidoUsuario: ['', validationService.getValidatorsForField('users', 'apellidoUsuario')],
      telefonoUsuario: ['', validationService.getValidatorsForField('users', 'telefonoUsuario')],
      correoUsuario: ['', validationService.getValidatorsForField('users', 'correoUsuario')],
      contraseñaUsuario: ['', validationService.getValidatorsForField('users', 'contraseñaUsuario')],
      estadoUsuario: [true]
    });
  }

  ngOnInit() {
    this.loadRoles();
    this.loadUsers();
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe(data => {
      this.roles = data;
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data.map(user => {
        const role = this.roles.find(r => r.idRol === user.idRol)!;
        return { ...user, nombreRol: role.nombreRol };
      });
      this.filteredUsers = this.users;
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.userForm.reset({ estadoUsuario: true });
    this.showModal = true;
  }

  openEditModal(user: User) {
    this.isEditing = true;
    this.userForm.patchValue(user);
    this.showModal = true;
  }

  cancelModalMessage(){
    this.alertsService.menssageCancel()
  }

  closeModal() {
    this.showModal = false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('users', fieldName, errorKey);
    }
    return '';
  }

  private markFormFieldsAsTouched() {
    Object.values(this.userForm.controls).forEach(control => control.markAsTouched());
  }

  saveUser() {

    if (this.userForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
    const user: User = this.userForm.value;
    if (this.isEditing) {
      this.userService.updateUser(user).subscribe(() => {
        this.toastr.success('Usuario actualizado exitosamente', 'Éxito');
        this.loadUsers();
        this.closeModal();
      });
    } else {
      this.userService.createUser(user).subscribe(() => {
        this.toastr.success('Usuario creado exitosamente', 'Éxito');
        this.loadUsers();
        this.closeModal();
      });
    }

  }

  confirmDelete(user: User) {
    this.alertsService.confirm(
      `¿Estás seguro de eliminar a ${user.nombreUsuario} ${user.apellidoUsuario}?`,
      () => this.userService.deleteUser(user.idUsuario).subscribe(() => {
        this.toastr.success('Usuario eliminado exitosamente', 'Éxito');
        this.loadUsers();

      })

    );
  }

  searchUser(query: string) {
    this.filteredUsers = this.users.filter(user =>
      user.cedulaUsuario.includes(query) ||
      user.nombreUsuario.toLowerCase().includes(query.toLowerCase()) ||
      user.apellidoUsuario.toLowerCase().includes(query.toLowerCase())
    );
  }

  exportUsers() { }

  changeUserStatus(updatedUser: User) {
    const estadoUsuario = updatedUser.estadoUsuario ?? false;
  
    this.userService.updateStatusUser(updatedUser.idUsuario, estadoUsuario).subscribe({
      next: () => {
        [this.users, this.filteredUsers].forEach(list => {
          const index = list.findIndex(c => c.idUsuario === updatedUser.idUsuario);
          if (index !== -1) {
            list[index] = { ...list[index], ...updatedUser };
          }
        });
        this.toastr.success('Estado del usuario actualizado con éxito', 'Éxito');
      },
      error: () => {
        this.toastr.error('Error al actualizar el estado del usuario', 'Error');
      }
    });
  }  
  
}
