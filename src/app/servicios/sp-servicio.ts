import { environment } from "src/environments/environment";
import { default as pnp } from 'sp-pnp-js';
import { Injectable } from "@angular/core";
import { from } from 'rxjs';
import { Solicitud } from "../dominio/solicitud";
import { CondicionTecnicaBienes } from "../dominio/condicionTecnicaBienes";
import { CondicionTecnicaServicios } from "../dominio/condicionTecnicaServicios";
import { RecepcionBienes } from "../entrega-bienes/recepcionBienes";
import { RecepcionServicios } from "../entrega-servicios/recepcionServicios";

@Injectable()
export class SPServicio {
    constructor() { }

    public obtenerConfiguracion() {
        const configuracionSharepoint = pnp.sp.configure({
            headers: {
                "Accept": "application/json; odata=verbose"
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    public ObtenerConfiguracionConPost() {
        const configuracionSharepoint = pnp.sp.configure({
            headers: {
                "Accept": "application/json; odata=verbose",
                'Content-Type': 'application/json;odata=verbose',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1zeE1KTUxDSURXTVRQdlp5SjZ0eC1DRHh3MCIsImtpZCI6Ii1zeE1KTUxDSURXTVRQdlp5SjZ0eC1DRHh3MCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZW5vdmVsc29sdWNpb25lcy5zaGFyZXBvaW50LmNvbUA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwiaWF0IjoxNTQ4OTcyNTQ2LCJuYmYiOjE1NDg5NzI1NDYsImV4cCI6MTU0OTAwMTY0NiwiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJuYW1laWQiOiI2NTQ4ZDEyMS1jMDUxLTQ3YTEtYWYyYi1lZmRlYzVmOTllNGNAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwib2lkIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3Iiwic3ViIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3IiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.E46WGdzPpNyCrAi7zhLwMcY0cC3TgdWS2zOM_ibsinlXqpcQ9z0uHQn9VMDlR0E8dN4alg4jsAoHoZTy8pFmeaNcZdQB0x2-7UWtk5uc0Yskbk6C50hKe3Hdgx_SmtMMiBeJsZkFpvY5kmSe9Dy59QWUc8Mxmu9Z_rm6kKrTXQnYDIF9wb8LuEWPy30r3ENVTWOyapzEhQP3rU2b0NONQheTrZFbW8cZHdRHXqqLnxV0-Kv1XyqaOPJxg7GJt-kEM167lZgJ8mTAJB9q08AFeXioqZShYHMRgwIHuxcANS25W6nbuTQge-xj3W3l9gOeh3adhxNLI7fau2dDkjZOWw'
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    ObtenerUsuarioActual() {
        let respuesta = from(this.obtenerConfiguracion().web.currentUser.get());
        return respuesta;
    }

    ObtenerTodosLosUsuarios() {
        let respuesta = from(this.obtenerConfiguracion().web.siteUsers.get());
        return respuesta;
    }

    ObtenerUsuarioPorEmail(email : string){
        let respuesta = from(this.obtenerConfiguracion().web.siteUsers.getByEmail(email).get());
        return respuesta;
    }

    ObtenerTiposSolicitud() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaTiposSolicitud).items.getAll());
        return respuesta;
    }

    ObtenerEmpresas() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaEmpresas).items.getAll());
        return respuesta;
    }

    ObtenerPaises() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaPaises).items.getAll());
        return respuesta;
    }

    ObtenerCategorias() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCategorias).items.getAll());
        return respuesta;
    }

    ObtenerSubcategorias(idCategoria: number, idPais: number) {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSubcategorias).items.select("ID", "Title", "Categoria/Title", "Categoria/ID", "Comprador/Title", "Comprador/ID", "Pais/Title", "Pais/ID", "CondicionesTecnicas/Title", "CondicionesTecnicas/ID", "CodigoAriba").expand("Categoria", "Comprador", "CondicionesTecnicas", "Pais").filter("CategoriaId eq " + idCategoria + "and PaisId eq " + idPais).get());
        return respuesta;
    }

    obtenerMisSolicitudes(usuarioId: number) {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.select("ID", "Title", "TipoSolicitud", "Solicitante", "Empresa/Title", "OrdenadorGastos/Title", "Pais/ID", "Pais/Title", "Empresa/Title", "Empresa/ID", "Comprador/Title", "Comprador/ID", "Categoria", "Subcategoria", "CM", "CondicionesContractuales", "Alcance", "Justificacion", "FechaDeseadaEntrega", "Estado", "Author/Title", "Author/ID", "Responsable/Title", "Created", "CodigoAriba", "Consecutivo", "FueSondeo").expand("Empresa", "Pais", "OrdenadorGastos", "Responsable", "Comprador", "Author").filter("AuthorId eq " + usuarioId + " and Estado ne 'Inicial'").get());
        return respuesta;
    }

    agregarSolicitud(solicitud: Solicitud) {
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.add({
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
            NumeroOrdenEstadistica: solicitud.numeroOrdenEstadistica
        });
    }

    borrarSolicitud(Idsolicitud: number){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(Idsolicitud).delete();
    }

    actualizarSolicitud(idSolicitud: number, solicitud: Solicitud){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(idSolicitud).update({
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
            OrdenEstadistica: solicitud.compraOrdenEstadistica,
            NumeroOrdenEstadistica: solicitud.numeroOrdenEstadistica
        });
    }

    agregarCondicionesTecnicasBienes(condicionTecnicaBienes: CondicionTecnicaBienes) {
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.add({
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
            MonedaSondeo: condicionTecnicaBienes.tipoMoneda
        });
    }

    actualizarCondicionesTecnicasBienes(idCondicionTecnicaBienes: number, condicionTecnicaBienes: CondicionTecnicaBienes){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicionTecnicaBienes).update({
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
            MonedaSondeo: condicionTecnicaBienes.tipoMoneda
        });
    }

    actualizarCondicionesTecnicasBienesEntregaBienes(IdBienes,objActualizacionCTB){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(IdBienes).update(
            objActualizacionCTB
        );
    }

    borrarCondicionTecnicaBienes(idCondicionTecnicaBienes: number){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicionTecnicaBienes).delete();
    }

    agregarAdjuntoCondicionesTecnicasBienes(idCondicion: number, nombreArchivo: string, archivo: File) {
        let item = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicion);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    agregarAdjuntoActivos(IdSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    agregarAdjuntoActivosBienes(IdSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(IdSolicitud);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    agregarAdjuntoActivosServicios(IdSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(IdSolicitud);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    borrarAdjuntoCondicionesTecnicasBienes(idCondicion: number, nombreArchivo: string){
        let item = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicion);
        return item.attachmentFiles.getByName(nombreArchivo).delete();
    }

    agregarCondicionesTecnicasServicios(condicionTecnicaServicios: CondicionTecnicaServicios) {
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.add({
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
            Comentario: condicionTecnicaServicios.comentarios
        });
    }

    actualizarCondicionesTecnicasServicios(idCondicionTecnicaServicios: number, condicionTecnicaServicios: CondicionTecnicaServicios){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicionTecnicaServicios).update({
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
            Comentario: condicionTecnicaServicios.comentarios
        });
    }

    borrarCondicionTecnicaServicios(idCondicionTecnicaServicios: number){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicionTecnicaServicios).delete();
    }

    agregarAdjuntoCondicionesTecnicasServicios(idSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idSolicitud);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    borraAdjuntoCondicionesTecnicasServicios(idCondicion: number, nombreArchivo: string){
        let item = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicion);
        return item.attachmentFiles.getByName(nombreArchivo).delete();
    }

    obtenerParametrosConfiguracion(){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaConfiguracion).items.filter("Title eq 'Configuración'").get());
        return respuesta;
    }

    obtenerdatosProfile(){
        let respuesta = from(this.obtenerConfiguracion().profiles.myProperties.get());
        return respuesta;
    }

    ObtenerSolicitudBienesServicios(IdSolicitud){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).select("Id","TipoSolicitud","CM","FechaDeseadaEntrega","Solicitante","Responsable/Title","OrdenadorGastos/Title","Empresa/Title","Pais/Title","Pais/Id","Categoria","Subcategoria","Comprador/Title", "Comprador/ID", "Alcance","Justificacion","CondicionesContractuales","AuthorId","Author/Title","ComentarioSondeo", "ResultadoSondeo","ComentarioRevisionSondeo","ComentarioVerificarMaterial","EstadoRegistrarSAP","ComentarioRegistrarSAP","NumSolSAP","CodigoAriba","CompraBienes","CompraServicios","OrdenEstadistica","NumeroOrdenEstadistica","AttachmentFiles","Attachments","FaltaRecepcionServicios","FaltaRecepcionBienes", "ComentarioRegistroActivos", "FueSondeo").expand("OrdenadorGastos","Responsable","Comprador","Empresa","Pais","Author","AttachmentFiles").get());
        return respuesta;
    }

    ObtenerCondicionesTecnicasBienes(IdSolicitud){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.filter("SolicitudId eq " + IdSolicitud).select("*","Solicitud/ID","AttachmentFiles").expand("Solicitud","AttachmentFiles").get());
        return respuesta;
    }

    ObtenerRecepcionesBienes(IdResponsable : number){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.filter("recibidoSap eq '0' and Cantidad ne '0' and ResponsableSAPId eq '"+IdResponsable+"'").select("*","AttachmentFiles", "Author/Title").expand("AttachmentFiles", "Author").get());
        return respuesta;
    }

    ObtenerRecepcionesBienesEntregaBienes(IdSolicitud){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.filter("IdSolicitud eq '"+IdSolicitud+"' and recibidoSap eq '0'").select("*","AttachmentFiles").expand("AttachmentFiles").get());
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
        let elemento = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.add(RecepcionBienesObj);
        return elemento;
    }

    actualizarBienesRecibidos(IdBienes){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(IdBienes).update({
            UltimaEntrega: true
        });
    }

    eliminarBienesRecibidos(idBienes){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(idBienes).delete();
    }

    ConfirmarEntregaBienes(IdBienes){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(IdBienes).update({
            Estado: "Confirmado"
        }); 
    }

    cambioEstadoRecepcionBienesServicios(IdSolicitud, objeto){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(
            objeto
        );
    } 
    
    ObtenerCondicionesTecnicasServicios(IdSolicitud){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.filter("SolicitudId eq " + IdSolicitud).select("*","AttachmentFiles").expand("AttachmentFiles").get());
        return respuesta;
    }

    ObtenerRecepcionesServicios(IdResponsable:number){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.filter("recibidoSap eq '0' and Cantidad ne '0' and ResponsableSAPId eq '"+IdResponsable+"'").select("*","AttachmentFiles","Author/Title").expand("AttachmentFiles", "Author").get());
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
        let elemento = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.add(RecepcionBienesObj);
        return elemento;
    }

    actualizarCondicionesTecnicasServiciosEntregaServicios(IdServicio,objActualizacionCTS){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(IdServicio).update(
            objActualizacionCTS
        );
    }

    actualizarServiciosRecibidos(IdServicios){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(IdServicios).update({
            UltimaEntrega: true
        });
    }

    eliminarServiciosRecibidos(idServicios){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(idServicios).delete();
    }

    ConfirmarEntregaServicios(IdServicios){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(IdServicios).update({
            Estado: "Confirmado"
        }); 
    }

    GuardarContrato(ObjContrato){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.add(ObjContrato);
    }

    cambioEstadoSolicitud(IdSolicitud, nombreEstado, autor){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(
            {
                Estado: nombreEstado,
                ResponsableId: autor
            }
        );
    }
    
    ObtenerMisPendientes(usuarioId){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.select("ID", "Title", "TipoSolicitud", "Solicitante", "Empresa/Title", "OrdenadorGastos/Title", "OrdenadorGastos/ID", "Pais/ID", "Pais/Title", "Empresa/Title", "Empresa/ID", "Comprador/Title", "Comprador/ID", "Categoria", "Subcategoria", "CM", "CondicionesContractuales", "Alcance", "Justificacion", "FechaDeseadaEntrega", "Estado", "Author/Title", "Author/ID", "Created","Responsable/Title", "CompraBienes", "CompraServicios", "CodigoAriba", "Consecutivo", "OrdenEstadistica", "NumeroOrdenEstadistica","FaltaRecepcionServicios","FaltaRecepcionBienes", "FueSondeo").expand("Empresa", "Pais", "OrdenadorGastos", "Comprador", "Responsable", "Author").filter("Responsable eq '"+usuarioId+"' and Estado ne 'Finalizado' and Estado ne 'Rechazado' and Estado ne 'Descartado' and Estado ne 'Inicial' and Estado ne 'Recibido'").get());
        return respuesta;
    }

    guardarComentario(IdSolicitud, coment){
        let respuesta = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(coment);
        return respuesta;
    }

    obtenerResponsableProcesos(IdPais){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaResponsableProceso).items.filter("PaisId eq '"+IdPais+"'").getAll());  
        return respuesta;
    }

    guardarVerificarMaterial(IdSolicitud, objGuardarVerificar){
        let respuesta = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(IdSolicitud).update(objGuardarVerificar);
        return respuesta;
    }

    ObtenerContratos(IdSolicitud){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.getAll());
        return respuesta;
    }

    guardarSondeoBienes(idCondicion, objSondeo){   
        let respuesta = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicion).update(objSondeo);        
        return respuesta;
    }

    guardarSondeoServicios(idCondicion, objSondeo){   
        let respuesta = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicion).update(objSondeo);        
        return respuesta;
    }

    guardarRegSondeo(IdSolicitud, ObjSolpSap){
        let respuesta = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(ObjSolpSap);
        return respuesta;
    }

    guardarSOLPSAP(IdSolicitud, ObjSolpSap){
        let respuesta = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(ObjSolpSap);
        return respuesta;
    }

    registrarRecepcionBienes(IdRecepcion, objRegistrar){
        let respuesta = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(IdRecepcion).update(objRegistrar);
        return respuesta;
    }

    registrarRecepcionServicios(IdRecepcion, objRegistrar){
        let respuesta = this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(IdRecepcion).update(objRegistrar);
        return respuesta;
    }

    actualizarConsecutivo(consecutivoNuevo: number){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaConfiguracion).items.getById(1).update(
            {
                ConsecutivoSolicitudes: consecutivoNuevo
            }
        );
    }

    agregarNotificacion(objNotificacion){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaNotificaciones).items.add(objNotificacion);
    }

    ObtenerGruposUsuario(usuarioId: number){
        let respuesta = from(this.obtenerConfiguracion().web.getUserById(usuarioId).groups.get());
        return respuesta;
    }

    actualizarResponsableCompradorSolicitud(idSolicitud: number, objetoActualizar){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(idSolicitud).update(objetoActualizar);
    }

    obtenerContratoPorSolicitud(idSolicitud: number){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.filter("SolicitudId eq " + idSolicitud).top(1).get());
        return respuesta;
    }

}