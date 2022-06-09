import { Component, OnInit, Inject } from '@angular/core';
import { ConfigusService } from '@app/services/configus.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { Config } from '@app/models/config';
import { valueToRelative } from '@amcharts/amcharts4/.internal/core/utils/Utils';

@Component({
  selector: 'app-config-us',
  templateUrl: './config-us.component.html',
  styleUrls: ['./config-us.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigUsComponent extends Dialog implements OnInit {
  config: Config = new Config();
 // config: [];
  form: FormGroup;
  submitted = false;
  token;

  constructor(
    private configusService: ConfigusService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ConfigUsComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id_config: [],
      alarma_config: ['', Validators.required],
      min_config: ['', Validators.required],
      grafica_config: ['', Validators.required],
      vinculo_config: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
  }

  async get(searchValue: string) {
    try {
      let resp = await this.configusService.get('1', this.token).toPromise();
      if (resp.code == 200) {
        this.config = resp.response;
      console.log(this.config)
      }
    } catch (e) {
    }
  }

  vinculo() {
    if (this.form.value.vinculo_config == 1) {
    } else {
      this.form.value.vinculo_config = 0;
    }
  }
  
  grafica() {
    if (this.form.value.alarma_config == 1) {
    } else {
      this.form.value.alarma_config = 0;
    }
  }

  alarma() {
    if (this.form.value.grafica_config == 1) {
    } else {
      this.form.value.grafica_config = 0;
    }
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, obj } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    console.log(obj)
    if (obj) {
      const { id_config, alarma_config, min_config, grafica_config, id_usuario, vinculo_config} = obj;

      this.form.patchValue({ id_config, alarma_config, min_config, grafica_config, id_usuario, vinculo_config});

  /*    this.form.value.id_config = id_config;
      this.form.value.alarma_config = alarma_config;
      this.form.value.min_config = min_config;
      this.form.value.grafica_config= grafica_config;*/
      console.log(this.form.value)
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.update();
    }
  }

  async update() {
    try {
      
      let response;
      response = await this.configusService.update(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        //this.showAlert(this.alertSuccesText, true);
        this.closeModal();
        this.submitted = false;
      }
    } catch (e) {
      
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
