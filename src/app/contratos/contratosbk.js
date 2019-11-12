//Con adjunto
this.servicio.GuardarContrato(ObjContrato).then(
          async (item: ItemAddResult) => {
            this.Guardado = true;
            let idContrato = item.data.Id;
            if (this.BienesSeleccionados.length > 0) {
              let respuesta = await this.ActualizarBienes(idContrato.toString());
            }  
            if (this.ServiciosSeleccionados.length > 0) {
              let respuesta = await this.ActualizarServicios(idContrato.toString());
            }
            let cantidadBienes = this.ObjCondicionesTecnicas.filter(x=> x.idContrato === "" || x.idContrato === null).length;
            let cantidadServicios = this.ObjCondicionesTecnicasServicios.filter(x=> x.idContrato === "" || x.idContrato === null).length;
            if (cantidadBienes === 0 && cantidadServicios === 0) {
                this.servicio.cambioEstadoSolicitud(this.IdSolicitud, "Formalizar firmas contrato", bpoPais).then(
                  (resultado) => {
                    this.servicio.actualizarFechaContratos(this.IdSolicitud, ContratoOC).then(
                      () => {
                        let idContrato = item.data.Id;
                        let nombreArchivo = "AdjuntoContrato-" + this.generarllaveSoporte() + "_" + this.adjunto.name;
                        this.servicio.agregarAdjuntoContratos(idContrato, nombreArchivo, this.adjunto).then(respuesta => {
                          let notificacion = {
                            IdSolicitud: this.IdSolicitud.toString(),
                            ResponsableId: bpoPais,
                            Estado: 'Formalizar firmas contrato'
                          }
                          this.servicio.agregarNotificacion(notificacion).then(
                            (item: ItemAddResult) => {
                              this.MostrarExitoso(`Se adjuntó el archivo ${this.adjunto.name}`)
                              setTimeout(() => {
                                this.MostrarExitoso("El contrato se ha guardado correctamente");
                              this.spinner.hide();
                              }, 2000);
                              setTimeout(() => {
                                this.router.navigate(["/mis-pendientes"]);
                              }, 2000);
                            }, err => {
                              this.mostrarError('Error agregando la notificación');
                              this.spinner.hide();
                            }
                          )
                        })
                      },
                      (error) => {
                        console.error(error);
                      }
                    )
                  }
                ).catch(
                  (error) => {
                    console.log(error);
                    this.spinner.hide();
                  }
                );
            }else{
              this.servicio.actualizarFechaContratos(this.IdSolicitud, ContratoOC).then(
                () => {
                  let idContrato = item.data.Id;
                  let nombreArchivo = "AdjuntoContrato-" + this.generarllaveSoporte() + "_" + this.adjunto.name;
                  this.servicio.agregarAdjuntoContratos(idContrato, nombreArchivo, this.adjunto).then(respuesta => {
                    let notificacion = {
                      IdSolicitud: this.IdSolicitud.toString(),
                      ResponsableId: bpoPais,
                      Estado: 'Formalizar firmas contrato'
                    }
                    this.servicio.agregarNotificacion(notificacion).then(
                      (item: ItemAddResult) => {
                        this.MostrarExitoso(`Se adjuntó el archivo ${this.adjunto.name}`)
                        setTimeout(() => {
                          this.MostrarExitoso("El contrato se ha guardado correctamente");
                        this.spinner.hide();
                        }, 2000);
                        setTimeout(() => {
                          this.router.navigate(["/mis-pendientes"]);
                        }, 2000);
                      }, err => {
                        this.mostrarError('Error agregando la notificación');
                        this.spinner.hide();
                      }
                    )
                  })
                },
                (error) => {
                  console.error(error);
                }
              )
            }         
            
          }
        ).catch(
          (error) => {
            console.log(error);
            this.spinner.hide();
          });



//Sin Adjunto
this.servicio.GuardarContrato(ObjContrato).then(
        (item: ItemAddResult) => {
          this.Guardado = true;
          let idContrato = item.data.Id;
            if (this.BienesSeleccionados.length > 0) {
              this.ActualizarBienes(idContrato.toString());
            }  
            if (this.ServiciosSeleccionados.length > 0) {
              this.ActualizarServicios(idContrato.toString());
            }
            let cantidadBienes = this.ObjCondicionesTecnicas.filter(x=> x.idContrato === "" || x.idContrato === null).length;
            let cantidadServicios = this.ObjCondicionesTecnicasServicios.filter(x=> x.idContrato === "" || x.idContrato === null).length;
            if (cantidadBienes === 0 && cantidadServicios === 0) {
                this.servicio.cambioEstadoSolicitud(this.IdSolicitud, "Formalizar firmas contrato", bpoPais).then(
                    (resultado) => {
                      this.servicio.actualizarFechaContratos(this.IdSolicitud, ContratoOC).then(
                        () => {
                          let notificacion = {
                            IdSolicitud: this.IdSolicitud.toString(),
                            ResponsableId: bpoPais,
                            Estado: 'Formalizar firmas contrato'
                          }
                          this.servicio.agregarNotificacion(notificacion).then(
                            (item: ItemAddResult) => {
                              this.MostrarExitoso("El contrato se ha guardado correctamente sin archivos adjuntos");
                              this.spinner.hide();
                              setTimeout(() => {
                                this.router.navigate(["/mis-pendientes"]);
                              }, 1000);
                            }, err => {
                              this.mostrarError('Error agregando la notificación');
                              this.spinner.hide();
                            }
                          )
                        },
                        (error) => {
                          console.error(error);
                        }
                      )
                    }
                  ).catch(
                    (error) => {
                      console.log(error);
                      this.spinner.hide();
                    }
                  );
            }
            else{
              this.servicio.actualizarFechaContratos(this.IdSolicitud, ContratoOC).then(
                () => {
                  let notificacion = {
                    IdSolicitud: this.IdSolicitud.toString(),
                    ResponsableId: bpoPais,
                    Estado: 'Formalizar firmas contrato'
                  }
                  this.servicio.agregarNotificacion(notificacion).then(
                    (item: ItemAddResult) => {
                      this.MostrarExitoso("El contrato se ha guardado correctamente sin archivos adjuntos");
                      this.spinner.hide();
                      setTimeout(() => {
                        this.router.navigate(["/mis-pendientes"]);
                      }, 1000);
                    }, err => {
                      this.mostrarError('Error agregando la notificación');
                      this.spinner.hide();
                    }
                  )
                },
                (error) => {
                  console.error(error);
                }
              )
            }
          
        }
      ).catch(
        (error) => {
          console.log(error);
          this.spinner.hide();
        });