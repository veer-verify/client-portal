import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from '../alert-service.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  private subscription: Subscription;
  message: any;
  title:any;

  constructor(private alertService: AlertService) {
    var timer: any = null;
    this.subscription = alertService.getMessage().subscribe(message => {
      if (timer) {clearTimeout(timer); timer = null;}
      // timer = setTimeout(()=>{this.closeMessage()}, 5000);
      this.message = message;
      timer;
    });
  }

  ngOnInit() {  
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeMessage() {
    this.alertService.clearAlertMessage();    
  } 


  closeAlertModal(){
    this.alertService.clearAlertMessage();    
    var x = <HTMLElement>document.getElementById('warningmodal1');
    if(x) {
      x.style.display = "none";
    }
  }
}
