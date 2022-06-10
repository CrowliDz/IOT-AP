import { Component, OnInit } from '@angular/core';
import { MaquinaService } from '@app/services/maquina.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LuzService } from '@app/services/luz.service';
import { EditMaquinaComponent } from '@app/pages/forms/edit-maquina/edit-maquina.component';
import { ConfigusService } from '@app/services/configus.service';

@Component({
  selector: 'app-maquina',
  templateUrl: './maquina.component.html',
  styleUrls: ['./maquina.component.scss']
})
export class MaquinaComponent implements OnInit {

  lista: [];
  listaLuz= [];
  form: FormGroup;
  maquinaForm: FormGroup;
  luzForm: FormGroup;
  submitted = false;
  newColor = false;
  status = "OFF";
  icon = "";
  token;
  chart;
  total;
  est;
  button: Array<object> = [];
  MQTT: FormGroup;
  isCollapsed = false;
  minobj;
  minconfig;

  objfu = [];
  lista2 = [];

  constructor(
    private maquinaService: MaquinaService,
    private spinner: NgxSpinnerService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private luzService: LuzService,
    private configusService: ConfigusService,
  ) { }

  ngOnInit() {
    this.token = this.auth.token;
    this.form = this.formBuilder.group({
      id_maquina: [''],
      nombre_maquina: [''],
      estado_maquina: [''],
      fecha_maquina: [''],
      codigo_maquina: [''],
      id_luz: [''],
    });

    this.maquinaForm = this.formBuilder.group({
      nombre_maquina: ['', Validators.required],
      codigo_maquina: ['', Validators.required],
      id_luz: [''],
    });

    this.luzForm = this.formBuilder.group({
      estado_luz: ['', Validators.required],
      id_luz: [''],
    });

    this.MQTT = this.formBuilder.group({
      topic: [],
      message: [],
    });

    this.getMaquina('');
    this.getLuz('','');

    this.est = setInterval(() => {
      this.getMaquina('');
    }, 6000);

  }

  ngOnDestroy() {
    if (this.est) {
      clearInterval(this.est);
    }
  }

  //CRUD LUZ

  async getMaquina(searchValue: string) {
    try {
      let resp = await this.maquinaService.get(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.lista = resp.response;
        this.total = this.lista.length;
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

  async SendMQTT(status, code) {
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

  async SendMQTTl(status, code) {
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
    this.form.value.id_maquina = estado.id_maquina;
    this.form.value.nombre_maquina = estado.nombre_maquina;
    this.form.value.fecha_maquina = estado.fecha_maquina;
    this.form.value.codigo_maquina = estado.codigo_maquina;
    this.form.value.id_luz = estado.id_luz;
    this.getLuz(vinculo, estado.id_luz);
    this.SendMQTT(this.form.value.estado_maquina, this.form.value.codigo_maquina);
    try {
      let response; response = await this.maquinaService.update(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        this.getMaquina('');
        //this.form.reset({});
      }
    } catch (e) {
    }
    //   console.log(this.form.value)
  }

  async getLuz(vinculo, id) {
    try {
      let resp = await this.luzService.get(id, this.token).toPromise();
      if (resp.code == 200) {
        this.listaLuz = resp.response;
        var estadoluz = this.listaLuz[0].estado_luz
        if (vinculo == 1) {
          //console.log('vinculo encendido - entra a if')
          if (this.form.value.estado_maquina == 1 && estadoluz == 1) {
            //console.log('quiere apagar foco')
          }
          else if (this.form.value.estado_maquina == 1 && estadoluz == 0) {
            //console.log('foco apagado y pregunta para encender')
            this.updateluz(this.listaLuz[0].code_luz, id, 1)
          }
        }
        else {
          // console.log('vinculo desactivado - no hace nada')
           }
      }
    } catch (e) {
    }
  }

  async updateluz(codigo, idluz, estado) {
    this.luzForm.value.id_luz = idluz;
    this.luzForm.value.estado_luz = estado;
    Swal.fire({
      title: '¿Desea encender el foco vinculado a esta maquina?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'No!'
    }).then((result) => {
      if (result.value) {
        let response;
        this.SendMQTTl(estado, codigo);
        response = this.luzService.update(this.luzForm.value, this.token).toPromise();
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


  update(obj) {
    const dialogRef = this.dialog.open(EditMaquinaComponent, {
      width: '50rem',
      data: {
        title: 'Editar: ' + obj.nombre_maquina,
        btnText: 'Guardar',
        alertSuccesText: obj.nombre_maquina + ' modificado correctamente',
        alertErrorText: "No fue posible modificar " + obj.nombre_maquina,
        obj
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getLuz("","");
    });
  }

  //Cambio color boton

  toggleColor(estado) {
    // console.log('llega' + estado)
    //this.newColor = !this.newColor;
    if (estado.estado_maquina == 0) {
      // console.log("llega como 0 y cambia a 1")
      this.form.value.estado_maquina = 1;
      //  console.log(this.form.value)
      this.P_ObjetosEnFuncion(estado);
    } else if (estado.estado_maquina == 1) {
      // console.log("llega como 1 y cambia a 0")
      this.form.value.estado_maquina = 0;
      // console.log(this.form.value)
      this.save(estado, '');
      //this.formt();
    }
  }

  get f() { return this.maquinaForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.maquinaForm.invalid) {
      return;
    } else {
      this.new();
    }
  }

  async new() {
    //  console.log(this.maquinaForm.value)
    try {
      let response = await this.maquinaService.create(this.maquinaForm.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.getMaquina('');
        this.submitted = false;
        this.maquinaForm.reset({});
      }
    } catch (error) {
      Swal.fire('Error', 'No fue posible guardar el registro!', 'error');
    }
  }


  delete(obj) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.maquinaService.delete(obj.id_maquina, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getMaquina('');
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