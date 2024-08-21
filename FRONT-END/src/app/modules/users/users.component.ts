import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';

import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';
import { User } from './users.model';
import { Roles } from '../roles/roles.model';
import { DropdownModule } from 'primeng/dropdown';
import { AlertsService } from '../../shared/alerts/alerts.service';


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
    { field: 'idRol', header: 'Rol' }
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
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
      this.filteredUsers = data;
    });
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe(data => {
      this.roles = data;
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

  deleteAllUsers() { }

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





// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';

// import { SHARED_IMPORTS } from '../../shared/shared-imports';
// import { CRUDComponent } from '../../shared/crud/crud.component';
// import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';

// import { UserService } from './users.service';
// import { User } from './users.model';

// @Component({
//   selector: 'app-users',
//   standalone: true,
//   imports: [
//     ...SHARED_IMPORTS,
//     CRUDComponent,
//     CrudModalDirective
//     ],
//   templateUrl: './users.component.html'
// })
// export class UsersComponent implements OnInit {

//   users: User[] = [];
//   filteredUsers: User[] = [];
//   selectedUsers: any[] = [];

//   columns: { field: string, header: string }[] = [
//     { field: 'cedulaUsuario', header: 'Cédula' },
//     { field: 'nombreUsuario', header: 'Nombre' },
//     { field: 'apellidoUsuario', header: 'Apellido' },
//     { field: 'correoUsuario', header: 'Correo' },
//     { field: 'telefonoUsuario', header: 'Teléfono' },
//     { field: 'estadoUsuario', header: 'Estado' }
//   ];
  
//   userForm: FormGroup;
//   showModal = false;
//   isEditing = false;

//   constructor(
//     private userService: UserService,
//     private fb: FormBuilder,
//     private toastr: ToastrService
//   ) {
//     this.userForm = this.fb.group({
//       idUsuario: [null],
//       cedulaUsuario: ['', Validators.required],
//       nombreUsuario: ['', Validators.required],
//       apellidoUsuario: ['', Validators.required],
//       telefonoUsuario: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
//       correoUsuario: ['', [Validators.required, Validators.email]],
//       contraseñaUsuario: ['', Validators.required],
//       estadoUsuario: [true]
//     });
//   }
  

//   loadUsers() {
//     this.userService.getUsers().subscribe(data => {
//         this.users = data;
//         this.filteredUsers = data;
//       },
//     );
//   }

//   ngOnInit() {
//     this.loadUsers();
//   }

//   openCreateModal() {
//     this.isEditing = false;
//     this.userForm.reset({ estadoUsuario: true });
//     this.showModal = true;
//   }

//   openEditModal(user: User) {
//     this.isEditing = true;
//     this.userForm.patchValue(user);
//     this.showModal = true;
//   }

//   closeModal() {
//     this.showModal = false;
//     this.userForm.reset();
//   }

//   saveUser() {
//   if (this.userForm.valid) {
//     const userData = this.userForm.value;
//     const request = this.isEditing ?
//       this.userService.updateUser(userData) :
//       this.userService.createUser(userData);

//     request.subscribe({
//       next: () => {
//         this.toastr.success('Usuario guardado con éxito!', 'Éxito');
//         this.loadUsers();
//         this.closeModal();
//       },
//       error: (error) => {
//         console.error('Error al guardar usuario:', error);
//         this.toastr.error('Algo salió mal; por favor, intente nuevamente más tarde.');
//       }
//     });
//   }
// }


//   deleteUser(id: number) {
//     this.userService.deleteUser(id).subscribe({
//       next: () => {
//         this.loadUsers();
//         this.toastr.success('Usuario eliminado exitosamente.', 'Éxito');
//       },
//       error: (error) => {
//         console.error('Error al eliminar registro:', error);
//         this.toastr.error('Ocurrió un error al eliminar el usuario.', 'Error');
//       }
//     });
//   }

//   confirmDelete(user: User) {
//     // Implementa el servicio de confirmación
//     this.deleteUser(user.idUsuario);
//   }

//   searchUsers(query: string) {
//     this.filteredUsers = this.users.filter(user =>
//       user.nombreUsuario.toLowerCase().includes(query.toLowerCase()) ||
//       user.apellidoUsuario.toLowerCase().includes(query.toLowerCase()) ||
//       user.cedulaUsuario.toLowerCase().includes(query.toLowerCase()) ||
//       user.telefonoUsuario.toLowerCase().includes(query.toLowerCase()) ||
//       user.correoUsuario.toLowerCase().includes(query.toLowerCase())
//     );
//   }

//   deleteAllUsers() { }

//   exportUsers() { }
// }
