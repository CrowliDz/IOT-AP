import { Component, OnInit, Inject } from '@angular/core';
import { LuzService } from '@app/services/luz.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-nuevo-luz',
  templateUrl: './nuevo-luz.component.html',
  styleUrls: ['./nuevo-luz.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoluzComponent extends Dialog implements OnInit {

  luz: [];
  luzForm: FormGroup;
  submitted = false;
  token;

  constructor(
    private luzService: LuzService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoluzComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.luzForm = this.formBuilder.group({
      nombre_luz: ['', Validators.required],
      code_luz: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText,luz } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;

    if (luz) {
      const { nombre_luz, code_luz} = luz;

      this.luzForm.patchValue({ nombre_luz, code_luz});
    }
  }

  get f() { return this.luzForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.luzForm.invalid) {
      return;
    } else {
      this.guardar();
    }
  }

  async guardar() {
    try {
      
      let response = await this.luzService.create(this.luzForm.value, this.auth.token).toPromise();
      if (response.code == 200) {
        this.showAlert(this.alertSuccesText, true);
        this.closeModal();
        this.submitted = false;
        this.luzForm.reset({});
        console.log(this.luzForm.value)
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
