export interface ReturnSaleModel{
    idDevolucionVenta:number, 
    idDetalleVenta:number, 
    idCodigoBarra:number,
    CodigoBarra:number, 
    cantidad:number, 
    fechaDevolucion:Date, 
    motivoDevolucion:string,
    tipoReembolso:string, 
    valorDevolucion:number
}