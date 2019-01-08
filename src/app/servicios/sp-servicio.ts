import { environment } from "src/environments/environment";
import { default as pnp } from 'sp-pnp-js';
import { Injectable } from "@angular/core";
import { from } from 'rxjs';

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
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSIsImtpZCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZW5vdmVsc29sdWNpb25lcy5zaGFyZXBvaW50LmNvbUA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwiaWF0IjoxNTQ2NTQ2Mjk1LCJuYmYiOjE1NDY1NDYyOTUsImV4cCI6MTU0NjU3NTM5NSwiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEA5MjAwNDBiMy1jMjIwLTQ4YTItYTczZi0xMTc3ZmEyYzA5OGUiLCJuYW1laWQiOiI2NTQ4ZDEyMS1jMDUxLTQ3YTEtYWYyYi1lZmRlYzVmOTllNGNAOTIwMDQwYjMtYzIyMC00OGEyLWE3M2YtMTE3N2ZhMmMwOThlIiwib2lkIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3Iiwic3ViIjoiOGY4NjgwNDUtN2VlZS00Mzc0LWEyZjEtMzA3OTIzODcwYWM3IiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.Q_1piEgd-eUvFeyvedPvPOq4kooJ0YCZPd8hpLmxmWbUnBuxyCRtfj2hdEEpOJADpjq1rY5tjqlnFGLSJH6K0sAVEc4RbOERH7IWeazRco1tkgMlb4tKcARc-55tup1yOBICP8mAWlJGh9u7Fc-Cug_ePTCiYYkOztWGAzXOXcuF6QION6MJnmDhMa3GK-0CjnQ3PzQitdo8BoX_i7sQKVA9c64cWNzJcOLnNEv8Jueuf5FfStsY8CzXl6mJ2-TOm-iIqd9Xzq-muD9JRuPHaEaVYw9o1T0jGQ3m4XZXGbOkNk1vUZkxMwHBeO4NSlKmE-d_oHOfv8ABFHCMIrw43A'
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
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSubcategorias).items.filter("CategoriaId eq " + idCategoria).get());
        return respuesta;
    }

    ObtenerCondicionesContractuales(){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCondicionesContractuales).items.getAll());
        return respuesta;
    }
}