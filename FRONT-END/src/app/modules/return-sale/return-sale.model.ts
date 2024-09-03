export interface ReturnSaleModel{
    idDevolucionVenta:number, 
    idProveedor:number,
    idDetalleVenta:number, //Numero de factura
    idCodigoBarra:number,
    CodigoProducto:number, 
    NombreProducto:string,
    cantidad:number, 
    fechaDevolucion:Date, 
    motivoDevolucion:string,
    tipoReembolso:string, 
    valorDevolucion:number
}