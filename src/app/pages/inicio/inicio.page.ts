//import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Component, ElementRef, ViewChild, OnInit, AfterViewInit  } from '@angular/core';
import { Asistencia } from "src/app/model/asistencia";
import jsQR from 'jsqr';
import { QRCode } from 'jsqr';
import { Animation, AnimationController} from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit, AfterViewInit  {

  @ViewChild('titulo', { read: ElementRef, static: true}) titulo!: ElementRef;

  @ViewChild('video')
  private video!: ElementRef;

  @ViewChild('canvas')
  private canvas!: ElementRef;

  public asistencia: Asistencia = new Asistencia();
  public escaneando = false;
  public datosQR: string = '';

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

  public constructor(private animationController:AnimationController ) {
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

  // Si "obtenerDatosQR" encuentra un QR válido entonces se mostrarán los datos en pantalla
  // y se devolverá true para detener el escaneo. En caso contrario, mientras no se detecte
  // un QR, la función "obtenerDatosQR" devolverá false y el método "verificarVideo" se 
  // volverá a ejecutar nuevamente.
  // Para analizar la imagen se usan los Elementos HTML: video y canvas. El TAG HTML "video"
  // sirve para establecer un recuadro en la pantalla donde se visualiza el video de la 
  // cámara. Cada fotograma de la cámara es redibujado dentro del TAG HTML "canvas", 
  // de modo que es la imagen del canvas, la que analiza la biblioteca "jsQR". 

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
  // Si la propiedad this.escaneando cambia a false, entonces la función
  // "verificarVideo" deja de ejecutarse y se detiene el escaneo del QR.

  public detenerEscaneoQR(): void {
    this.escaneando = false;
  }

}
