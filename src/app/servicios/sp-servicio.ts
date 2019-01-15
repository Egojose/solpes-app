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
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSIsImtpZCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZW5vdmVsc29sdWNpb25lcy5zaGFyZXBvaW50LmNvbUA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwiaWF0IjoxNTQ3NTU4NDA2LCJuYmYiOjE1NDc1NTg0MDYsImV4cCI6MTU0NzU4NzUwNiwiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJuYW1laWQiOiI2NTQ4ZDEyMS1jMDUxLTQ3YTEtYWYyYi1lZmRlYzVmOTllNGNAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwib2lkIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3Iiwic3ViIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3IiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.KP_f97FoGlcat3JC7CjvEJ-Omq0TJJqid1rxH1LbB_c5axYxRLcG3K7wfJq2WBMtwGh8T3UhBhjZoP5XO2B2_9FW0oJwHC_nMFTesYudEZrILBTMZTkeQ-ypX2cnQUoC3fLwT2_P_XIll5Ln9v9Khud5bbH0L8tJuYGUjQfrD7LdBM6wdvr_EZ7CaJ8XbIXzZLolEcrSUpnMcUNYVczsv0lQ7iBCcWY8UEU6I-KOlkmJng9sezWsYD-7zLaGxwM3VWlw9ipm62Y15wEtYkyFzu7n86oCWbCLGpIgXTRQuhv8vFKMN4alxkem_PgcoGrKTI_37kuYdqP64czajI_hfA'
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
            CondicionesContractuales: solicitud.condicionesContractuales
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
            ClaseSIA: condicionTecnicaBienes.claseSia,
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
}