import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LuzService } from '@app/services/luz.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { EditluzComponent  } from '@app/pages/forms/edit-luz/edit-luz.component';
import { ConfigusService } from '@app/services/configus.service';
import { MaquinaService } from '@app/services/maquina.service';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-sensorluz',
  templateUrl: './sensorluz.component.html',
  styleUrls: ['./sensorluz.component.scss']
})
export class SensorLuzComponent implements OnInit {

  lista= [];
  listaMaquina= [];
  lista2= [];
  graph: [];
  objfu= [];
  form: FormGroup;
  luzForm: FormGroup;
  maquinaForm: FormGroup;
  submitted = false;
  newColor = false;
  graf = false;
  status = "OFF";
  icon = "";
  token;
  chart;
  total;
  est;
  chartdiv = "chartdiv";
  button: Array<object> = [];
  MQTT: FormGroup;
  isCollapsed = false;
  minobj;
  minconfig;

  constructor(
    private luzService: LuzService,
    private spinner: NgxSpinnerService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog, 
    private configusService: ConfigusService,
    private maquinaService: MaquinaService,
  ) { }

  ngOnInit() {
    
    this.token = this.auth.token;
    this.form = this.formBuilder.group({
      id_luz: [''],
      nombre_luz: [''],
      estado_luz: [''],
      fecha_luz: [''],
      code_luz: [''],
    });

    this.luzForm = this.formBuilder.group({
      nombre_luz: ['', Validators.required],
      code_luz: ['', Validators.required],
    });

    this.maquinaForm = this.formBuilder.group({
      estado_maquina: ['', Validators.required],
      id_luz: [''],
    });

    this.MQTT = this.formBuilder.group({
      topic: [],
      message: [],
    });

   // this.grafica('','');

    this.getLuz('');

    this.est = setInterval(() => {
      this.getLuz('');
      //this.cdRef.detectChanges();
    }, 6000);
  }

/*   intervalTimer = interval(15000);
  this.intervalSubs = this.intervalTimer.subscribe(() => this.getDatosGrafica(false));
  unsubscribeInterval() {
    if (this.getLuz()) {
      this.getLuz.unsubscribe();
    }
  }*/

  ngOnDestroy() {
    if (this.est) {
      clearInterval(this.est);
    }
  }

  //CRUD LUZ

  async getLuz(searchValue: string) {
    try {
      let resp = await this.luzService.get(searchValue, this.token).toPromise();
      if (resp.code == 200) {
        this.lista = resp.response;
        this.total = this.lista.length;
      // console.log(this.lista)
      }
    } catch (e) {
    }
  }

  async P_ObjetosEnFuncion(estado) {
    try {
      let resp = await this.configusService.P_ObjetosEnFuncion(this.token).toPromise();
      if (resp.code == 200) {
        this.objfu = resp.response;
        var n1 =  Number(this.objfu[0].sum_m);
        var n2 =  Number(this.objfu[1].sum_m);
        this. minobj = n1 + n2;
        this.minobj= this.minobj + 1;
        this.getConfig(estado, this.minobj)
      }
    } catch (e) {
    }
  }

  async getConfig(estado, minobj) {
    try {
      let resp = await this.configusService.get('1', this.token).toPromise();
      if (resp.code == 200) {
        this.lista2 = resp.response;
        this.minconfig = this.lista2[0].min_config;
        if (this.lista2[0].grafica_config == 1) {
          this.graf = true;
        }else{
          this.graf = false;
        }
        if (this.lista2[0].alarma_config == 1) {
         // console.log('alarma activa')

          if (this.lista2[0].min_config < minobj) {
           // console.log('no manda mensaje')
            this.save(estado, this.lista2[0].vinculo_config);
          }
          else if (this.lista2[0].min_config == minobj) {
            Swal.fire('Hay ' + this.lista2[0].min_config + ' objetos encendidos')
            //console.log('manda mensaje')
            this.save(estado, this.lista2[0].vinculo_config);
          }
        }
          //console.log('se actualiza directamente')
        //console.log(this.lista)
        this.save(estado, this.lista2[0].vinculo_config);
      }
    } catch (e) {
    }
  }

  
  /*async getUsrAct() {
    try {
      let resp = await this.usuarioService.getUsuariosAct(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.usr = resp.response;
        this.usrSend = JSON.stringify(this.usr);
        this.usrSend = this.usrSend.split(/]|{|}|"|id|evento|nip|:|/g).join('');
        this.usrSend = this.usrSend.split("[").join('');
        this.usrSend = this.usrSend.split(",").join('?');
        this.SendUsuariosMQTT(this.usrSend)
        console.log(this.usrSend)
      }
    } catch (e) {
    }
  }*/
  async SendMQTTm(status, code) {
    if (status == 0) {
      this.status = "OFF"
    } else { this.status = "ON" }
    this.MQTT.value.topic = code;
    this.MQTT.value.message = this.status;
    //   console.log(this.MQTT.value)
    try {
      let resp = await this.maquinaService.MQTTEncoder(this.MQTT.value).toPromise();

    } catch (e) {
    }
  }

  async SendMQTT(status, code) {
    if(status == 0){
      this.status = "OFF"
    } else {this.status = "ON"}
    this.MQTT.value.topic = code;
    this.MQTT.value.message = this.status;
   //console.log(this.MQTT.value)
    try {
      let resp = await this.luzService.MQTTEncoder(this.MQTT.value).toPromise();

    } catch (e) {
    }
  }

  async save(estado, vinculo) {
    this.form.value.id_luz = estado.id_luz;
    this.form.value.nombre_luz = estado.nombre_luz;
    this.form.value.fecha_luz = estado.fecha_luz;
    this.form.value.code_luz = estado.code_luz;
    this.getMaquina(vinculo, estado.id_luz);
 //   console.log(this.form.value)
    this.SendMQTT(this.form.value.estado_luz, this.form.value.code_luz);
    try {
      let response; response = await this.luzService.update(this.form.value, this.token).toPromise();
      if (response.code == 200) {
        this.getLuz('');
        this.form.reset({});
      }
    } catch (e) {
    }
  }

  async getMaquina(vinculo, id) {
    console.log(vinculo, id)
    try {
      let resp = await this.maquinaService.get2(id, this.token).toPromise();
      if (resp.code == 200) {
        this.listaMaquina = resp.response;
        console.log(this.listaMaquina)
        var estadoluz = this.listaMaquina[0].estado_maquina;
        console.log(estadoluz)
        console.log(this.form.value.estado_luz)
        if (vinculo == 1) {
          console.log('vinculo encendido - entra a if')
          if (this.form.value.estado_luz == 1 && estadoluz == 1) {
            console.log('quiere apagar foco')
          }
          else if (this.form.value.estado_luz == 1 && estadoluz == 0) {
            console.log('foco apagado y pregunta para encender')
            this.updatemaquina(this.listaMaquina[0].codigo_maquina, id, 1)
          }
        }
        else {
           console.log('vinculo desactivado - no hace nada')
           }
      }
    } catch (e) {
    }
  }

  async updatemaquina(codigo, idluz, estado) {
    this.maquinaForm.value.id_luz = idluz;
    this.maquinaForm.value.estado_maquina = estado;
    console.log(this.maquinaForm.value)
    Swal.fire({
      title: '¿Desea encender la maquina(s) vinculada(s) a este foco?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'No!'
    }).then((result) => {
      if (result.value) {
        let response;
        console.log(this.maquinaForm.value)
        this.SendMQTTm(estado, codigo)
        response = this.maquinaService.update2(this.maquinaForm.value, this.token).toPromise();
        if (response.code == 200) {
          if(this.minconfig == this.minobj){
            Swal.fire('Hay más de dos objetos encendidos!');
          }
          //Swal.fire('No  ha encendido el foco!');
         // this.luzForm.reset({});
        } else {
          //Swal.fire('No se ha podido encender el foco!');
        }
      }
    });
  }

  //Cambio color boton

  toggleColor(estado) {
       if (estado.estado_luz == 0) {
         this.form.value.estado_luz = 1;
         this.P_ObjetosEnFuncion(estado);
       } else if (estado.estado_luz == 1) {
         this.form.value.estado_luz = 0;
         this.save(estado, '');
       }
     }


  async newLuz() {
    const dialogRef = this.dialog.open(EditluzComponent, {
      width: '25rem',
      data: {
        title: 'Crea Nuevo Objeto',
        btnText: 'Ingresar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "Fallo al agregar",
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getLuz('');
    });
  }

/*
  grafica(datos, chartdiv) {
    // Themes end
    
    // Create chart instance
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();
    
    // Add data
    chart.data = datos;
    
    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "code_sensorluz";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
  //  categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;
    
    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "estado_sensorluz";
    series.dataFields.categoryX = "code_sensorluz";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;
    
    series.tooltip.pointerOrientation = "vertical";
    
    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;
    
    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;
    
    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });
    
    // Cursor
    chart.cursor = new am4charts.XYCursor();
    
    setInterval(() => {
      this.P_EstadoYCodeX2();
    }, 2000);
  }*/

  /*
    async getProductos(searchValue: string) {
      try {
        let resp = await this.productoService.get(searchValue, this.auth.token).toPromise();
        if (resp.code == 200) {
          this.listaProductos = resp.response;
          this.total = this.listaProductos.length;
          console.log(this.listaProductos)
        }
      } catch (e) {
      }
    }*/
   
    get f() { return this.luzForm.controls; }
  
    onSubmit() {
      this.submitted = true;
      if (this.luzForm.invalid) {
        return;
      } else {
        this.new();
      }
    }
  
    async new() {
    //  console.log(this.luzForm.value)
      try {
        let response = await this.luzService.create(this.luzForm.value, this.auth.token).toPromise();
        if (response.code == 200) {
          Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
          this.getLuz('');
          this.submitted = false;
          this.luzForm.reset({});
        }
      } catch (error) {
        Swal.fire('Error', 'No fue posible guardar el registro!', 'error');
      }
    }

    update(obj) {
      const dialogRef = this.dialog.open(EditluzComponent , {
        width: '30rem',
        data: {
          title: 'Editar: ' + obj.nombre_luz,
          btnText: 'Guardar',
          alertSuccesText: obj.nombre_luz + ' modificado correctamente',
          alertErrorText: "No fue posible modificar " + obj.nombre_luz ,
          obj
        }
      });
  
      dialogRef.afterClosed().subscribe(data => {
        this.getLuz("");
      });
    }
  
  
    delete(obj) {
      Swal.fire({
        title: '¿Desea eliminar el registro?', text: "",
        type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
      }).then((result) => {
        if (result.value) {
          this.luzService.delete(obj.id_luz, this.auth.token).subscribe(res => {
            if (res.code == 200) {
              Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
              this.getLuz('');
            } else {
              Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
            }
          });
        }
      });
    }
  
    showSpinner() {
      const opt1: Spinner = {
        bdColor: "rgba(51,51,51,0.8)",
        size: "medium",
        color: "#fff",
        type: "square-jelly-box"
      };
      this.spinner.show("mySpinner", opt1);
    }

}