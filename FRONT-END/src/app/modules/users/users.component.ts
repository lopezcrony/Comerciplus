import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';
import { ValidationService } from '../../shared/validators/validations.service';

import { User } from './users.model';
import { Role } from '../roles/roles.model';
import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
  ],
})

export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  roles: Role[] = [];
  filteredRoles: Role[] = [];
  columns = [
    { field: 'nombreRol', header: 'Rol', type: 'text' },
    { field: 'cedulaUsuario', header: 'Cédula', type: 'text' },
    { field: 'nombreUsuario', header: 'Nombre', type: 'text' },
    { field: 'apellidoUsuario', header: 'Apellido', type: 'text' },
    { field: 'telefonoUsuario', header: 'Teléfono', type: 'text' },
    { field: 'correoUsuario', header: 'Correo', type: 'text' },
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
      claveUsuario: ['', this.isEditing ? [] : validationService.getValidatorsForField('users', 'claveUsuario')],
      confirmarClave: ['', this.isEditing ? [] : validationService.getValidatorsForField('users', 'claveUsuario')]
    }, {
      validators: this.isEditing ? [] : [this.passwordMatchValidator]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      roles: this.roleService.getAllRoles(),
      users: this.userService.getAllUsers()
    }).subscribe(({ roles, users }) => {
      this.filteredRoles = roles.filter(r => r.estadoRol === true);
      this.roles = roles;
      this.users = users.map((user: User) => {
        const role = this.roles.find(r => r.idRol === user.idRol)!;
        return { ...user, nombreRol: role.nombreRol };
      });
      this.filteredUsers = this.users;
    });
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe(data => {
      this.roles = data.filter(r => r.estadoRol === true);
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

  cancelModalMessage() {
    this.alertsService.menssageCancel()
  }

  closeModal() {
    this.showModal = false;
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('claveUsuario')?.value === g.get('confirmarClave')?.value
      ? null : { 'mismatch': true };
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

    const userData = { ...this.userForm.value };

    // Si estamos editando, eliminamos el campo de contraseña
    if (this.isEditing) {
      delete userData.claveUsuario;
      delete userData.confirmarClave;
    } else {
      // Si estamos creando, verificamos que las contraseñas coincidan
      if (userData.claveUsuario !== userData.confirmarClave) {
        this.toastr.error('Las contraseñas no coinciden', 'Error');
        return;
      }
      delete userData.confirmarClave;
    }

    const request = this.isEditing
      ? this.userService.updateUser(userData)
      : this.userService.createUser(userData);

    request.subscribe({
      next: () => {
        this.toastr.success('¡Usuario guardado con éxito!', 'Éxito');
        this.loadData();
        this.closeModal();
      },
      error: () => this.toastr.error('Error al guardar el usuario', 'Error')
    });
  };

  confirmDelete(user: User) {
    this.alertsService.confirm(
      `¿Estás seguro de eliminar a ${user.nombreUsuario} ${user.apellidoUsuario}?`,
      () => this.userService.deleteUser(user.idUsuario).subscribe(() => {
        this.toastr.success('Usuario eliminado exitosamente', 'Éxito');
        this.loadData();

      })

    );
  }

  searchUser(query: string) {
    this.filteredUsers = this.users.filter(user => {
      // Para buscar por el nombre del rol
      const roleUser = user as User & { nombreRol?: string };

      const role = (roleUser.nombreRol || '').toLowerCase().includes(query);
      const cedula = user.cedulaUsuario.includes(query);
      const nombre = user.nombreUsuario.toLowerCase().includes(query.toLowerCase());
      const apellido = user.apellidoUsuario.toLowerCase().includes(query.toLowerCase());
      const correo = user.correoUsuario.toLocaleLowerCase().includes(query);

      return role || cedula || nombre || apellido || correo;
    }
    );
  };

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
  };

  exportUsers() { };

}
