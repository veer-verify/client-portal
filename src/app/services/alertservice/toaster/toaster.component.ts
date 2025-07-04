import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../alert-service.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {

  constructor(private alertService: AlertService) { }

  private subscription: Subscription;
  message: any;

  ngOnInit() {
    // this.subscription = this.alertService.getMessage().subscribe(message => {
    //   this.message = message;
    // });
  }

  closeMessage() {
    this.alertService.clearAlertMessage();
  }

  closeAlertModal(){
    this.alertService.clearAlertMessage();
    var x = <HTMLElement>document.getElementById('warningmodal');
    if(x) {
      x.style.display = "none";
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
