// src/app/models/proveedor.model.ts
export interface Proveedor {
    idProveedor: number;
    nitProveedor: string;
    nombreProveedor: string;
    direccionProveedor: string;
    telefonoProveedor: string;
    estadoProveedor?: boolean; // opcional si puede no estar presente en algunos casos
  }
  