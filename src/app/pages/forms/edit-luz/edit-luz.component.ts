import { Component, OnInit, Inject } from '@angular/core';
import { LuzService } from '@app/services/luz.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-edit-luz',
  templateUrl: './edit-luz.component.html',
  styleUrls: ['./edit-luz.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditluzComponent extends Dialog implements OnInit {

  luz: [];
  luzForm: FormGroup;
  submitted = false;
  token;

  constructor(
    private luzService: LuzService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditluzComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.luzForm = this.formBuilder.group({
      id_luz: [''],
      nombre_luz: ['', Validators.required],
      code_luz: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, obj } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;

    if (obj) {
      const { id_luz, nombre_luz, code_luz} = obj;

      this.luzForm.patchValue({ id_luz, nombre_luz, code_luz});
    }
  }

  get f() { return this.luzForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.luzForm.invalid) {
      return;
    } else {
      this.update();
    }
  }

  async update() {
    try {
      
      let response;
      response = await this.luzService.update(this.luzForm.value, this.auth.token).toPromise();
      if (response.code == 200) {
        //this.showAlert(this.alertSuccesText, true);
        this.closeModal();
        this.submitted = false;
        this.luzForm.reset({});
      }
    } catch (e) {
      
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
