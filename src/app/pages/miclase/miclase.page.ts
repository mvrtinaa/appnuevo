import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Asistencia } from "src/app/model/asistencia";
import jsQR from 'jsqr';
import { QRCode } from 'jsqr';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.page.html',
  styleUrls: ['./miclase.page.scss'],
})
export class MiclasePage implements OnInit {

  @ViewChild('titulo', { read: ElementRef, static: true}) titulo!: ElementRef;

  @ViewChild('video')
  private video!: ElementRef;

  @ViewChild('canvas')
  private canvas!: ElementRef;

  public asistencia: Asistencia = new Asistencia();
  public escaneando = false;
  public datosQR: string = '';

  public sede: string = '';
  public idAsignatura: string = '';
  public seccion: string = '';
  public nombreAsignatura: string = '';
  public nombreProfesor: string = '';
  public dia: string = '';
  public bloqueInicio: number=0;
  public bloqueTermino: number=0;
  public horaInicio: string = '';
  public horaFin: string = '';
  

  public constructor(private animationController:AnimationController ) {
  }
  

  public ngOnInit() {
    
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
    this. sede= objetoDatosQR.sede;
    this. idAsignatura= objetoDatosQR.idAsignatura;
    this. seccion= objetoDatosQR.seccion;
    this. nombreAsignatura= objetoDatosQR.nombreAsignatura;
    this. nombreProfesor= objetoDatosQR.nombreProfesor;
    this. dia= objetoDatosQR.dia;
    this. bloqueInicio= objetoDatosQR.bloqueInicio;
    this. bloqueTermino= objetoDatosQR.bloqueTermino;
    this. horaInicio= objetoDatosQR.horaInicio;
    this. horaFin= objetoDatosQR.horaFin;
  }
  
  public detenerEscaneoQR(): void {
    this.escaneando = false;
  }

}

