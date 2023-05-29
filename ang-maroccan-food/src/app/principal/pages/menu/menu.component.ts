import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User';
import { PasoDatosService } from 'src/app/services/paso-datos.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  responsiveOptions;
  listaAmigos: User[] = [];

  constructor(private pasoDatos: PasoDatosService) {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
    ];
  }

  ngOnInit(): void {
    this.listaAmigos = this.pasoDatos.listaAmigos;
  }

}
