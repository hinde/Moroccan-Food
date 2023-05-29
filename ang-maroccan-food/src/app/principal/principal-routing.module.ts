import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AniadiramigosComponent } from './pages/aniadiramigos/aniadiramigos.component';
import { CrearecetaComponent } from './pages/creareceta/creareceta.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { MenudiarioComponent } from './pages/menudiario/menudiario.component';
import { MenusemanalComponent } from './pages/menusemanal/menusemanal.component';
import { MostraramigosComponent } from './pages/mostraramigos/mostraramigos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RecetasComponent } from './pages/recetas/recetas.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'mostraramigos', component: MostraramigosComponent},
      {path: 'aniadiramigos', component: AniadiramigosComponent},
      {path: 'crearreceta', component:CrearecetaComponent},
      {path: 'menudiario', component:MenudiarioComponent},
      {path: 'menusemanal', component:MenusemanalComponent},
      {path: 'perfil', component: PerfilComponent},
      {path: 'receta', component: RecetasComponent},

      {path: 'menu', component: MenuComponent},
      {path: '**', redirectTo: 'home'}
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]//,
  //imports: [RouterModule.forChild(routes)],
  //exports: [RouterModule]
})
export class PrincipalRoutingModule { }
