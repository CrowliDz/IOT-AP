import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { UsuariosComponent } from './pages/filtro/usuarios/usuarios.component';
import { DepartamentosComponent } from './pages/filtro/departamentos/departamentos.component';
import { ProductosComponent } from './pages/filtro/productos/productos.component';
import { SensorLuzComponent } from './pages/filtro/sensorluz/sensorluz.component';
import { MaquinaComponent } from './pages/filtro/maquina/maquina.component';
import { GraficaLineaComponent } from './components/grafica-linea/grafica-linea.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'usuar', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: 'departament', component: DepartamentosComponent, canActivate: [AuthGuard] },
  { path: 'product', component: ProductosComponent, canActivate: [AuthGuard] },
  { path: 'light-control', component: SensorLuzComponent, canActivate: [AuthGuard] },
  { path: 'machine-control', component: MaquinaComponent, canActivate: [AuthGuard] },
  { path: 'graph', component: GraficaLineaComponent, canActivate: [AuthGuard] },
];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(
      routes
    ),
    CommonModule,
    FormsModule,
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
