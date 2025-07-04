import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminpanelComponent implements OnInit {
  @ViewChild('input') input:ElementRef;

  model = {
    userName: null,
    district: null,
    city: null,
    state: null,
    pincode: null,
    contactNumber: null,
    enabled: true,
    role: null,
    addressLine1: null,
    realm_Id: null,
    user_Country: null,
    active: false,
    addressLine2: null,
    last_Name: null,
    first_Name: null,
    email: null
}

  constructor(private apiservice : ApiService) { }

  ngOnInit(): void {
  }


  validations(){
    var checkEmail =/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[^\s@]+$/.test(this.model.email!)
    let isPicodeNum = /^\d+$/.test(this.model.pincode!);
    let isContactNum = /^\d+$/.test(this.model.contactNumber!);
    let checkUsername = /^[a-zA-Z0-9+@-_.]+$/.test(this.model.userName!)
    console.log(checkUsername)

  }
  createUser(){
    this.validations();
    const isNull = Object.values(this.model).some((value:any) => {if (value == null && value != false) {return true;}return false;});
    const isEmpty = Object.values(this.model).some((value:any) => {if (value === "") {return true;}return false;});
    // if isNull & isEmty false then only run or alert all fields required
    if(!isNull){
      // this.apiservice.createuser(this.model).subscribe((res:any)=>{
      //   console.log(res);
      // })
    }else{
      console.log("please enter all details")
    }
  }
  updateUser(){
    Object.assign(this.model, {id: null});
    console.log(this.model)
  }
  onFocusOutEvent(e:any){
    var x = (e.target.nextElementSibling);
    if(e.target.value){x.style.transform = "translateY(-50px)"; x.style.fontSize = "12px"; x.style.paddingLeft  = "0"}
    else{x.style.transform = "translateY(-30px)";  x.style.fontSize = "16px";x.style.paddingLeft  = "35px"}
  }


  toggleAccordian(event:any, index=0) {return this.apiservice.toggle(event)}
  showOptions(){return this.apiservice.showOptions()}
  showOptions1(){return this.apiservice.showOptions1()}
  closemodal(){return this.apiservice.closemodal();}
  toQRmodal(){return this.apiservice.toQR()}

}