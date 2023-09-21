import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Navigation, NavigationExtras, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-pregunta-secreta',
  templateUrl: './pregunta-secreta.page.html',
  styleUrls: ['./pregunta-secreta.page.scss'],
})
export class PreguntaSecretaPage implements OnInit {
  public usuario: Usuario;
  public respuesta: String = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router) 
  {
    this.usuario = new Usuario('', '', '' , '', '');

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

  public validarRespuestaSecreta(): void {
    if (this.usuario.respuestaSecreta === this.respuesta) {
      const navigationExtras: NavigationExtras = {
        state: {
          usuario: this.usuario
        }
      };
      this.router.navigate(['/verificado'], navigationExtras);
    }
    else {
      this.router.navigate(['/incorrecto']);
    }
  }

}
