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

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
    DropdownModule
  ]
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
    private confirmationService: AlertsService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.userForm = this.fb.group({
      idUsuario: [null],
      idRol: ['', Validators.required],
      cedulaUsuario: ['', Validators.required],
      nombreUsuario: [''],
      apellidoUsuario: [''],
      telefonoUsuario: [''],
      correoUsuario: [''],
      contraseñaUsuario: ['']
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
    this.userForm.reset();
    this.showModal = true;
  }

  openEditModal(user: User) {
    this.isEditing = true;
    this.userForm.patchValue(user);
    this.showModal = true;
  }

  saveUser() {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      if (this.isEditing) {
        this.userService.updateUser(user).subscribe(() => {
          this.toastr.success('Usuario actualizado exitosamente');
          this.loadUsers();
          this.closeModal();
        });
      } else {
        this.userService.createUser(user).subscribe(() => {
          this.toastr.success('Usuario creado exitosamente');
          this.loadUsers();
          this.closeModal();
        });
      }
    }
  }

  confirmDelete(user: User) {
    this.confirmationService.confirm(
      `¿Estás seguro de eliminar a ${user.nombreUsuario} ${user.apellidoUsuario}?`,
      () => this.userService.deleteUser(user.idUsuario).subscribe(() => {
        this.toastr.success('Usuario eliminado exitosamente', 'Éxito');
        this.loadUsers();

      })

    );
  }


  closeModal() {
    this.showModal = false;
  }

  searchUser(query: string) {
    this.filteredUsers = this.users.filter(user =>
      user.cedulaUsuario.includes(query) ||
      user.nombreUsuario.toLowerCase().includes(query.toLowerCase()) ||
      user.apellidoUsuario.toLowerCase().includes(query.toLowerCase())
    );
  }
}