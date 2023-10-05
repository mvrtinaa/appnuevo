//import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Component, ElementRef, ViewChild, OnInit, AfterViewInit  } from '@angular/core';
import { Asistencia } from "src/app/model/asistencia";
import jsQR from 'jsqr';
import { QRCode } from 'jsqr';
import { AlertController, Animation, AnimationController} from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit, AfterViewInit  {

  // Las siguientes variables son para acceder a los controles graficos

  @ViewChild('titulo', { read: ElementRef, static: true}) titulo!: ElementRef;

  @ViewChild('video')
  private video!: ElementRef;

  @ViewChild('canvas')
  private canvas!: ElementRef;

  public asistencia: Asistencia = new Asistencia();
  public escaneando = false;
  public datosQR: string = '';
  public usuario: Usuario = new Usuario('','','','','');

  public bloqueInicio: number=0;
  public bloqueTermino: number=0;
  public dia: string = '';
  public horaFin: string = '';
  public horaInicio: string = '';
  public idAsignatura: string = '';
  public nombreAsignatura: string = '';
  public nombreProfesor: string = '';
  public seccion: string = '';
  public sede: string = '';

  constructor(
    private activeroute: ActivatedRoute
  , private router: Router
  , private alertController: AlertController
  , private animationController: AnimationController) {

// Se llama a la ruta activa y se obtienen sus parámetros mediante una subscripcion
this.activeroute.queryParams.subscribe(params => {       // Utilizamos expresión lambda

  const nav = this.router.getCurrentNavigation();
  if (nav) {
    // Si tiene datos extra, se rescatan y se asignan a una propiedad
    if (nav.extras.state) {
      this.usuario = nav.extras.state['usuario'];
      console.log(this.usuario.toString());
      return;
    }
  }
  /*
    Si no vienen datos extra desde la página anterior, quiere decir que el usuario
    intentó entrar directamente a la página home sin pasar por el login,
    de modo que el sistema debe enviarlo al login para que inicie sesión.
  */
  this.router.navigate(['/login']);
});
}
  

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    const animation = this.animationController
      .create()
      .addElement(this.titulo.nativeElement)
      .iterations(Infinity)
      .duration(6000)
      .fromTo('transform', 'translate(0%)', 'translate(100%)')
      .fromTo('opacity', 0.2, 1);
    animation.play();
  }
    

  // Se va a solicitar el uso de la cámara, por medio de "navigator.mediaDevices.getUserMedia".
  // La cámara es necesaria para poder capturar el Código QR.
  // Luego se cofigurará:
  //     this.video.nativeElement.setAttribute('playsinline', 'true');
  // que permite que el video se reproduzca dentro del contexto de la página, en lugar de
  // cambiar automáticamente al modo de pantalla completa en dispositivos iOS. 
  // Esto sirve para proporcionar una experiencia de usuario más fluida y evitar 
  // interrupciones al reproducir videos en el sitio web. Luego se iniciará el proceso de
  // escaneo indicándolo por medio de la variable "this.escaneando = true;" y se podrá detener 
  // el escaneo por medio del botón de "Detener" que cambia a "this.escaneando = false;" o bien
  // si la cámara detecta un código QR.

  public async comenzarEscaneoQR() {
    const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({
      video: {facingMode: 'environment'}
    });
    this.video.nativeElement.srcObject = mediaProvider;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    this.escaneando = true;
    requestAnimationFrame(this.verificarVideo.bind(this));
  }

  // Las imágenes de la cámara se analizan muchas veces, hasta que logre encontrar un Código QR,
  // por esta razón se usa la función del navegador "requestAnimationFrame", que permite realizar
  // actualizaciones de la interfaz de usuario de manera eficiente y sincronizada con los 
  // refrescos de la pantalla. Entonces, en cada refresco de pantalla el programa realizará una
  // pequeña pausa para analizar si el fotograma capturado es o no un Código QR, por medio de
  // la función this.obtenerDatosQR().

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR() || !this.escaneando) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  public obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      if (qrCode.data !== '') {
        this.escaneando = false;
        this.mostrarDatosQROrdenados(qrCode.data);
        return true;
      }
    }
    return false;
  }
  
  public mostrarDatosQROrdenados(datosQR: string): void {
    this.datosQR = datosQR;
    const objetoDatosQR = JSON.parse(datosQR);
    this. bloqueInicio= objetoDatosQR.bloqueInicio;
    this. bloqueTermino= objetoDatosQR.bloqueTermino;
    this. dia= objetoDatosQR.dia;
    this. horaFin= objetoDatosQR.horaFin;
    this. horaInicio= objetoDatosQR.horaInicio;
    this. idAsignatura= objetoDatosQR.idAsignatura;
    this. nombreAsignatura= objetoDatosQR.nombreAsignatura;
    this. nombreProfesor= objetoDatosQR.nombreProfesor;
    this. seccion= objetoDatosQR.seccion;
    this. sede= objetoDatosQR.sede;
  }

  public detenerEscaneoQR(): void {
    this.escaneando = false;
  }

}
