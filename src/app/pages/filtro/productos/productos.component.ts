import { Component, OnInit } from '@angular/core';
import { ProductoService } from '@app/services/producto.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  listaProductos: [];
  form: FormGroup;
  total: number;
  totalMBP: number;
  totalVPL: number;
  listaUm: [];
  submitted = false;
  listaEmpresa: [];
  VPL: [];
  
  MBP: any [];
  MQTT: FormGroup;
  prod = [];
  prodSend: string;

  listNav = [
    { "name": "Producto", "router": "/producto" },
    { "name": "Subensamble", "router": "/subensamble" },
    { "name": "Materia Prima", "router": "/materiaPrima" }
  ]
  constructor(
    private productoService: ProductoService,
    private dialog: MatDialog, 
    private spinner: NgxSpinnerService,
    private auth: AuthService,
     private formBuilder: FormBuilder, 
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      producto: ['', Validators.required],
      desc_producto: ['', Validators.required],
      te_producto: ['', [Validators.required, Validators.min(1)]],
      um_producto: ['', Validators.required],
      intervalo_tm: ['', Validators.required],
      ciclo_producto: ['', Validators.required],
      idempresa: ['', Validators.required]
    });

    this.MQTT = this.formBuilder.group({
      topic: [],
      message: [],
    });

    this.getProductos('');
  }

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
  }

  async VerificaProd(producto) {
    try {
      let resp = await this.productoService.VerificaProdlinea(producto.idproducto, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.VPL = resp.response;
        this.totalVPL = this.VPL.length;
        console.log(this.VPL)
        console.log(this.totalVPL)
        if(this.totalVPL > 0){
          Swal.fire('Error', '¡Este producto no puede ser eliminado debido a que se encuentra vinculado a una línea de producción!', 'error');
          
        } else{
          this.delete(producto);
        }
      }
    } catch (e) {
    }
  }

/*
  async getprodAct(idmaquina,serialrmt) {
    try {
      let resp = await this.skumaquinaService.getProductosMaquina(idmaquina,this.auth.token).toPromise();
      if (resp.code == 200) {
        this.prod = resp.response;
        this.prodSend = JSON.stringify(this.prod);
        this.prodSend = this.prodSend.split(/]|{|}|"|id|producto|te_|intervalo_tm|ciclo_|:|/g).join('');
        this.prodSend = this.prodSend.split("[").join('');
        this.prodSend = this.prodSend.split(",").join('?');
        this.MQTT.value.topic = serialrmt;
        this.SendUsuariosMQTT(this.prodSend)
      }
    } catch (e) {
    }
  }

  async SendUsuariosMQTT(info) {
    this.MQTT.value.message =  'SKU:'+ info +'/Fin';
    try {
      let resp = await this.skumaquinaService.MQTTEncoder(this.MQTT.value).toPromise();
      
    } catch (e) {
    }
  }

  async MaquinaByProducto(idproducto) {
    try {
      let resp = await this.productoService.getMaquinaByProducto(idproducto, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.MBP = resp.response;
        this.totalMBP = this.MBP.length;
        if(this.totalMBP > 0){
          for(let i in this.MBP){
            this.MBP[i].idmaquina;
            this.MBP[i].serialrmt;
            this.getprodAct(this.MBP[i].idmaquina,this.MBP[i].serialrmt)
          }
        }
      }
    } catch (e) {

    }
  }*/

  onSearchChange(searchValue: string) {
    this.getProductos(searchValue);
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.save();
    }
  }

  async save() {
    try {
      let response = await this.productoService.create(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.getProductos('');
        this.submitted = false;
        this.form.reset({});
      }
    } catch (error) {
      Swal.fire('Error', 'No fue posible guardar el registro!', 'error');
    }
  }


  delete(producto) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.productoService.delete(producto.idproducto, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getProductos('');
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