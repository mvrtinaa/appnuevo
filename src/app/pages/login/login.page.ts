import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import {Router, NavigationExtras} from "@angular/router";
import { ToastController } from '@ionic/angular';
// el NavigationExtras sirve para pasar parametros

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public usuario:Usuario;

  constructor(private router:Router,private toastController:ToastController) {
    this.usuario= new Usuario('','','','','');
    this.usuario.setUsuario('atorres@duocuc.cl', '1234' );
    this.usuario.setUsuario('avalenzuela@duocuc.cl', 'qwer');
    this.usuario.setUsuario('cfuentes@duocuc.cl', 'asdf');
   }

  ngOnInit() {
  }
  public ingresar(): void {
    if (this.usuario) {

      if(!this.validarUsuario(this.usuario)) return;
      
      const usu: Usuario | undefined = this.usuario.buscarUsuarioValido(
        this.usuario.email, this.usuario.password);

      if (usu) {
        
      /*
        Se declara e instancia un objeto de la clase NavigationExtras, para poder pasarle parámetros a la página home.
        Al objeto json "state" se le asigna un objeto con nombre de clave "login" y el valor "this.login", de modo que
        le pase la cuenta de usuario y su password a la página home.

        Nótese que al enviar this.login, realmente se está enviando los valores que el usuario digitó en las cajas de input,
        pues gracias a la directiva [(ngModel)]="login.usuario", el programa sabe que hay una relación directa de unión entre
        el valor de la propiedad login.usuario y el valor del control gráfico que lleva este mismo nombre.
      */

        const navigationExtras: NavigationExtras = {
          state: {
            usuario: usu
          }
        };
        this.mostrarMensaje('¡Bienvenido(a)!');
        this.router.navigate(['/inicio'], navigationExtras); // Navegamos hacia el Home y enviamos la información extra

      }
    }
  }

  /*
    Usaremos validateModel para verificar que se cumplan las validaciones de los campos del formulario
  */
  public validarUsuario(usuario: Usuario): boolean {
    if (!usuario.validarUsuario(this.usuario)) {
      this.mostrarMensaje('Las credenciales del usuario son incorrectas');
      return false
    }
    return true;
  }

  /**
   * Muestra un toast al usuario
   *
   * @param mensaje Mensaje a presentar al usuario
   * @param duracion Duración el toast, este es opcional
   */
  async mostrarMensaje(mensaje: string, duracion?: number) {
    const toast = await this.toastController.create({
        message: mensaje,
        duration: duracion? duracion: 2000
      });
    toast.present();
  }

}

