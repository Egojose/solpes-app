import { environment } from "src/environments/environment";
import { default as pnp } from 'sp-pnp-js';
import { Injectable } from "@angular/core";
import { from } from 'rxjs';
import { Solicitud } from "../dominio/solicitud";

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
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSIsImtpZCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZW5vdmVsc29sdWNpb25lcy5zaGFyZXBvaW50LmNvbUA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwiaWF0IjoxNTQ3MTQ4MDIzLCJuYmYiOjE1NDcxNDgwMjMsImV4cCI6MTU0NzE3NzEyMywiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJuYW1laWQiOiI2NTQ4ZDEyMS1jMDUxLTQ3YTEtYWYyYi1lZmRlYzVmOTllNGNAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwib2lkIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3Iiwic3ViIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3IiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.bsIQ7IS94333YeydD04T61iRawCG-ldn9Mzw5OF0g0cHHNJ-qDxl1jGHHTW-sbbC6HGjNm139XRavbYOJaxDce0GZ-nINmSsdgwn6NPltlCSB0SbSIV8sIJXPWG9sG8BeSb3BB8X5gX4fBylLOl-MNJYqosy5ZQnPyTm9nstvmCk6akFmMEyCuXoska2tViPnAq8NwYIrXCymHrcMig8IaQ5hibuOo-wokNSVS5f49c8pZ950B9ghiSp-NAxetjVJ8jfnwjtDGMZWUkQAfUTxDECKq3ZthNToP8ambQJrDpyde2-v8Lay_b4e3l1iKrciPGZd_SDE68F7ucNm-aDdA'
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    ObtenerUsuarioActual() {
        let respuesta = from(this.obtenerConfiguracion().web.currentUser.get());
        return respuesta;
    }

    ObtenerTodosLosUsuarios(){
        let respuesta = from(this.obtenerConfiguracion().web.siteUsers.get());
        return respuesta;
    }

    ObtenerSolicitudBienesServicios(){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle("Solicitudes").items.getById(1).select("FechaDeseadaEntrega","Solicitante","OrdenadorGasto","Empresa/Title","Pais/Title","Categoria","Subcategoria","Comprador","Alcance","Justificacion","CondicionesContractuales").expand("Empresa","Pais").get());
        return respuesta;
    }

    ObtenerTiposSolicitud(){
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

    ObtenerSubcategorias(idCategoria: number) {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSubcategorias).items.select("ID", "Title", "Categoria/Title", "Categoria/ID", "Comprador/Title", "Comprador/ID", "CondicionesTecnicas/Title", "CondicionesTecnicas/ID").expand("Categoria", "Comprador", "CondicionesTecnicas").filter("CategoriaId eq " + idCategoria).get());
        return respuesta;
    }

    obtenerMisSolicitudes(usuarioId: number) {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSolicitudes).items.select("ID", "Title", "TipoSolicitud", "Solicitante", "Empresa/Title", "OrdenadorGastos/Title", "Pais/ID", "Pais/Title", "Empresa/Title", "Empresa/ID", "Comprador", "Categoria", "Subcategoria", "CM", "CondicionesContractuales", "Alcance", "Justificacion", "FechaDeseadaEntrega", "Estado", "Author/Title", "Author/ID", "Created").expand("Empresa", "Pais", "OrdenadorGastos", "Author").filter("AuthorId eq " + usuarioId + " ").get());
        return respuesta;
    }

    agregarSolicitud(solicitud: Solicitud){
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

}