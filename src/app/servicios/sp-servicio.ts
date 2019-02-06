import { environment } from "src/environments/environment";
<<<<<<< HEAD
import { default as pnp, Web } from 'sp-pnp-js';
=======
import { default as pnp } from 'sp-pnp-js';
>>>>>>> master
import { Injectable } from "@angular/core";
import { from } from 'rxjs';
import { Solicitud } from "../dominio/solicitud";
import { CondicionTecnicaBienes } from "../dominio/condicionTecnicaBienes";
import { CondicionTecnicaServicios } from "../dominio/condicionTecnicaServicios";
import { RecepcionBienes } from "../entrega-bienes/recepcionBienes";
import { RecepcionServicios } from "../entrega-servicios/recepcionServicios";
<<<<<<< HEAD
import { Contratos } from "../dominio/contrato";
=======
>>>>>>> master

@Injectable()
export class SPServicio {
    constructor() { }

<<<<<<< HEAD
    public obtenerConfiguracion() {
=======
    public ObtenerConfiguracion() {
>>>>>>> master
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
<<<<<<< HEAD
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSIsImtpZCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZW5vdmVsc29sdWNpb25lcy5zaGFyZXBvaW50LmNvbUA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwiaWF0IjoxNTQ4NzA2MDY4LCJuYmYiOjE1NDg3MDYwNjgsImV4cCI6MTU0ODczNTE2OCwiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJuYW1laWQiOiI2NTQ4ZDEyMS1jMDUxLTQ3YTEtYWYyYi1lZmRlYzVmOTllNGNAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwib2lkIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3Iiwic3ViIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3IiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.smXuUW6dJhtI-OidG1X1m5PH6kWf7p1EvohNsdyctwA6b771RJyXF5WH724YmK1lUdeVkK7exVYHLMprAxJPLJS9IcZB4LxM1DJH6FMp3Sp6cqOdEM9r1YWULZRQfRqSEcYAMVoGcyIEO04dgxsUwS61sxs4cCOP593zN6tRIzGagajk15djUROvwiYk9JOGVdjF2D_vlPzzOacLfL3SoxGV6kqxRRnHT4qHKG9RK0S4UK2wETAX8mxpp_7SbRPMdTUjADk_94bcyR8wVEH7hC1m_XbmrkRq8lmgbEDmkroap4oFUlfM91XpdZiDkjWSwXyvIVxd47KzWwljDH6jDw'
=======
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1zeE1KTUxDSURXTVRQdlp5SjZ0eC1DRHh3MCIsImtpZCI6Ii1zeE1KTUxDSURXTVRQdlp5SjZ0eC1DRHh3MCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZW5vdmVsc29sdWNpb25lcy5zaGFyZXBvaW50LmNvbUA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwiaWF0IjoxNTQ5NDAyNjEwLCJuYmYiOjE1NDk0MDI2MTAsImV4cCI6MTU0OTQzMTcxMCwiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJuYW1laWQiOiI2NTQ4ZDEyMS1jMDUxLTQ3YTEtYWYyYi1lZmRlYzVmOTllNGNAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwib2lkIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3Iiwic3ViIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3IiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.p4DeTjtYSeageMKyp52lOg4Ei6xAjUIL05SFoGxn813KA04TsDk3WbDbfYxXfIgBv2s11X-pYN0jnqnk3FMPTGyTIVG1I0foCV-UlOySqjY61ODBjc9G5Y9xLBXVqVt7Jpv8ixIolsfdFPjMANNmoeiA06kNyC3vcNJViIsXIqiaEdKV8ekVn3jQeFRYbAGpRGRHRLl97riFk5ocYYhVDbK4Pb1lgSr3oIFAl4Jwj-iPRSvtV0tiJFc5VXVkIfb4jLPrNunkswunxYfzXdD9pu7XpB4q7D4MecEdxpqBUSRbW5nceD-N4rIjBUzHEiTxdI9N4Tl6RHoITOIE9whfGQ'
>>>>>>> master
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    ObtenerUsuarioActual() {
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.currentUser.get());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.currentUser.get());
>>>>>>> master
        return respuesta;
    }

    ObtenerTodosLosUsuarios() {
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.siteUsers.get());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.siteUsers.get());
>>>>>>> master
        return respuesta;
    }

    ObtenerUsuarioPorEmail(email : string){
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.siteUsers.getByEmail(email).get());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.siteUsers.getByEmail(email).get());
>>>>>>> master
        return respuesta;
    }

    ObtenerTiposSolicitud() {
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaTiposSolicitud).items.getAll());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaTiposSolicitud).items.getAll());
>>>>>>> master
        return respuesta;
    }

    ObtenerEmpresas() {
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaEmpresas).items.getAll());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaEmpresas).items.getAll());
>>>>>>> master
        return respuesta;
    }

    ObtenerPaises() {
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaPaises).items.getAll());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaPaises).items.getAll());
>>>>>>> master
        return respuesta;
    }

    ObtenerCategorias() {
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCategorias).items.getAll());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCategorias).items.getAll());
>>>>>>> master
        return respuesta;
    }

    ObtenerSubcategorias(idCategoria: number, idPais: number) {
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSubcategorias).items.select("ID", "Title", "Categoria/Title", "Categoria/ID", "Comprador/Title", "Comprador/ID", "Pais/Title", "Pais/ID", "CondicionesTecnicas/Title", "CondicionesTecnicas/ID", "CodigoAriba").expand("Categoria", "Comprador", "CondicionesTecnicas", "Pais").filter("CategoriaId eq " + idCategoria + "and PaisId eq " + idPais).get());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSubcategorias).items.select("ID", "Title", "Categoria/Title", "Categoria/ID", "Comprador/Title", "Comprador/ID", "Pais/Title", "Pais/ID", "CondicionesTecnicas/Title", "CondicionesTecnicas/ID", "CodigoAriba").expand("Categoria", "Comprador", "CondicionesTecnicas", "Pais").filter("CategoriaId eq " + idCategoria + "and PaisId eq " + idPais).get());
>>>>>>> master
        return respuesta;
    }

    obtenerMisSolicitudes(usuarioId: number) {
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.select("ID", "Title", "TipoSolicitud", "Solicitante", "Empresa/Title", "OrdenadorGastos/Title", "Pais/ID", "Pais/Title", "Empresa/Title", "Empresa/ID", "Comprador/Title", "Comprador/ID", "Categoria", "Subcategoria", "CM", "CondicionesContractuales", "Alcance", "Justificacion", "FechaDeseadaEntrega", "Estado", "Author/Title", "Author/ID", "Responsable/Title", "Created", "CodigoAriba", "Consecutivo", "FueSondeo").expand("Empresa", "Pais", "OrdenadorGastos", "Responsable", "Comprador", "Author").filter("AuthorId eq " + usuarioId + " and Estado ne 'Inicial'").get());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.select("ID", "Title", "TipoSolicitud", "Solicitante", "Empresa/Title", "OrdenadorGastos/Title", "Pais/ID", "Pais/Title", "Empresa/Title", "Empresa/ID", "Comprador/Title", "Comprador/ID", "Categoria", "Subcategoria", "CM", "CondicionesContractuales", "Alcance", "Justificacion", "FechaDeseadaEntrega", "Estado", "Author/Title", "Author/ID", "Responsable/Title", "Created", "CodigoAriba", "Consecutivo", "FueSondeo").expand("Empresa", "Pais", "OrdenadorGastos", "Responsable", "Comprador", "Author").filter("AuthorId eq " + usuarioId + " and Estado ne 'Inicial'").orderBy('Consecutivo', true).get());
>>>>>>> master
        return respuesta;
    }

    agregarSolicitud(solicitud: Solicitud) {
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSolicitudes).items.add({
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
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSolicitudes).items.getById(Idsolicitud).delete();
    }

    actualizarSolicitud(idSolicitud: number, solicitud: Solicitud){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSolicitudes).items.getById(idSolicitud).update({
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
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.add({
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
<<<<<<< HEAD
            TipoMoneda: condicionTecnicaBienes.tipoMoneda
=======
            TipoMoneda: condicionTecnicaBienes.tipoMoneda,
            MonedaSondeo: condicionTecnicaBienes.tipoMoneda
>>>>>>> master
        });
    }

    actualizarCondicionesTecnicasBienes(idCondicionTecnicaBienes: number, condicionTecnicaBienes: CondicionTecnicaBienes){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicionTecnicaBienes).update({
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
<<<<<<< HEAD
            TipoMoneda: condicionTecnicaBienes.tipoMoneda
=======
            TipoMoneda: condicionTecnicaBienes.tipoMoneda,
            MonedaSondeo: condicionTecnicaBienes.tipoMoneda
>>>>>>> master
        });
    }

    actualizarCondicionesTecnicasBienesEntregaBienes(IdBienes,objActualizacionCTB){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(IdBienes).update(
            objActualizacionCTB
        );
    }

    borrarCondicionTecnicaBienes(idCondicionTecnicaBienes: number){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicionTecnicaBienes).delete();
    }

    agregarAdjuntoCondicionesTecnicasBienes(idCondicion: number, nombreArchivo: string, archivo: File) {
        let item = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicion);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    agregarAdjuntoActivos(IdSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    agregarAdjuntoActivosBienes(IdSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(IdSolicitud);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    agregarAdjuntoActivosServicios(IdSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(IdSolicitud);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    borrarAdjuntoCondicionesTecnicasBienes(idCondicion: number, nombreArchivo: string){
        let item = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicion);
        return item.attachmentFiles.getByName(nombreArchivo).delete();
    }

    agregarCondicionesTecnicasServicios(condicionTecnicaServicios: CondicionTecnicaServicios) {
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.add({
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
<<<<<<< HEAD
=======
            MonedaSondeo: condicionTecnicaServicios.tipoMoneda,
>>>>>>> master
            Comentario: condicionTecnicaServicios.comentarios
        });
    }

    actualizarCondicionesTecnicasServicios(idCondicionTecnicaServicios: number, condicionTecnicaServicios: CondicionTecnicaServicios){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicionTecnicaServicios).update({
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
<<<<<<< HEAD
=======
            MonedaSondeo: condicionTecnicaServicios.tipoMoneda,
>>>>>>> master
            Comentario: condicionTecnicaServicios.comentarios
        });
    }

    borrarCondicionTecnicaServicios(idCondicionTecnicaServicios: number){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicionTecnicaServicios).delete();
    }

    agregarAdjuntoCondicionesTecnicasServicios(idSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idSolicitud);
        return item.attachmentFiles.add(nombreArchivo, archivo);
    }

    borraAdjuntoCondicionesTecnicasServicios(idCondicion: number, nombreArchivo: string){
        let item = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicion);
        return item.attachmentFiles.getByName(nombreArchivo).delete();
    }

    obtenerParametrosConfiguracion(){
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaConfiguracion).items.filter("Title eq 'Configuración'").get());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaConfiguracion).items.filter("Title eq 'Configuración'").get());
>>>>>>> master
        return respuesta;
    }

    obtenerdatosProfile(){
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().profiles.myProperties.get());
=======
        let respuesta = from(this.ObtenerConfiguracion().profiles.myProperties.get());
>>>>>>> master
        return respuesta;
    }

    ObtenerSolicitudBienesServicios(IdSolicitud){
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).select("Id","TipoSolicitud","FechaDeseadaEntrega","Solicitante","Responsable/Title","OrdenadorGastos/Title","Empresa/Title","Pais/Title","Pais/Id","Categoria","Subcategoria","Comprador/Title", "Comprador/ID", "Alcance","Justificacion","CondicionesContractuales","AuthorId","Author/Title","ComentarioSondeo", "ResultadoSondeo","ComentarioRevisionSondeo","ComentarioVerificarMaterial","EstadoRegistrarSAP","ComentarioRegistrarSAP","NumSolSAP","CodigoAriba","CompraBienes","CompraServicios","OrdenEstadistica","NumeroOrdenEstadistica","AttachmentFiles","Attachments","FaltaRecepcionServicios","FaltaRecepcionBienes").expand("OrdenadorGastos","Responsable","Comprador","Empresa","Pais","Author","AttachmentFiles").get());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).select("Id","TipoSolicitud","CM","FechaDeseadaEntrega","Solicitante","Responsable/Title","OrdenadorGastos/Title","Empresa/Title","Pais/Title","Pais/Id","Categoria","Subcategoria","Comprador/Title", "Comprador/ID", "Alcance","Justificacion","CondicionesContractuales","AuthorId","Author/Title","ComentarioSondeo", "ResultadoSondeo","ComentarioRevisionSondeo","ComentarioVerificarMaterial","EstadoRegistrarSAP","ComentarioRegistrarSAP","NumSolSAP","CodigoAriba","CompraBienes","CompraServicios","OrdenEstadistica","NumeroOrdenEstadistica","AttachmentFiles","Attachments","FaltaRecepcionServicios","FaltaRecepcionBienes", "ComentarioRegistroActivos", "FueSondeo").expand("OrdenadorGastos","Responsable","Comprador","Empresa","Pais","Author","AttachmentFiles").get());
>>>>>>> master
        return respuesta;
    }

    ObtenerCondicionesTecnicasBienes(IdSolicitud){
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.filter("SolicitudId eq " + IdSolicitud).select("*","Solicitud/ID","AttachmentFiles").expand("Solicitud","AttachmentFiles").get());
        return respuesta;
    }

    ObtenerRecepcionesBienes(IdResponsable){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.filter("recibidoSap eq '0' and Cantidad ne '0' and ResponsableSAPId eq '"+IdResponsable+"'").select("*","AttachmentFiles").expand("AttachmentFiles").get());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.filter("SolicitudId eq " + IdSolicitud).select("*","Solicitud/ID","AttachmentFiles").expand("Solicitud","AttachmentFiles").get());
        return respuesta;
    }

    ObtenerRecepcionesBienes(IdResponsable : number){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.filter("recibidoSap eq '0' and Cantidad ne '0' and Estado eq 'Confirmado' and ResponsableSAPId eq '"+IdResponsable+"'").select("*","AttachmentFiles", "Author/Title").expand("AttachmentFiles", "Author").get());
>>>>>>> master
        return respuesta;
    }

    ObtenerRecepcionesBienesEntregaBienes(IdSolicitud){
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.filter("IdSolicitud eq '"+IdSolicitud+"' and recibidoSap eq '0'").select("*","AttachmentFiles").expand("AttachmentFiles").get());
        return respuesta;
    }

    GuardarBienesRecibidos(ObjRecepcionBienes: RecepcionBienes,IdSolicitud,Responsable){
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionBienes).items.filter("IdSolicitud eq '"+IdSolicitud+"' and recibidoSap eq '0'").select("*","AttachmentFiles").expand("AttachmentFiles").get());
        return respuesta;
    }

    GuardarBienesRecibidos(ObjRecepcionBienes: RecepcionBienes,IdSolicitud,Responsable,NumeroPedido){
>>>>>>> master
        let RecepcionBienesObj = {
            IdSolicitudId: IdSolicitud,
            IdCTBienesId: ObjRecepcionBienes.Idbienes,
            Descripcion: ObjRecepcionBienes.descripcion,
            Cantidad: ObjRecepcionBienes.cantidad,
            Valor: ObjRecepcionBienes.valor,
            UltimaEntrega: ObjRecepcionBienes.ultimaEntrega,
            Comentario: ObjRecepcionBienes.comentario,
            FechaRecepcion: new Date(),
<<<<<<< HEAD
            ResponsableSAPId: Responsable
=======
            ResponsableSAPId: Responsable,
            NumeroPedido: NumeroPedido
>>>>>>> master
        };
        let elemento = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaRecepcionBienes).items.add(RecepcionBienesObj);
        return elemento;
    }

    actualizarBienesRecibidos(IdBienes){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(IdBienes).update({
            UltimaEntrega: true
        });
    }

    eliminarBienesRecibidos(idBienes){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(idBienes).delete();
    }

    ConfirmarEntregaBienes(IdBienes){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(IdBienes).update({
            Estado: "Confirmado"
        }); 
    }

    cambioEstadoRecepcionBienesServicios(IdSolicitud, objeto){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(
            objeto
<<<<<<< HEAD
            // {
            //     Estado: nombreEstado,
            //     FaltaRecpcion: true,
            //     Responsable: Autor
            // }
=======
>>>>>>> master
        );
    } 
    
    ObtenerCondicionesTecnicasServicios(IdSolicitud){
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.filter("SolicitudId eq " + IdSolicitud).select("*","AttachmentFiles").expand("AttachmentFiles").get());
        return respuesta;
    }

    ObtenerRecepcionesServicios(IdSolicitud:number){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.filter("IdSolicitudId eq '" + IdSolicitud + "' and Cantidad ne '0' and recibidoSap eq '0'").get());
        return respuesta;
        }

    GuardarServiciosRecibidos(ObjRecepcionServicios: RecepcionServicios,IdSolicitud,Responsable){
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.filter("SolicitudId eq " + IdSolicitud).select("*","AttachmentFiles").expand("AttachmentFiles").get());
        return respuesta;
    }

    ObtenerRecepcionesServicios(IdResponsable:number){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaRecepcionServicios).items.filter("recibidoSap eq '0' and Cantidad ne '0' and Estado eq 'Confirmado' and ResponsableSAPId eq '"+IdResponsable+"'").select("*","AttachmentFiles","Author/Title").expand("AttachmentFiles", "Author").get());
        return respuesta;
    }

    GuardarServiciosRecibidos(ObjRecepcionServicios: RecepcionServicios,IdSolicitud,Responsable, NumeroPedido){
>>>>>>> master
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
<<<<<<< HEAD
            ResponsableSAPId: Responsable
=======
            ResponsableSAPId: Responsable,
            NumeroPedido: NumeroPedido
>>>>>>> master
        };
        let elemento = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaRecepcionServicios).items.add(RecepcionBienesObj);
        return elemento;
    }

    actualizarCondicionesTecnicasServiciosEntregaServicios(IdServicio,objActualizacionCTS){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(IdServicio).update(
            objActualizacionCTS
        );
    }

    actualizarServiciosRecibidos(IdServicios){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(IdServicios).update({
            UltimaEntrega: true
        });
    }

    eliminarServiciosRecibidos(idServicios){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(idServicios).delete();
    }

    ConfirmarEntregaServicios(IdServicios){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(IdServicios).update({
            Estado: "Confirmado"
        }); 
    }

    GuardarContrato(ObjContrato){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaContratos).items.add(ObjContrato);
    }

    cambioEstadoSolicitud(IdSolicitud, nombreEstado, autor){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(
            {
                Estado: nombreEstado,
                ResponsableId: autor
<<<<<<< HEAD
                // ResponsableBienesId: ResponsableBienes,
                // ResponsableServiciosId: ResponsableServicios
=======
>>>>>>> master
            }
        );
    }
    
    ObtenerMisPendientes(usuarioId){
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.select("ID", "Title", "TipoSolicitud", "Solicitante", "Empresa/Title", "OrdenadorGastos/Title", "OrdenadorGastos/ID", "Pais/ID", "Pais/Title", "Empresa/Title", "Empresa/ID", "Comprador/Title", "Comprador/ID", "Categoria", "Subcategoria", "CM", "CondicionesContractuales", "Alcance", "Justificacion", "FechaDeseadaEntrega", "Estado", "Author/Title", "Author/ID", "Created","Responsable/Title", "CompraBienes", "CompraServicios", "CodigoAriba", "Consecutivo", "OrdenEstadistica", "NumeroOrdenEstadistica","FaltaRecepcionServicios","FaltaRecepcionBienes", "FueSondeo").expand("Empresa", "Pais", "OrdenadorGastos", "Comprador", "Responsable", "Author").filter("Responsable eq '"+usuarioId+"' and Estado ne 'Finalizado' and Estado ne 'Rechazado' and Estado ne 'Descartado' and Estado ne 'Inicial' and Estado ne 'Recibido'").get());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.select("ID", "Title", "TipoSolicitud", "Solicitante", "Empresa/Title", "OrdenadorGastos/Title", "OrdenadorGastos/ID", "Pais/ID", "Pais/Title", "Empresa/Title", "Empresa/ID", "Comprador/Title", "Comprador/ID", "Categoria", "Subcategoria", "CM", "CondicionesContractuales", "Alcance", "Justificacion", "FechaDeseadaEntrega", "Estado", "Author/Title", "Author/ID", "Created","Responsable/Title", "Responsable/ID", "CompraBienes", "CompraServicios", "CodigoAriba", "Consecutivo", "OrdenEstadistica", "NumeroOrdenEstadistica","FaltaRecepcionServicios","FaltaRecepcionBienes", "FueSondeo").expand("Empresa", "Pais", "OrdenadorGastos", "Comprador", "Responsable", "Author").filter("Responsable eq '"+usuarioId+"' and Estado ne 'Finalizado' and Estado ne 'Rechazado' and Estado ne 'Descartado' and Estado ne 'Inicial' and Estado ne 'Recibido'").orderBy('Consecutivo', true).get());
>>>>>>> master
        return respuesta;
    }

    guardarComentario(IdSolicitud, coment){
        let respuesta = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(coment);
        return respuesta;
    }

    obtenerResponsableProcesos(IdPais){
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaResponsableProceso).items.filter("PaisId eq '"+IdPais+"'").getAll());  
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaResponsableProceso).items.filter("PaisId eq '"+IdPais+"'").getAll());  
>>>>>>> master
        return respuesta;
    }

    guardarVerificarMaterial(IdSolicitud, objGuardarVerificar){
        let respuesta = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(IdSolicitud).update(objGuardarVerificar);
        return respuesta;
    }

    ObtenerContratos(IdSolicitud){
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.getAll());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.getAll());
>>>>>>> master
        return respuesta;
    }

    guardarSondeoBienes(idCondicion, objSondeo){   
        let respuesta = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicion).update(objSondeo);        
        return respuesta;
    }

    guardarSondeoServicios(idCondicion, objSondeo){   
        let respuesta = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicion).update(objSondeo);        
        return respuesta;
    }

    guardarRegSondeo(IdSolicitud, ObjSolpSap){
        let respuesta = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(ObjSolpSap);
        return respuesta;
    }

    guardarSOLPSAP(IdSolicitud, ObjSolpSap){
        let respuesta = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSolicitudes).items.getById(IdSolicitud).update(ObjSolpSap);
        return respuesta;
    }

    registrarRecepcionBienes(IdRecepcion, objRegistrar){
        let respuesta = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaRecepcionBienes).items.getById(IdRecepcion).update(objRegistrar);
        return respuesta;
    }

    registrarRecepcionServicios(IdRecepcion, objRegistrar){
        let respuesta = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaRecepcionServicios).items.getById(IdRecepcion).update(objRegistrar);
        return respuesta;
    }

    actualizarConsecutivo(consecutivoNuevo: number){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaConfiguracion).items.getById(1).update(
            {
                ConsecutivoSolicitudes: consecutivoNuevo
            }
        );
    }

    agregarNotificacion(objNotificacion){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaNotificaciones).items.add(objNotificacion);
    }

    ObtenerGruposUsuario(usuarioId: number){
<<<<<<< HEAD
        let respuesta = from(this.obtenerConfiguracion().web.getUserById(usuarioId).groups.get());
=======
        let respuesta = from(this.ObtenerConfiguracion().web.getUserById(usuarioId).groups.get());
>>>>>>> master
        return respuesta;
    }

    actualizarResponsableCompradorSolicitud(idSolicitud: number, objetoActualizar){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSolicitudes).items.getById(idSolicitud).update(objetoActualizar);
    }

<<<<<<< HEAD
=======
    obtenerContratoPorSolicitud(idSolicitud: number){
        let respuesta = from(this.ObtenerConfiguracion().web.lists.getByTitle(environment.listaContratos).items.filter("SolicitudId eq " + idSolicitud).top(1).get());
        return respuesta;
    }

>>>>>>> master
}