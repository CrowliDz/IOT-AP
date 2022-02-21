//MATERIAL ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import localeEsMX from '@angular/common/locales/es-MX';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

//COMPONENTES ADICIONALES
import { HeaderComponent } from './components/header/header.component';
import { PieComponent } from './components/charts/pie/pie.component';
import { PaginationBarComponent } from './components/pagination-bar/pagination-bar.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { FilePickerComponent } from './components/file-picker/file-picker.component';
import { BarraComponent } from './components/charts/barra/barra.component';
import { TimeLineComponent } from './components/charts/time-line/time-line.component';
import { HeaderTableComponent } from './components/header-table/header-table.component';
import { DonutComponent } from './components/charts/donut/donut.component';
import { LayeredComponent } from './components/charts/layered/layered.component';
import { CardTitleComponent } from './components/card-title/card-title.component';
import { FilterByComponent } from './components/filter-by/filter-by.component';
import { DialogComponent } from './components/dialog/dialog.component';

//COMPONENTES GENERALES
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

//COMPONENTES - FILTRO
import { DepartamentosComponent } from './pages/filtro/departamentos/departamentos.component';
import { UsuariosComponent } from './pages/filtro/usuarios/usuarios.component';
import { ProductosComponent } from './pages/filtro/productos/productos.component';
import { SensorLuzComponent } from './pages/filtro/sensorluz/sensorluz.component';

//COMPONENTES -FORMS
import { NuevoDepartamentoComponent } from './pages/forms/nuevo-departamento/nuevo-departamento.component';
import { NuevoCiaComponent } from './pages/forms/nuevo-cia/nuevo-cia.component';
import { NuevoUsuarioComponent } from './pages/forms/nuevo-usuario/nuevo-usuario.component';
import { EditarUsuarioComponent } from './pages/forms/editar-usuario/editar-usuario.component';
import { CambiarContrComponent } from './pages/forms/cambiar-contr/cambiar-contr.component';


import { from } from 'rxjs';

registerLocaleData(localeEsMX, 'es-Mx');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PieComponent,
    PaginationBarComponent,
    DropdownComponent,
    NuevoDepartamentoComponent,
    NuevoCiaComponent,
    NuevoUsuarioComponent,
    HomeComponent,
    DepartamentosComponent,
    FilePickerComponent,
    LoginComponent,
    UsuariosComponent,
    BarraComponent,
    TimeLineComponent,
    HeaderTableComponent,
    DonutComponent,
    LayeredComponent,
    CardTitleComponent,
    FilterByComponent,
    DialogComponent,
    ProductosComponent,
    EditarUsuarioComponent,
    CambiarContrComponent,
    SensorLuzComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
  ],
  providers: [ DatePipe, { provide: LOCALE_ID, useValue: 'es-Mx' }],

  bootstrap: [AppComponent],
  entryComponents: [
    NuevoDepartamentoComponent, NuevoUsuarioComponent, EditarUsuarioComponent, CambiarContrComponent, 

  ]
})
export class AppModule { }
