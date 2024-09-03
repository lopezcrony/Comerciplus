export interface ReturnSaleModel{
    idDevolucionVenta:number, 
    idDetalleVenta:number, 
    idCodigoBarra:number,
    CodigoBarra:number, 
    NombreProducto:string,
    cantidad:number, 
    fechaDevolucion:Date, 
    motivoDevolucion:string,
    tipoReembolso:string, 
    valorDevolucion:number
}