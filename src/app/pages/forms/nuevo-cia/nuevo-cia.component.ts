import { Component, OnInit } from '@angular/core';
import { CiaService } from '@app/services/cia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cia } from '@app/models/cia';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as environment from '../../../../environments/environment';

@Component({
  selector: 'app-nuevo-cia',
  templateUrl: './nuevo-cia.component.html',
  styleUrls: ['./nuevo-cia.component.css']
})
export class NuevoCiaComponent implements OnInit {

  cia: Cia = new Cia();
  ciaForm: FormGroup;
  submitted = false;
  formData: FormData;
  urlImg: string;
  token;
  idcia;
  public previsualizacion: string;
  private url2: string = environment.environment.urlEndPoint;
  public archivos: any = [];
  public loading: boolean;
  public fileToUpload: File = null;
  public imageSelected: string;
  public imagePath;
  public imgURL: any = '../../../assets/img/noimage.jpg';

  constructor(private ciaService: CiaService, private formBuilder: FormBuilder,
    private router: Router, private auth: AuthService, private sanitizer: DomSanitizer,
   ) { }

  ngOnInit() {
    //this.cia.logotipo = new FormData();
    this.formData = new FormData();
    this.token = this.auth.token;
    this.getCia();
    this.ciaForm = this.formBuilder.group({
      idcia: [],
      razon: ['', Validators.required],
      nombre: ['', Validators.required],
      rfc: ['', Validators.required],
      calle: ['', Validators.required],
      numero: ['', Validators.required],
      colonia: ['', Validators.required],
      ciudad: ['', Validators.required],
      pais: ['', Validators.required],
      cp: ['', Validators.required],
      image: [''],
      eslogan: ['', Validators.nullValidator]
    });
  }

  async getCia() {
    try {
      const response = await this.ciaService.readCia(this.idcia, this.token).toPromise();
      if (response.code = 200) {
        this.cia = response.cia;
        this.imgURL = this.url2 + '/cia/get-image/' + this.cia.image
      }
    } catch (e) {
      Swal.fire('Error', 'No se pudo obtener la empresa', 'error');
    }
  }

  get f() { return this.ciaForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.ciaForm.invalid) {
      return;
    } else {
      this.guardar();
    }
  }

  async guardar() {
    this.ciaForm.value.idcia = this.idcia;

    try {
      let response = await this.ciaService.update(this.ciaForm.value, this.token).toPromise();
      if (response.code == 200) {
        if (this.fileToUpload) {
          this.ciaService.uploadImage(this.idcia, this.fileToUpload, this.token).then((img: any) => {
            this.cia.image = img.image;
            this.fileToUpload = null;
            return;
          }).catch(error => {
            Swal.fire('Error', 'No fue posible modificar la empresa', 'error');
          })
        }
        Swal.fire('', 'Registro modificado', 'success');
        //this.router.navigate(['/home']);
      }
      else {
        Swal.fire('Error', 'No fue posible modificar la empresa', 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'No fue posible modificar la empresa', 'error');
    }
  }


  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files.length > 0) {
      this.fileToUpload = fileInput.target.files[0];
      this.imageSelected = this.fileToUpload.name;
    } else {
      fileInput = null;
      this.imageSelected = '';
    }
    if (fileInput.target.files.length === 0) {
      this.fileToUpload = null;
      return;
    }
    const mimeType = this.fileToUpload.type;
    if (mimeType.match(/image\/*/) == null) {
      this.imageSelected = 'Solo puedes seleccionar imagenes .jpg';
      this.fileToUpload = null;
      return;
    }
    const reader = new FileReader();
    this.imagePath = this.fileToUpload;
    reader.readAsDataURL(this.fileToUpload);
    // tslint:disable-next-line: variable-name
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

}
