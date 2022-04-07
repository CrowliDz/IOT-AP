import { Component, OnInit, Inject } from '@angular/core';
import { MaquinaService } from '@app/services/maquina.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { LuzService } from '@app/services/luz.service';

@Component({
  selector: 'app-edit-maquina',
  templateUrl: './edit-maquina.component.html',
  styleUrls: ['./edit-maquina.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditMaquinaComponent extends Dialog implements OnInit {

  maquina: [];
  listaLuz: [];
  maquinaForm: FormGroup;
  submitted = false;
  token;

  constructor(
    private maquinaService: MaquinaService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditMaquinaComponent>,
    private auth: AuthService,
    private luzService: LuzService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.maquinaForm = this.formBuilder.group({
      id_maquina: [''],
      nombre_maquina: ['', Validators.required],
      codigo_maquina: ['', Validators.required],
      id_luz: [''],
    });
    
    this.token = this.auth.token;
    this.getLuz('');
    this.loadModalTexts();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, obj } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    console.log(obj)
    if (obj) {
      const { id_maquina, nombre_maquina, codigo_maquina, id_luz} = obj;

      this.maquinaForm.patchValue({ id_maquina, nombre_maquina, codigo_maquina, id_luz});
    }
  }

  async getLuz(searchValue: string) {
    try {
      let resp = await this.luzService.get(searchValue, this.token).toPromise();
      if (resp.code == 200) {
        this.listaLuz = resp.response;
      }
    } catch (e) {
    }
  }

  get f() { return this.maquinaForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.maquinaForm.invalid) {
      return;
    } else {
      this.update();
    }
  }

  async update() {
    try {
      
      let response;
      response = await this.maquinaService.update(this.maquinaForm.value, this.auth.token).toPromise();
      if (response.code == 200) {
        //this.showAlert(this.alertSuccesText, true);
        this.closeModal();
        this.submitted = false;
        this.maquinaForm.reset({});
      }
    } catch (e) {
      
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
