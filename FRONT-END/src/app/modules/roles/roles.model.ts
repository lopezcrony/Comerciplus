export interface Permission {
  idPermiso: number;
  nombrePermiso: string;
}

export interface Role {
  idRol: number;
  nombreRol: string;
  estadoRol?: boolean;
  Permissions: Permission[];
}