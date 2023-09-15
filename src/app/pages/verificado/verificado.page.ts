import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verificado',
  templateUrl: './verificado.page.html',
  styleUrls: ['./verificado.page.scss'],
})
export class VerificadoPage implements OnInit {

  public password: string = '';

  constructor(private activatedRoute: ActivatedRoute,private router: Router) {

    // this.activatedRoute.queryParams.subscribe(params => {
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.password = this.router.getCurrentNavigation().extras.state.password;
    //   }
    // });
   }

  ngOnInit() {
  }

}
