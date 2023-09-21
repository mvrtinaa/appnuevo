import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
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
      this.router.navigate(['/verificado']);
    }
    else {
      this.router.navigate(['/incorrecto']);
    }
  }

}
