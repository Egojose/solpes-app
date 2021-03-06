import { environment } from "src/environments/environment";
import { setup, Web, NodeFetchClient } from "sp-pnp-js";
import { default as pnp, sp,  } from 'sp-pnp-js';
// import { NodeFetchClient } from "sp-pnp-js";
import { Injectable } from "@angular/core";
import { from, Observable } from 'rxjs';
import { Solicitud } from "../dominio/solicitud";
import { CondicionTecnicaBienes } from "../dominio/condicionTecnicaBienes";
import { CondicionTecnicaServicios } from "../dominio/condicionTecnicaServicios";
import { RecepcionBienes } from "../entrega-bienes/recepcionBienes";
import { RecepcionServicios } from "../entrega-servicios/recepcionServicios";
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable()
export class SPServicio {
    constructor(private httpClient: HttpClient) { }

    public ObtenerConfiguracion() {
        const configuracionSharepoint = pnp.sp.configure({
            headers: {
                "Accept": "application/json; odata=verbose"
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    // public ObtenerConfiguracion() {
    //     const configuracionSharepoint = pnp.sp.configure({
    //         headers: {
    //             "Accept": "application/json; odata=verbose",
    //             'Content-Type': 'application/json;odata=verbose',
    //             'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imh1Tjk1SXZQZmVocTM0R3pCRFoxR1hHaXJuTSIsImtpZCI6Imh1Tjk1SXZQZmVocTM0R3pCRFoxR1hHaXJuTSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZW5vdmVsc29sdWNpb25lcy5zaGFyZXBvaW50LmNvbUA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwiaWF0IjoxNTk1NDIzNDg0LCJuYmYiOjE1OTU0MjM0ODQsImV4cCI6MTU5NTUxMDE4NCwiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJuYW1laWQiOiI4M2E0Zjk1Yi1lMTJkLTQyZDctYTFhNC1hZDExMTMwOWYzZDBAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwib2lkIjoiZTAxZThhNzEtMGY0YS00YjJiLTlkOWItZGU3NjcwOGVjYjlhIiwic3ViIjoiZTAxZThhNzEtMGY0YS00YjJiLTlkOWItZGU3NjcwOGVjYjlhIiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.HfJCcGSvSiYZaOMwmpmXCBNMn9CBOzeKOHr0rjVuS3gSp-Jt0lmc_4_MJaKWJjlYFj4e_7oJnulVRlwwRyA9n7YMYplvCgNnirlzmAKBsz9TOW52w7ytJitOP2CSo92-BeqhSnZWI7hU1GNY3cBXkAc3zaAs3kQY0_hWdrgOIqHPzrNG7KqTnkhm4TvEfmok7usSfBG2MZxrfAzlwVeXsFu9uK38LWUkztYzkcberFMQSeEBlUBf3OojsbMUNdNDDx60NybapMF5Z5a6r611EhX9OTKOVOHV4ed9QWTcmRvMzrUssVjim98GSagN-F4iO7D-ZB7CByOc5KcF6YKf3Q'
    //         }
    //     }, environment.urlWeb);

    //     return configuracionSharepoint;
    // }
   
    ObtenerUsuarioActual() {
        let respuesta = from(this.ObtenerConfiguracion().web.currentUser.get());
        return respuesta;
    }

    ObtenerTodosLosUsuarios() {
        let respuesta = from(this.ObtenerConfiguracion().web.siteUsers.get());
        return respuesta;
    }

    ObtenerUsuarioPorEmail(email : string){
        let respuesta = from(this.ObtenerConfiguracion().web.siteUsers.getByEmail(email).get());
        return respuesta;
    }

    ObtenerUsuarioPorId(id: number) {
        let respuesta = from(this.ObtenerConfiguracion().web.siteUsers.getById(id).get());
        return respuesta; 
    }

    ObtenerTiposSolicitud() {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaTiposSolicitud).items.getAll());
        return respuesta;
    }

    ObtenerEmpresas() {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaEmpresas).items.getAll());
        return respuesta;
    }
    

    ObtenerPaises() {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaPaises).items.getAll());
        return respuesta;
    }

    ObtenerCategorias() {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCategorias).items.getAll());
        return respuesta;
    }

    ObtenerSubcategorias(idCategoria: number, idPais: number) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSubcategorias).items.select("ID", "Title", "Categoria/Title", "Categoria/ID", "Comprador/Title", "Comprador/ID", "Pais/Title", "Pais/ID", "CondicionesTecnicas/Title", "CondicionesTecnicas/ID", "CodigoAriba", "Cuadrante").expand("Categoria", "Comprador", "CondicionesTecnicas", "Pais").filter("CategoriaId eq " + idCategoria + "and PaisId eq " + idPais).get());
        return respuesta;
    }

    obtenerMisSolicitudes(usuarioId: number) {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.select("ID", "Title", "TipoSolicitud", "Solicitante", "Empresa/Title", "OrdenadorGastos/ID", "OrdenadorGastos/Title", "Pais/ID", "Pais/Title", "Empresa/Title", "Empresa/ID", "Comprador/Title", "Comprador/ID", "Categoria", "Subcategoria", "CM", "CondicionesContractuales", "Alcance", "Justificacion", "FechaDeseadaEntrega", "Estado", "Author/Title", "Author/ID", "Responsable/ID", "Responsable/Title", "Created", "CodigoAriba", "Consecutivo", "FueSondeo", "SolicitantePersona/Title", "SolicitantePersona/ID").expand("Empresa", "Pais", "OrdenadorGastos", "Responsable", "Comprador", "Author", "SolicitantePersona").filter("SolicitantePersonaId eq " + usuarioId + " and Estado ne 'Inicial'").orderBy('Consecutivo', true).top(4999).get());
        return respuesta;
    }

    obtenerSolicitudes() {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.select("ID", "Title", "TipoSolicitud", "Solicitante", "Empresa/Title", "OrdenadorGastos/Title", "Pais/ID", "Pais/Title", "Empresa/Title", "Empresa/ID", "Comprador/Title", "Comprador/ID", "Categoria", "Subcategoria", "CM", "CondicionesContractuales", "Alcance", "Justificacion", "FechaDeseadaEntrega", "Estado", "Author/Title", "Author/ID", "Responsable/Title", "Created", "CodigoAriba", "Consecutivo", "FueSondeo").expand("Empresa", "Pais", "OrdenadorGastos", "Responsable", "Comprador", "Author").orderBy('Consecutivo', true).getAll());
        return respuesta;
    }

    obtenerCompradores() {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle('Compradores').items.select("*", 'Comprador/Title', 'Comprador/ID', 'Comprador/EMail').expand('Comprador').get());
        return respuesta;
    }

    agregarSolicitud(solicitud: Solicitud) {
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.add({
            Title: solicitud.titulo,
            TipoSolicitud: solicitud.tipoSolicitud,
            CM: solicitud.cm,
            Solicitante: solicitud.solicitante,
            EmpresaId: solicitud.empresa,
            OrdenadorGastosId: solicitud.ordenadorGastos,
            PaisId: solicitud.pais,
            Categoria: solicitud.categoria,
            Subcategoria: solicitud.subcategoria,
            CompradorId: solicitud.comprador,
            FechaDeseadaEntrega: solicitud.fechaEntregaDeseada,
            Alcance: solicitud.alcance,
            Justificacion: solicitud.justificacion,
            CondicionesContractuales: solicitud.condicionesContractuales,
            ResponsableId: solicitud.responsable,
            Estado: solicitud.estado,
            AuthorId: solicitud.autor,
            CompraBienes: solicitud.compraBienes,
            CompraServicios: solicitud.compraServicios,
            FaltaRecepcionBienes: solicitud.compraBienes,
            FueSondeo: solicitud.FueSondeo,
            FaltaRecepcionServicios: solicitud.compraServicios,
            CodigoAriba: solicitud.codigoAriba,
            OrdenEstadistica: solicitud.compraOrdenEstadistica,
            NumeroOrdenEstadistica: solicitud.numeroOrdenEstadistica,
            SolicitantePersonaId: solicitud.solicitantePersona
        });
    }

    borrarSolicitud(Idsolicitud: number){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(Idsolicitud).delete();
    }

    actualizarSolicitud(idSolicitud: number, solicitud: Solicitud){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(idSolicitud).update({
            Title: solicitud.titulo,
            TipoSolicitud: solicitud.tipoSolicitud,
            CM: solicitud.cm,
            Solicitante: solicitud.solicitante,
            EmpresaId: solicitud.empresa,
            OrdenadorGastosId: solicitud.ordenadorGastos,
            PaisId: solicitud.pais,
            Categoria: solicitud.categoria,
            Subcategoria: solicitud.subcategoria,
            CompradorId: solicitud.comprador,
            FechaDeseadaEntrega: solicitud.fechaEntregaDeseada,
            Alcance: solicitud.alcance,
            Justificacion: solicitud.justificacion,
            CondicionesContractuales: solicitud.condicionesContractuales,
            ResponsableId: solicitud.responsable,
            CompraBienes: solicitud.compraBienes,
            CompraServicios: solicitud.compraServicios,
            FaltaRecepcionBienes: solicitud.compraBienes,
            FaltaRecepcionServicios: solicitud.compraServicios,
            FueSondeo: solicitud.FueSondeo,
            Consecutivo: solicitud.consecutivo,
            Estado: solicitud.estado,
            CodigoAriba: solicitud.codigoAriba,
            Cuadrante: solicitud.cuadrante,
            OrdenEstadistica: solicitud.compraOrdenEstadistica,
            NumeroOrdenEstadistica: solicitud.numeroOrdenEstadistica,
            SolicitantePersonaId: solicitud.solicitantePersona,
            FechaDeCreacion: solicitud.fechaCreacion
        });
    }

    agregarFechaAcordada(idSolicitud, obj) {
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(idSolicitud).update(obj);
    }

    agregarCondicionesTecnicasBienesExcel(condicionTecnicaBienes) {
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.add(condicionTecnicaBienes);
    }

    agregarCondicionesTecnicasBienes(condicionTecnicaBienes: CondicionTecnicaBienes) {
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.add({
            Title: condicionTecnicaBienes.titulo,
            SolicitudId: condicionTecnicaBienes.idSolicitud,
            Codigo: condicionTecnicaBienes.codigo,
            CodigoSondeo: condicionTecnicaBienes.codigo,
            Descripcion: condicionTecnicaBienes.descripcion,
            Modelo: condicionTecnicaBienes.modelo,
            Fabricante: condicionTecnicaBienes.fabricante,
            Cantidad: condicionTecnicaBienes.cantidad,
            CantidadSondeo: condicionTecnicaBienes.cantidad,
            ValorEstimado: condicionTecnicaBienes.valorEstimado,
            PrecioSondeo: condicionTecnicaBienes.valorEstimado,
            Comentarios: condicionTecnicaBienes.comentarios,
            TipoMoneda: condicionTecnicaBienes.tipoMoneda,
            MonedaSondeo: condicionTecnicaBienes.tipoMoneda,
            costoInversion: condicionTecnicaBienes.costoInversion,
            numeroCostoInversion: condicionTecnicaBienes.numeroCostoInversion,
            numeroCuenta: condicionTecnicaBienes.numeroCuenta,
            tieneIdServicio: condicionTecnicaBienes.tieneIdServicio,
            IdOrdenServicio: (condicionTecnicaBienes.idOrdenServicio !== null && condicionTecnicaBienes.idOrdenServicio !== undefined) ? condicionTecnicaBienes.idOrdenServicio.toString() : ''
        });
    }
    
    actualizarCondicionesTecnicasBienes(idCondicionTecnicaBienes: number, condicionTecnicaBienes: CondicionTecnicaBienes){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicionTecnicaBienes).update({
            Title: condicionTecnicaBienes.titulo,
            SolicitudId: condicionTecnicaBienes.idSolicitud,
            Codigo: condicionTecnicaBienes.codigo,
            CodigoSondeo: condicionTecnicaBienes.codigo,
            Descripcion: condicionTecnicaBienes.descripcion,
            Modelo: condicionTecnicaBienes.modelo,
            Fabricante: condicionTecnicaBienes.fabricante,
            Cantidad: condicionTecnicaBienes.cantidad,
            CantidadSondeo: condicionTecnicaBienes.cantidad,
            ValorEstimado: condicionTecnicaBienes.valorEstimado,
            PrecioSondeo: condicionTecnicaBienes.valorEstimado,
            Comentarios: condicionTecnicaBienes.comentarios,
            TipoMoneda: condicionTecnicaBienes.tipoMoneda,
            MonedaSondeo: condicionTecnicaBienes.tipoMoneda,
            costoInversion: condicionTecnicaBienes.costoInversion,
            numeroCostoInversion: condicionTecnicaBienes.numeroCostoInversion,
            numeroCuenta: condicionTecnicaBienes.numeroCuenta,
            tieneIdServicio: condicionTecnicaBienes.tieneIdServicio,
            IdOrdenServicio: condicionTecnicaBienes.idOrdenServicio
        });
    }

    async actualiazarDatosContablesBienes(idCondicionTecnicaBienes: number, condicionTecnicaBienes: any) {
        return await this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicionTecnicaBienes).update(condicionTecnicaBienes);
    }
    
    async actualizarDatosContablesServicios(idCondicionTecnicaServicios: number, condicionTecnicaServicios: any) {
        return await this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicionTecnicaServicios).update(condicionTecnicaServicios);
    }

    actualizarCondicionesTecnicasBienesEntregaBienes(IdBienes,objActualizacionCTB){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(IdBienes).update(
            objActualizacionCTB
        );
    }

    borrarCondicionTecnicaBienes(idCondicionTecnicaBienes: number){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicionTecnicaBienes).delete();
    }

    agregarAdjuntoCondicionesTecnicasBienes(idCondicion: number, nombreArchivo: string, archivo: File) {
        let item = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicion);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    agregarAdjuntoActivos(IdSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    async agregarAdjuntoContratos(IdContrato: number, nombreArchivo: string, archivo: File): Promise<any> {
        let item = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.getById(IdContrato);
        return await item.attachmentFiles.add(nombreArchivo, archivo);
    }

    agregarAdjuntoActivosBienes(IdSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(IdSolicitud);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    agregarAdjuntoActivosServicios(IdSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(IdSolicitud);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    borrarAdjuntoCondicionesTecnicasBienes(idCondicion, nombreArchivo){
        let item = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicion);
        return item.attachmentFiles.getByName(nombreArchivo).delete();
    }

    borrarAdjuntoCondicionesTecnicasServicios(idCondicion: number, nombreArchivo: string){
        let item = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicion);
        return item.attachmentFiles.getByName(nombreArchivo).delete();
    }

    agregarCondicionesTecnicasServicios(condicionTecnicaServicios: CondicionTecnicaServicios) {
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.add({
            Title: condicionTecnicaServicios.titulo,
            SolicitudId: condicionTecnicaServicios.idSolicitud,
            Codigo: condicionTecnicaServicios.codigo,
            CodigoSondeo: condicionTecnicaServicios.codigo,
            Descripcion: condicionTecnicaServicios.descripcion,
            Cantidad: condicionTecnicaServicios.cantidad,
            CantidadSondeo: condicionTecnicaServicios.cantidad,
            ValorEstimado: condicionTecnicaServicios.valorEstimado,
            PrecioSondeo: condicionTecnicaServicios.valorEstimado,
            TipoMoneda: condicionTecnicaServicios.tipoMoneda,
            MonedaSondeo: condicionTecnicaServicios.tipoMoneda,
            Comentario: condicionTecnicaServicios.comentarios,
            costoInversion: condicionTecnicaServicios.costoInversion,
            numeroCostoInversion: condicionTecnicaServicios.numeroCostoInversion,
            numeroCuenta: condicionTecnicaServicios.numeroCuenta,
            tieneIdServicio: condicionTecnicaServicios.tieneIdServicio,
            IdOrdenServicio: condicionTecnicaServicios.idOrdenServicio
        });
    }

    agregarCondicionesTecnicasServiciosExcel(condicionTecnicaServicios) {
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.add(condicionTecnicaServicios);
    }

    actualizarCondicionesTecnicasServicios(idCondicionTecnicaServicios: number, condicionTecnicaServicios: CondicionTecnicaServicios){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicionTecnicaServicios).update({
            Title: condicionTecnicaServicios.titulo,
            SolicitudId: condicionTecnicaServicios.idSolicitud,
            Codigo: condicionTecnicaServicios.codigo,
            CodigoSondeo: condicionTecnicaServicios.codigo,
            Descripcion: condicionTecnicaServicios.descripcion,
            Cantidad: condicionTecnicaServicios.cantidad,
            CantidadSondeo: condicionTecnicaServicios.cantidad,
            ValorEstimado: condicionTecnicaServicios.valorEstimado,
            PrecioSondeo: condicionTecnicaServicios.valorEstimado,
            TipoMoneda: condicionTecnicaServicios.tipoMoneda,
            MonedaSondeo: condicionTecnicaServicios.tipoMoneda,
            Comentario: condicionTecnicaServicios.comentarios,
            costoInversion: condicionTecnicaServicios.costoInversion,
            numeroCostoInversion: condicionTecnicaServicios.numeroCostoInversion,
            numeroCuenta: condicionTecnicaServicios.numeroCuenta,
            tieneIdServicio: condicionTecnicaServicios.tieneIdServicio,
            IdOrdenServicio: (condicionTecnicaServicios.idOrdenServicio !== null && condicionTecnicaServicios.idOrdenServicio !== undefined) ? condicionTecnicaServicios.idOrdenServicio : ''
        });
    }

    borrarCondicionTecnicaServicios(idCondicionTecnicaServicios: number){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicionTecnicaServicios).delete();
    }

    agregarAdjuntoCondicionesTecnicasServicios(idSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idSolicitud);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    borraAdjuntoCondicionesTecnicasServicios(idCondicion: number, nombreArchivo: string){
        let item = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicion);
        return item.attachmentFiles.getByName(nombreArchivo).delete();
    }

    obtenerParametrosConfiguracion(){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaConfiguracion).items.filter("Title eq 'Configuración'").get());
        return respuesta;
    }

    obtenerdatosProfile(){
        let respuesta = from(this.ObtenerConfiguracion().profiles.myProperties.get());
        return respuesta;
    }

    obtenerdatosProfileSeleccionado(UserName, propertyName){
        let respuesta = from(this.ObtenerConfiguracion().profiles.getUserProfilePropertyFor(UserName, propertyName)).subscribe(
            result => {
                return respuesta
            }
        );
    }

    obtenerPropiedadesPerfil(loginName) {
        return from(this.ObtenerConfiguracion().profiles.getPropertiesFor(loginName));
        // let respuesta = from(this.ObtenerConfiguracion().profiles.getPropertiesFor(loginName)).subscribe(
        //     result => {
        //         return respuesta
        //     }
        // );
    };

    ObtenerSolicitudBienesServicios(IdSolicitud){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).select("Id","TipoSolicitud","CM","FechaDeseadaEntrega","FechaRegistrarSolpsap","Solicitante","Responsable/Title","OrdenadorGastos/Title","OrdenadorGastos/Department","OrdenadorGastos/Id" ,"Empresa/Title","Pais/Title","Pais/Id","Categoria","Subcategoria","Comprador/Title", "Comprador/ID", "Alcance","Justificacion","CondicionesContractuales","AuthorId","Author/Title","ComentarioSondeo", "ResultadoSondeo","ComentarioRevisionSondeo","ComentarioVerificarMaterial","EstadoRegistrarSAP","ComentarioRegistrarSAP","NumSolSAP","CodigoAriba","Cuadrante","CompraBienes","CompraServicios","OrdenEstadistica","NumeroOrdenEstadistica","AttachmentFiles","Attachments","FaltaRecepcionServicios","FaltaRecepcionBienes", "ComentarioRegistroActivos", "FueSondeo", "FechaDeCreacion","Consecutivo", "SolicitantePersona/Title", "SolicitantePersona/Id", "Estado").expand("OrdenadorGastos","Responsable","Comprador","Empresa","Pais","Author","AttachmentFiles", "SolicitantePersona").get());
        return respuesta;
    }

   async ObtenerSolicitudTab(IdSolicitud): Promise<any> {
        let respuesta = await this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).select("Id","TipoSolicitud","CM","FechaDeseadaEntrega","FechaRegistrarSolpsap","Solicitante","Responsable/Title","OrdenadorGastos/Title","OrdenadorGastos/Department","OrdenadorGastos/Id" ,"Empresa/Title","Pais/Title","Pais/Id","Categoria","Subcategoria","Comprador/Title", "Comprador/ID", "Alcance","Justificacion","CondicionesContractuales","AuthorId","Author/Title","ComentarioSondeo", "ResultadoSondeo","ComentarioRevisionSondeo","ComentarioVerificarMaterial","EstadoRegistrarSAP","ComentarioRegistrarSAP","NumSolSAP","CodigoAriba","CompraBienes","CompraServicios","OrdenEstadistica","NumeroOrdenEstadistica","AttachmentFiles","Attachments","FaltaRecepcionServicios","FaltaRecepcionBienes", "ComentarioRegistroActivos", "FueSondeo", "FechaDeCreacion","Consecutivo", "SolicitantePersona/Title", "SolicitantePersona/Id", "Estado").expand("OrdenadorGastos","Responsable","Comprador","Empresa","Pais","Author","AttachmentFiles", "SolicitantePersona").get();
        return respuesta;
    }

    ObtenerReporteSolicitud(fechaInico, fechaFin){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.select("Consecutivo","TipoSolicitud","Estado","NumSolSAP","CM","OrdenadorGastos/Title","NumeroDeContrato","Solicitante","Author/Department","OrdenadorGastos/ID","Comprador/Title","Comprador/ID","Categoria","Subcategoria","Alcance","Pais/Title","Pais/ID","FueSondeo","FechaDeCreacion","FechaSondeo","FechaRevisarSondeo","FechaVerificarMaterial", "FechaRegistrarActivo", "FechaSuspension", "FechaReactivacion", "FechaRegistrarSolpsap","FechaRegistrarContrato","FechaEnvioProveedor","MotivoDeSuspension","Responsable/ID", "Responsable/Title", "ResponsableReasignarSondeo", "FechaReasignadoSondeo", "ResponsableReasignarContratos", "FechaReasignadoContratos", "FechaAcordada", "Cuadrante").expand("OrdenadorGastos","Responsable","Comprador","Pais", "Author").filter("FechaDeCreacion ge datetime'"+fechaInico+"T00:00:00.00Z' and FechaDeCreacion le datetime'"+fechaFin+"T23:59:59.00Z'").top(4999).get());
        return respuesta;
    }

    ObtenerReporteContratos(fechaInico, fechaFin){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.select("*","Solicitud/Consecutivo").filter("Created ge datetime'"+fechaInico+"T00:00:00.00Z' and Created le datetime'"+fechaFin+"T23:59:59.00Z'").expand("Solicitud").top(4999).get());
        return respuesta;
    }

    ObtenerCondicionesTecnicasBienes(IdSolicitud){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.filter("SolicitudId eq " + IdSolicitud).select("*","Solicitud/ID","AttachmentFiles").expand("Solicitud","AttachmentFiles").get());
        return respuesta;
    }
    
    public async obtenerCtBienes(IdSolicitud): Promise<any> {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.filter("SolicitudId eq " + IdSolicitud).select("*","Solicitud/ID","AttachmentFiles").expand("Solicitud","AttachmentFiles").get()); 
        return await respuesta.toPromise() 
    }
    
    ObtenerCondicionesTecnicasBienesExcel(IdSolicitud){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.filter("SolicitudId eq " + IdSolicitud).select("*","Solicitud/ID","AttachmentFiles").expand("Solicitud","AttachmentFiles").orderBy("Orden").get());
        return respuesta;
    } 

    ObtenerRecepcionesBienes(IdResponsable : number){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.filter("recibidoSap eq '0' and Cantidad ne '0' and Estado eq 'Confirmado' and ResponsableSAPId eq '"+IdResponsable+"'").select("*","AttachmentFiles", "Author/Title").expand("AttachmentFiles", "Author").get());
        return respuesta;
    }

    ObtenerRecepcionesBienesEntregaBienes(IdSolicitud){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.filter("IdSolicitud eq '"+IdSolicitud+"' and recibidoSap eq '0'").select("*","AttachmentFiles").expand("AttachmentFiles").orderBy("Id",false).get());
        return respuesta;
    }

    GuardarBienesRecibidos(ObjRecepcionBienes: RecepcionBienes,IdSolicitud,Responsable,NumeroPedido){
        let RecepcionBienesObj = {
            IdSolicitudId: IdSolicitud,
            IdCTBienesId: ObjRecepcionBienes.Idbienes,
            Descripcion: ObjRecepcionBienes.descripcion,
            Cantidad: ObjRecepcionBienes.cantidad,
            Valor: ObjRecepcionBienes.valor,
            UltimaEntrega: ObjRecepcionBienes.ultimaEntrega,
            Comentario: ObjRecepcionBienes.comentario,
            FechaRecepcion: new Date(),
            ResponsableSAPId: Responsable,
            NumeroPedido: NumeroPedido
        };
        let elemento = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.add(RecepcionBienesObj);
        return elemento;
    }

    actualizarBienesRecibidos(IdBienes){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(IdBienes).update({
            UltimaEntrega: true
        });
    }

    eliminarBienesRecibidos(idBienes){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(idBienes).delete();
    }

    ConfirmarEntregaBienes(IdBienes){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(IdBienes).update({
            Estado: "Confirmado"
        }); 
    }

    cambioEstadoRecepcionBienesServicios(IdSolicitud, objeto){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(
            objeto
        );
    } 

    async actualizarFechaContratos(IdSolicitud): Promise<any>{
        return await this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(
              {
                FechaRegistrarContrato: new Date(),
                // NumeroDeContrato: ContratoOC
            }
        );
    } 
    
    ObtenerCondicionesTecnicasServicios(IdSolicitud){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.filter("SolicitudId eq " + IdSolicitud).select("*","AttachmentFiles").expand("AttachmentFiles").get());
        return respuesta;
    }

    public async obtenerCtServicios(IdSolicitud): Promise<any> {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.filter("SolicitudId eq " + IdSolicitud).select("*","AttachmentFiles").expand("AttachmentFiles").get());
        return await respuesta.toPromise(); 
    }

    ObtenerCondicionesTecnicasServiciosExcel(IdSolicitud){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.filter("SolicitudId eq " + IdSolicitud).select("*","AttachmentFiles").expand("AttachmentFiles").orderBy("Orden").get());
        return respuesta;
    }

    ObtenerRecepcionesServicios(IdResponsable:number){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.filter("recibidoSap eq '0' and Cantidad ne '0' and Estado eq 'Confirmado' and ResponsableSAPId eq '"+IdResponsable+"'").select("*","AttachmentFiles","Author/Title").expand("AttachmentFiles", "Author").get());
        return respuesta;
    }

    ObtenerRecepcionesServicioEntregaServicio(IdSolicitud){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.filter("IdSolicitud eq '"+IdSolicitud+"' and recibidoSap eq '0'").select("*","AttachmentFiles").expand("AttachmentFiles").orderBy("Id",false).get());
        return respuesta;
    }

    GuardarServiciosRecibidos(ObjRecepcionServicios: RecepcionServicios,IdSolicitud,Responsable, NumeroPedido){
        let RecepcionBienesObj = {
            IdSolicitudId: IdSolicitud,
            IdCTServiciosId: ObjRecepcionServicios.idServicio,
            Descripcion: ObjRecepcionServicios.descripcion,
            Cantidad: ObjRecepcionServicios.cantidad,
            Valor: ObjRecepcionServicios.valor,
            UltimaEntrega: ObjRecepcionServicios.ultimaEntrega,
            Comentario: ObjRecepcionServicios.comentario,
            FechaRecepcion: new Date(),
            Estado: ObjRecepcionServicios.estadoRS,
            Ubicacion: ObjRecepcionServicios.ubicacion,
            Mes: ObjRecepcionServicios.mes,
            Ano: ObjRecepcionServicios.ano,
            ResponsableSAPId: Responsable,
            NumeroPedido: NumeroPedido
        };
        let elemento = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.add(RecepcionBienesObj);
        return elemento;
    }

    actualizarCondicionesTecnicasServiciosEntregaServicios(IdServicio,objActualizacionCTS){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(IdServicio).update(
            objActualizacionCTS
        );
    }

    actualizarServiciosRecibidos(IdServicios){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(IdServicios).update({
            UltimaEntrega: true
        });
    }

    eliminarServiciosRecibidos(idServicios){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(idServicios).delete();
    }

    ConfirmarEntregaServicios(IdServicios){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(IdServicios).update({
            Estado: "Confirmado"
        }); 
    }

    async GuardarContrato(ObjContrato): Promise<any>{
        return await this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.add(ObjContrato);
    }

    async cambioEstadoSolicitud(IdSolicitud, nombreEstado, autor): Promise<any>{
        return await this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(
            {
                Estado: nombreEstado,
                ResponsableId: autor
            }
        );
    }
    
    ObtenerMisPendientes(usuarioId){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.select("ID", "Title", "TipoSolicitud", "Solicitante", "Empresa/Title", "OrdenadorGastos/Title", "OrdenadorGastos/ID", "Pais/ID", "Pais/Title", "Empresa/Title", "Empresa/ID", "Comprador/Title", "Comprador/ID", "Categoria", "Subcategoria", "CM", "CondicionesContractuales", "Alcance", "Justificacion", "FechaDeseadaEntrega", "Estado", "Author/Title", "Author/ID", "Created","Responsable/Title", "Responsable/ID", "CompraBienes", "CompraServicios", "CodigoAriba", "Consecutivo", "OrdenEstadistica", "NumeroOrdenEstadistica","FaltaRecepcionServicios","FaltaRecepcionBienes", "FueSondeo", "Suspendida", "Reactivada", "SuspendidaSondeo", "ReactivadaSondeo", "ResponsableSondeo/Title", "ResponsableSondeo/ID", "ResponsableSondeo/EMail", "ReasignadoRevisarSondeo", "SolicitantePersona/Title", "SolicitantePersona/EMail", "SolicitantePersona/ID", "OcultarBtnFechaAcordada").expand("Empresa", "Pais", "OrdenadorGastos", "Comprador", "Responsable", "Author", "ResponsableSondeo", "SolicitantePersona").filter("Responsable eq '"+usuarioId+"' and Estado ne 'Finalizado' and Estado ne 'Rechazado' and Estado ne 'Descartado' and Estado ne 'Inicial' and Estado ne 'Recibido'").orderBy('Consecutivo', true).top(4999).get());
        return respuesta;
    }

    guardarComentario(IdSolicitud, coment){
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(coment);
        return respuesta;
    }

    obtenerResponsableProcesos(IdPais){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaResponsableProceso).items.filter("PaisId eq '"+IdPais+"'").getAll());  
        return respuesta;
    }

    guardarVerificarMaterial(IdSolicitud, objGuardarVerificar){
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(IdSolicitud).update(objGuardarVerificar);
        return respuesta;
    }

    ObtenerContratos(IdSolicitud: number){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.filter("SolicitudId eq " + IdSolicitud).getAll());
        return respuesta;
    }

    ObtenerContratosNoVerificados() {
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.filter("Verificado eq 0").getAll();
        return respuesta;
    } 

    guardarSondeoBienes(idCondicion, objSondeo){   
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicion).update(objSondeo);        
        return respuesta;
    }

    guardarSondeoServicios(idCondicion, objSondeo){   
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicion).update(objSondeo);        
        return respuesta;
    }

    guardarRegSondeo(IdSolicitud, ObjSolpSap){
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(ObjSolpSap);
        return respuesta;
    }

    descartarSolicitud(IdSolicitud, ObjCont){
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(ObjCont);
        return respuesta;
    }

    suspenderSolicitud(IdSolicitud, objSusp){
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(objSusp);
        return respuesta;
    }

    reactivarSolicitud(IdSolicitud, objReac){
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(objReac);
        return respuesta;
    }

    guardarSOLPSAP(IdSolicitud, ObjSolpSap){
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(ObjSolpSap);
        return respuesta;
    }

    registrarRecepcionBienes(IdRecepcion, objRegistrar){
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(IdRecepcion).update(objRegistrar);
        return respuesta;
    }

    registrarRecepcionServicios(IdRecepcion, objRegistrar){
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(IdRecepcion).update(objRegistrar);
        return respuesta;
    }

    actualizarConsecutivo(consecutivoNuevo: number){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaConfiguracion).items.getById(1).update(
            {
                ConsecutivoSolicitudes: consecutivoNuevo
            }
        );
    }

    agregarNotificacion(objNotificacion){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaNotificaciones).items.add(objNotificacion);
    }

    ObtenerGruposUsuario(usuarioId: number){
        let respuesta = from(this.ObtenerConfiguracion().web.getUserById(usuarioId).groups.get());
        return respuesta;
    }

    actualizarResponsableCompradorSolicitud(idSolicitud: number, objetoActualizar){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(idSolicitud).update(objetoActualizar);
    }

    obtenerContratoPorSolicitud(idSolicitud: number){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.filter("SolicitudId eq " + idSolicitud).top(1).get());
        return respuesta;
    }

    obtenerMotivoSuspension() {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaMotivoSuspension).items.get());
        return respuesta;
    }

    obtenerCausalExcepcion() {
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCausalExcepcion).items.get());
        return respuesta;
    }

    async guardarIdContratoBienes(idBienes, idContrato): Promise<any>{
        let respuesta = await this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idBienes).update(
            {
                IdContrato: idContrato
            }
        );
        return respuesta;
    }

    guardarHistorial(objHistorial){
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaHistorial).items.add(objHistorial);
    }

    obtenerReactivarHistorial(idSolicitud){
        let respuesta =  from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaHistorial).items.filter("SolicitudId eq " + idSolicitud + " and ResponsableReactivacion eq null ").top(1).get());
        return respuesta;
    }


    reactivarHistorial(objHistorial, idHistoria){       
        return this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaHistorial).items.getById(idHistoria).update(objHistorial);
    }

    async guardarIdContratoServicios(idBienes, idContrato): Promise<any>{
        let respuesta = await this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idBienes).update(
            {
                IdContrato: idContrato
            }
        );            
        return respuesta;                
    }

    ObtenerCondicionesTecnicasBienesxContrato(IdContrato){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.filter("IdContrato eq " + IdContrato).select("*","Solicitud/ID","AttachmentFiles").expand("Solicitud","AttachmentFiles").get());
        return respuesta;
    }

    ObtenerCondicionesTecnicasServiciosxContrato(IdContrato){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.filter("IdContrato eq " + IdContrato).select("*","AttachmentFiles").expand("AttachmentFiles").get());
        return respuesta;
    }

    ObtenerSolicitudesCrm(){
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudesCrm).items.filter("Exitoso eq '0'").get();
        return respuesta;
    }

    async CambiarEstadoSolicitudesCrm(idSolicitud): Promise<any>{
        let respuesta = await this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudesCrm).items.getById(idSolicitud).update({
            Exitoso: true
        })
        return respuesta;
    }

    async GuardarSolicitudCrm(obj): Promise<any>{
        let respuesta = await this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudesCrm).items.add(obj);
        return respuesta;
    }

    enviarFallidosListaCrm(obj) {
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudesCrm).items.add(obj);
        return respuesta;
    }

    modificarDatosContablesServicio(obj, idServicio){
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idServicio).update(obj);
        return respuesta;
    }

    modificarDatosContablesBienes(obj, idBien){
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idBien).update(obj);
        return respuesta;
    }

    modificarOrdenadorGastos(obj, idSolicitud){
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(idSolicitud).update(obj);
        return respuesta;
    }
    obtenerResponsableSoporte() {
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaResponsableSoporte).items.select('ResponsableSoporte/Title', 'ResponsableSoporte/ID', 'ResponsableSoporte/EMail').expand('ResponsableSoporte').get();
        return respuesta;
    }

    EnviarNotificacion(objNotificacion) {
        let respuesta = this.ObtenerConfiguracion().utility.sendEmail(objNotificacion);
        return respuesta;
    }

    ObtenerTipoEjecucion() {
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaTipoEjecucion).items.getAll();
        return respuesta;
    }

    ObtenerCausalIncumplimiento() {
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCausalIncumplimento).items.getAll();
        return respuesta;
    }

    ConsultarBienesXcontrato(idContrato) {
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.filter("IdContrato eq '"+idContrato+"' and tieneIdServicio eq 1").getAll();
        return respuesta;
    }
    ConsultarServiciosXcontrato(idContrato) {
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.filter("IdContrato eq '"+idContrato+"' and tieneIdServicio eq 1").getAll();
        return respuesta;
    };

    ConsultarSolicitante(idSolicitud) {
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.filter("ID eq '"+idSolicitud+"'").select("SolicitantePersona/Title", "SolicitantePersona/ID", "SolicitantePersona/EMail").expand("SolicitantePersona").get();
        return respuesta;
    };

    ActualizarContrato(idContrato, obj) {
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.getById(idContrato).update(obj);
        return respuesta;
    };

    async ConsultarContratosNoVerificados(idSolicitud) {
        let respuesta = await this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.filter("SolicitudId eq '"+idSolicitud+"' and Verificado eq 0").getAll();
        return respuesta;
    };

    async ConsultarBienesSinContrato(idSolicitud) {
        let respuesta = await this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.filter("SolicitudId eq '"+idSolicitud+"'").getAll();
        return respuesta;
    }

    async ConsultarServiciosSinContrato(idSolicitud) {
        let respuesta = await this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.filter("SolicitudId eq '"+idSolicitud+"'").getAll();
        return respuesta;
    }

    ActualizarEstadoSolicitud(idSolicitud, obj) {
        let respuesta = this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(idSolicitud).update(obj);
        return respuesta;
    }

}