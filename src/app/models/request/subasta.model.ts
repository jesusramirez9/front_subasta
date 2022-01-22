export class Subasta {
    id?:any;
    estado?:any;
    titulo?:any;
    moneda?:any;
    tipo?:any;
    modo?:any;
    fecha_inicio?:any;
    fecha_fin?:any;
    precio_base?:any;
    precio_pagado?:any;
    hora_fin?:string;
    hora_inicio?:string;
    participantes?: [];
    precio_minimo?: any;
    producto?: any;
    pujas?: [];
    vendedor?: any;
}