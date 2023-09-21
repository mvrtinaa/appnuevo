import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute, Navigation } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-verificado',
  templateUrl: './verificado.page.html',
  styleUrls: ['./verificado.page.scss'],
})
export class VerificadoPage implements OnInit {
  public usuario : Usuario = new Usuario('','','','','');

  constructor(private activatedRoute: ActivatedRoute,private router: Router) {
    this.activatedRoute.queryParams.subscribe(params => {

      const nav: Navigation| null = this.router.getCurrentNavigation();

      if (nav) {
        if (nav.extras.state) {
          this.usuario = nav.extras.state['usuario'];
          return;
        }
      }

      this.router.navigate(['/login']);

    });
   }

  ngOnInit() {
  }

}
