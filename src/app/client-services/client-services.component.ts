import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-client-services',
  templateUrl: './client-services.component.html',
  styleUrls: ['./client-services.component.css']
})
export class ClientServicesComponent implements OnInit {
  visible=false;
  constructor(private http:HttpClient, private apiservice: ApiService) { }

  ppt:any;
  ngOnInit(): void {
    this.http.get('assets/pptdata.json').subscribe(data => {
      this.ppt = data
   })   
   
   
  }
   
  toggleAccordian(event:any, index=0) {
    var element = event.target;
    element.classList.toggle("active");   
    var panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

  // for months selector
  years = Array((new Date().getUTCFullYear()) - ((new Date().getUTCFullYear()) - 20)).fill('').map((v, idx) => (new Date().getUTCFullYear()) - idx);
  months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  selectedMonth="Select Month"
  nextYear(){
    var y = this.years[0]+1;
    var z = new Date().getUTCFullYear();
    if(this.years[0] < z){this.years.splice(0, 0, y);}
  }
  prevYear(){
    if( this.years[0] > 2014){this.years = this.years.slice(1);}
  }
  currentMonthIndex = ((new Date()).getMonth());
  currentyear = new Date().getUTCFullYear();
  monthselected = false;
  selectedmonth(i:any){
    if((this.years[0] == this.currentyear && i<=this.currentMonthIndex) || this.years[0] < this.currentyear ){
      this.monthselected =true;
      this.visible = false;
      this.selectedMonth = this.months[i] +', '+ this.years[0];
      var month = i+1;
      var year = this.years[0]
      if(this.years[0] == this.currentyear && i<=this.currentMonthIndex){
        var lastDate = new Date().getDate()
      }else{
        var lastDate = new Date(year, month, 0).getDate();
      }
      var a
      if(month<10){a = '0' + month;} else{ a = month };
      var startDate = '01/' + a + '/'+year ;
      var endDate = lastDate + '/' + a + '/' + year ;
    }
  }

  


  cont(c:any){
    const media:any=[]
    c.forEach((el:any)=>{
    if(el.description.length == 0 ){
        if(el.img.length != 0 ){media.push(el.img);}
        if(el.video.length != 0 ){media.push(el.video);}
      }
      var x=(media.flat())
      return x;
    })
    var x = (media.flat())
    return x;
  }
  cont1(c:any){
    const media:any=[]
    c.forEach((el:any)=>{
      if(el.description.length != 0 ){media.push(el);}
      var x=(media.flat())
      return x;
    });
    var x=(media.flat())
    return x;
  }
    checkExtension(file:any) {
    var extension = file.substr((file.lastIndexOf('.') + 1));
    switch (extension) {
    case 'jpg': case 'png': case 'gif': return "img" // There's was a typo in the example where
    break; // the alert ended with pdf instead of gif.
    case 'mp4': case 'mp3': case 'ogg': return "video"
    break;
    }
    return "video";
  };

  

  showOptions(){return this.apiservice.showOptions()}
  showOptions1(){return this.apiservice.showOptions1()}
  closemodal(){return this.apiservice.closemodal();}
  toQRmodal(){return this.apiservice.toQR()}

  


}
