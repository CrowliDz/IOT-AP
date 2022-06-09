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
import {MatTabsModule} from '@angular/material/tabs';

//COMPONENTES ADICIONALES
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { CardTitleComponent } from './components/card-title/card-title.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { GraficaLineaComponent } from './components/grafica-linea/grafica-linea.component';

//COMPONENTES GENERALES
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ConfigUsComponent } from './pages/forms/config-us/config-us.component';

//COMPONENTES - FILTRO
import { DepartamentosComponent } from './pages/filtro/departamentos/departamentos.component';
import { UsuariosComponent } from './pages/filtro/usuarios/usuarios.component';
import { ProductosComponent } from './pages/filtro/productos/productos.component';
import { SensorLuzComponent } from './pages/filtro/sensorluz/sensorluz.component';
import { MaquinaComponent } from './pages/filtro/maquina/maquina.component';

//COMPONENTES -FORMS
import { NuevoDepartamentoComponent } from './pages/forms/nuevo-departamento/nuevo-departamento.component';
import { NuevoCiaComponent } from './pages/forms/nuevo-cia/nuevo-cia.component';
import { NuevoUsuarioComponent } from './pages/forms/nuevo-usuario/nuevo-usuario.component';
import { EditluzComponent  } from './pages/forms/edit-luz/edit-luz.component';
import { EditMaquinaComponent  } from './pages/forms/edit-maquina/edit-maquina.component';
import { EditarUsuarioComponent } from './pages/forms/editar-usuario/editar-usuario.component';
import { CambiarContrComponent } from './pages/forms/cambiar-contr/cambiar-contr.component';


import { from } from 'rxjs';

registerLocaleData(localeEsMX, 'es-Mx');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DropdownComponent,
    NuevoDepartamentoComponent,
    NuevoCiaComponent,
    NuevoUsuarioComponent,
    EditluzComponent,
    HomeComponent,
    DepartamentosComponent,
    LoginComponent,
    UsuariosComponent,
    CardTitleComponent,
    DialogComponent,
    ProductosComponent,
    EditarUsuarioComponent,
    CambiarContrComponent,
    SensorLuzComponent,
    MaquinaComponent,
    GraficaLineaComponent,
    EditMaquinaComponent,
    ConfigUsComponent,
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
    MatTabsModule,
  ],

providers: [ DatePipe,  { provide: LOCALE_ID, useValue: 'es-Mx' }],

  bootstrap: [AppComponent],
  entryComponents: [
    EditluzComponent , GraficaLineaComponent, EditMaquinaComponent, ConfigUsComponent,

  ]
})
export class AppModule { }
