import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/auth/storage.service';


@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css']
})
export class ResearchComponent implements OnInit {
    @ViewChild('optionlabel') optionlabel: ElementRef;


  constructor(
    private apiservice : ApiService,
    private storageService:StorageService,
    private router:Router) { }

  report:any;
  selectedreport:any;
  reporttitle:any;
  currentsite:any;

  ngOnInit(): void {
    this.report =[
      {"title" : "Q1 2021", "contents":this.reportarray},
      {"title" : "Q2 2021", "contents":this.reportarray},
      {"title" : "Q3 2021", "contents":this.reportarray}
    ]

    var p =  this.storageService.getEncrData('siteidfromgaurdpage');
    if(p == null){this.router.navigateByUrl('/guard')}
    else{this.currentsite=p.siteName};
    this.selectedreport = this.report[0];
    this.reporttitle=this.report[0].title;
  }
  selectReport(report:any){
    this.selectedreport =report;
    this.reporttitle=report.title;
    this.optionlabel.nativeElement.click();
  }


  
  toggleAccordian(event:any, index=0) {return this.apiservice.toggle(event)}
  showOptions(){return this.apiservice.showOptions()}
  showOptions1(){return this.apiservice.showOptions1()}
  closemodal(){return this.apiservice.closemodal();}
  toQRmodal(){return this.apiservice.toQR()}






  reportarray=[
    {
        "title":"CUSTOMER TRAFFIC",
        "content":[
            {
                "title":"Dwell Time",
                "content":" In February, your store started a promotion for “half price coffee”, as a result; your store’s average dwell time increased by 2.1 minutes. This overall increase in dwell time had a positive correlation with a 12% increase in sales performance for this month"
            },
            {
                "title":"Friction Points",
                "content":"  Customers spent 34 seconds longer than the store average in two areas located within the eastern section of the store. These shelves contain Chile Lime Doritos, the #3 best-selling item in your store. The current layout of products on these shelves might indicate customers are having difficulty finding desired products."
            },
            {
                "title":"Impression Rate",
                "content":"Repositioning Aisle C seemed to have a positive effect on impression rate for Aisles A and B. Aisle A received 243 more impressions than last month, and Aisle B received 524 more impressions."
            }
        ]
    },
    {
        "title":"CONVERSION",
        "content":[
            {
                "title":null,
                "content":"There’s been a gradual increase in non-conversions from 5 pm to 8 pm (74% conversion rate) compared to last month (81% conversion rate), however this may be related to a promotion that was only available for a limited time and no longer applicable"
            },
            {
                "title":null,
                "content":" The “2 for $10” lunch campaign seemed to have a significant effect on conversion rates during lunch hours (89%) compared to last month (83%)"
            }
        ]
    },
    {
        "title":"CHECKOUT TIME",
        "content":[
            {
                "title":null,
                "content":"Since installing one self-checkout kiosk and employing one additional cashier, your store goal of achieving a “60 second or less” checkout time on Fridays has been met"
            }
        ]
    },
    {
        "title":"SANITATION CHECK",
        "content":[
            {
                "title":null,
                "content":"Cleanliness rates have improved dramatically this month (97%) compared to last month (86%)."
            }
        ]
    }
]


}