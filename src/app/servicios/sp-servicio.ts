import { environment } from "src/environments/environment";
import { default as pnp, Web } from 'sp-pnp-js';
import { Injectable } from "@angular/core";
import { from } from 'rxjs';
import { Solicitud } from "../dominio/solicitud";
import { CondicionTecnicaBienes } from "../dominio/condicionTecnicaBienes";
import { CondicionTecnicaServicios } from "../dominio/condicionTecnicaServicios";

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
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSIsImtpZCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZW5vdmVsc29sdWNpb25lcy5zaGFyZXBvaW50LmNvbUA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwiaWF0IjoxNTQ3MTc1NjMzLCJuYmYiOjE1NDcxNzU2MzMsImV4cCI6MTU0NzIwNDczMywiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJuYW1laWQiOiI2NTQ4ZDEyMS1jMDUxLTQ3YTEtYWYyYi1lZmRlYzVmOTllNGNAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwib2lkIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3Iiwic3ViIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3IiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.iOQXFcr5KFuTOv81IZASfLrajR0_JGLw8VRHvxbHwhii11GLUjWTezzmUJbTOqj-CdC2MFKoO25EkNC0sYp_6ZHddDQGwKHlrQvNDkmlmPMUcVLgqa23NnJ3pVdqNBsSD20CMKb3fbXBSDsBZc8uF0vHDsIgvg8BeqZoTpmZTT3uzOXGDqgSz_5tJW_n8cQsgJKprRfPDi_jlr1cy5MlhlbEkU8egCqLzNVzLw8wYCIuXPvR7EdSrbTwIZfBNeJpG_3HVF2Ankz1yjCNvsdJvxP7R26N2SjDafpI-TJHxnG3HJa7bhiRFUFzV_sQ0CCEV_ep84cDMkRuj4HXF2dmQQ'
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

    ObtenerSolicitudBienesServicios() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle("Solicitudes").items.getById(1).select("FechaDeseadaEntrega", "Solicitante", "OrdenadorGasto", "Empresa/Title", "Pais/Title", "Categoria", "Subcategoria", "Comprador", "Alcance", "Justificacion", "CondicionesContractuales").expand("Empresa", "Pais").get());
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
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSubcategorias).items.select("ID", "Title", "Categoria/Title", "Categoria/ID", "Comprador/Title", "Comprador/ID", "Pais/Title", "Pais/ID", "CondicionesTecnicas/Title", "CondicionesTecnicas/ID").expand("Categoria", "Comprador", "CondicionesTecnicas", "Pais").filter("CategoriaId eq " + idCategoria + "and PaisId eq " + idPais).get());
        return respuesta;
    }


    obtenerMisSolicitudes(usuarioId: number) {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.select("ID", "Title", "TipoSolicitud", "Solicitante", "Empresa/Title", "OrdenadorGastos/Title", "Pais/ID", "Pais/Title", "Empresa/Title", "Empresa/ID", "Comprador", "Categoria", "Subcategoria", "CM", "CondicionesContractuales", "Alcance", "Justificacion", "FechaDeseadaEntrega", "Estado", "Author/Title", "Author/ID", "Created").expand("Empresa", "Pais", "OrdenadorGastos", "Author").filter("AuthorId eq " + usuarioId + " ").get());
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
            Comprador: solicitud.comprador,
            FechaDeseadaEntrega: solicitud.fechaEntregaDeseada,
            Alcance: solicitud.alcance,
            Justificacion: solicitud.justificacion,
            CondicionesContractuales: solicitud.condicionesContractuales,
            ResponsableId: solicitud.responsable,
            Estado: solicitud.estado
        });
    }

    agregarCondicionesTecnicasBienes(condicionTecnicaBienes: CondicionTecnicaBienes) {
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.add({
            Title: condicionTecnicaBienes.titulo,
            SolicitudId: condicionTecnicaBienes.idSolicitud,
            Codigo: condicionTecnicaBienes.codigo,
            Descripcion: condicionTecnicaBienes.descripcion,
            Modelo: condicionTecnicaBienes.modelo,
            Fabricante: condicionTecnicaBienes.fabricante,
            Cantidad: condicionTecnicaBienes.cantidad,
            ValorEstimado: condicionTecnicaBienes.valorEstimado,
            Comentarios: condicionTecnicaBienes.comentarios
        });
    }

    agregarAdjuntoCondicionesTecnicasBienes(idSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idSolicitud);
        item.attachmentFiles.add("solp-" + Date.now() + "-" + nombreArchivo, archivo);
    }

    agregarCondicionesTecnicasServicios(condicionTecnicaServicios: CondicionTecnicaServicios) {
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.add({
            Title: condicionTecnicaServicios.titulo,
            SolicitudId: condicionTecnicaServicios.idSolicitud,
            Codigo: condicionTecnicaServicios.codigo,
            Descripcion: condicionTecnicaServicios.descripcion,
            Cantidad: condicionTecnicaServicios.cantidad,
            ValorEstimado: condicionTecnicaServicios.valorEstimado,
            Comentario: condicionTecnicaServicios.comentarios
        });
    }

    agregarAdjuntoCondicionesTecnicasServicios(idSolicitud: number, nombreArchivo: string, archivo: File) {
        let item = this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idSolicitud);
        item.attachmentFiles.add("solp-" + Date.now() + "-" + nombreArchivo, archivo);
    }

    obtenerParametrosConfiguracion(){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaConfiguracion).items.filter("Title eq 'Configuración'").get());
        return respuesta;
    }

    ObtenerUsuarioPorEmail(email : string){
        let respuesta = from(this.obtenerConfiguracion().web.siteUsers.getByEmail(email).get());
        return respuesta;
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
            Comprador: solicitud.comprador,
            FechaDeseadaEntrega: solicitud.fechaEntregaDeseada,
            Alcance: solicitud.alcance,
            Justificacion: solicitud.justificacion,
            CondicionesContractuales: solicitud.condicionesContractuales,
            ResponsableId: solicitud.responsable,
            CompraBienes: solicitud.compraBienes,
            CompraServicios: solicitud.compraServicios,
            Estado: solicitud.estado
        });
    }

    actualizarCondicionesTecnicasBienes(idCondicionTecnicaBienes: number, condicionTecnicaBienes: CondicionTecnicaBienes){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicionTecnicaBienes).update({
            Title: condicionTecnicaBienes.titulo,
            SolicitudId: condicionTecnicaBienes.idSolicitud,
            Codigo: condicionTecnicaBienes.codigo,
            Descripcion: condicionTecnicaBienes.descripcion,
            Modelo: condicionTecnicaBienes.modelo,
            Fabricante: condicionTecnicaBienes.fabricante,
            Cantidad: condicionTecnicaBienes.cantidad,
            ValorEstimado: condicionTecnicaBienes.valorEstimado,
            Comentarios: condicionTecnicaBienes.comentarios
        });
    }

    borrarCondicionTecnicaBienes(idCondicionTecnicaBienes: number){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasBienes).items.getById(idCondicionTecnicaBienes).delete();
    }

    actualizarCondicionesTecnicasServicios(idCondicionTecnicaServicios: number, condicionTecnicaServicios: CondicionTecnicaServicios){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicionTecnicaServicios).update({
            Title: condicionTecnicaServicios.titulo,
            SolicitudId: condicionTecnicaServicios.idSolicitud,
            Codigo: condicionTecnicaServicios.codigo,
            Descripcion: condicionTecnicaServicios.descripcion,
            Cantidad: condicionTecnicaServicios.cantidad,
            ValorEstimado: condicionTecnicaServicios.valorEstimado,
            Comentario: condicionTecnicaServicios.comentarios
        });
    }

    borrarCondicionTecnicaServicios(idCondicionTecnicaServicios: number){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaCondicionesTecnicasServicios).items.getById(idCondicionTecnicaServicios).delete();
    }

    obtenerdatosProfile(){
        let respuesta = from(this.obtenerConfiguracion().profiles.myProperties.get());
        return respuesta;
    }
}