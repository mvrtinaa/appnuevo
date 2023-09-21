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
  public email:String;
  public password:String;





  constructor(private router:Router,private toastController:ToastController) {
    this.usuario= new Usuario("","");
    this.email="as";
    this.password="as";
    this.usuario.setUsuario('atorres@duocuc.cl', '1234');

   }

  ngOnInit() {
  }

  public ingresar():void{
    this.usuario.llenarUsuariosValidos();
    if(this.usuario.validarUsuario(this.usuario)){
      this.router.navigate(['/inicio']);
    }else{
      console.log("no pasa");
    }

  }

  public goCorreo():void{
    this.router.navigate(['/correo']);
  }

}
