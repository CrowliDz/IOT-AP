import { Component, OnInit, Inject } from '@angular/core';
import { DepartamentoService } from '@app/services/departamento.service';
import { CiaService } from '@app/services/cia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Departamento } from '@app/models/departamento';
import { Cia } from '@app/models/cia';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-nuevo-departamento',
  templateUrl: './nuevo-departamento.component.html',
  styleUrls: ['./nuevo-departamento.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoDepartamentoComponent extends Dialog implements OnInit {

  departamento: Departamento = new Departamento();
  departamentoForm: FormGroup;
  submitted = false;
  cias: Cia[];
  token;

  constructor(
    private ciaService: CiaService,
    private deptoService: DepartamentoService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoDepartamentoComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.departamentoForm = this.formBuilder.group({
      departamento: ['', Validators.required],
    });
    this.departamento.idcia = 1;
    // this.getCias();
    this.token = this.auth.token;
    this.loadModalTexts();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, depto } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if (depto) {
      const { iddep, departamento } = depto;
      this.departamento.departamento = departamento;
      this.departamento.iddep = iddep;
    }
  }

  get f() { return this.departamentoForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.departamentoForm.invalid) {
      return;
    } else {
      this.guardar();
    }
  }

  async guardar() {
    try {
      let response;
      switch (this.modalMode) {
        case 'create': response = await this.deptoService.create(this.departamento, this.token).toPromise();
          break;
        case 'edit': response = await this.deptoService.update(this.departamento, this.token).toPromise();
          break;
      }
      if (response.code = 200) {
        this.showAlert(this.alertSuccesText, true);
        this.closeModal();
      }
      else {
        this.showAlert(this.alertErrorText, false);
      }
    } catch (e) {
      this.showAlert(e.error.message, false);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
