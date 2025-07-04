import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/authservice.service';

@Component({
  selector: 'app-errorpage',
  templateUrl: './errorpage.component.html',
  styleUrls: ['./errorpage.component.css']
})
export class ErrorpageComponent implements OnInit {

  constructor(
    private router:Router,
    private apiservice:ApiService,
    private authservice:AuthService
  ) { }

  httpError:any;
  ngOnInit(): void {
    this.apiservice.error$.subscribe((res)=>{
      this.httpError = res;
      // console.log(this.httpError.status)
    });
  }

  loginpage(){  
    this.authservice.logout();
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

}
