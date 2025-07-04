import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-live-events',
  templateUrl: './live-events.component.html',
  styleUrls: ['./live-events.component.css']
})
export class LiveEventsComponent implements OnInit {

  constructor(
    private apiSer: ApiService,
    private sanitizer: DomSanitizer,
    private eventSer: EventService
  ) { }

  showLoader: boolean = false;
  siteName: any = "0";
  ngOnInit(): void {
    this.getSites();
  }

  siteData: any = [];
  getSites() {
    // this.showLoader = true;
    this.apiSer.getSites().subscribe((res: any) => {
      // this.showLoader = false;
      // console.log(res);
      if(res.Status == "Success") {
        this.siteData = res?.siteList;
        // this.getDevices(this.siteData[0]);
      }
    }, (err: any) => {
    })
  }

  deviceData: any = [];
  currentSite: any;
  getDevices(data: any) {
    // console.log(data);
    if(data != 'fileUrl' && data != 'fileUpload') {
      this.currentSite = data;
      // this.apiSer.listDevicesBySite(data).subscribe((res: any) => {
      //   console.log(res);
      //   this.deviceData = res[0]?.adsDevices;
      // });
    }
  }


  responseImage: any;
  getDetailsForVideoOrUrl() {
    this.openviewmodal();
    this.eventSer.getDetailsForVideoOrUrl(this.filesObj).subscribe((res: any) => {
      console.log(res);
      this.responseImage = res?.imageName
    })
  }

  selectedFiles: any = [];
  filesObj: any = {
    file: null,
    rtspUrl: null
  }
  public onFileSelected(event: any): void {
    let file = FileList = event.target.files[0];
    this.filesObj.file = file;
    // for(let i = 0; i < file.length; i++) {
    //   this.selectedFiles.push(file[i]);
    // }
  }

  clearFile() {
    this.filesObj.file = null;
    this.filesObj.rtspUrl = null;
  }

  openviewmodal(){
    var x = <HTMLElement>document.getElementById('viewmodal');
    x.style.display = "block";
  }

  closeviewModal(){
    var x = <HTMLElement>document.getElementById('viewmodal');
    x.style.display = "none";
  }

  sanitizedUrls: Map<string, SafeResourceUrl> = new Map();
  sanitizeUrl(url: string | undefined): SafeResourceUrl | null {
    if (url === undefined) {
      return null;
    } else {
      let sanitizedUrl = this.sanitizedUrls.get(url);
      if (!sanitizedUrl) {
        sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.sanitizedUrls.set(url, sanitizedUrl);
      }
      return sanitizedUrl;
    }
  }


  @ViewChild('imageElement') imageElement?: ElementRef<HTMLImageElement>;
  @ViewChild('canvasElement') canvasElement?: ElementRef<HTMLCanvasElement>;

  context?: CanvasRenderingContext2D | null = null;
  coordinates: { x: number; y: number }[] = [];
  isImageLoaded = false;

  ngAfterViewInit(): void {
    this.context = this.canvasElement?.nativeElement.getContext('2d');
  }

  onImageLoad(): void {
    const image = this.imageElement?.nativeElement;
    const canvas = this.canvasElement?.nativeElement;
    if (!image || !canvas || !this.context) return;

    canvas.width = 500;
    canvas.height = 300;
    this.isImageLoaded = true;

    this.drawCoordinates();
  }

  onCanvasClick(event: MouseEvent): void {
    if (!this.isImageLoaded || !this.context || !this.canvasElement?.nativeElement) return;

    const canvas = this.canvasElement.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.coordinates.push({ x, y });
    this.drawCoordinates();
  }

  drawCoordinates(): void {
    if (!this.isImageLoaded || !this.context || !this.imageElement?.nativeElement) return;

    const image = this.imageElement.nativeElement;
    const canvas = this.canvasElement?.nativeElement;
    if (!canvas) return;

    this.context.clearRect(0, 0, canvas.width, canvas.height);

    this.context.drawImage(image, 0, 0);

    this.context.fillStyle = 'red';
    this.coordinates.forEach(coord => {
      this.context?.beginPath();
      this.context?.arc(coord.x, coord.y, 5, 0, 2 * Math.PI);
      this.context?.fill();
    });
  }

  saveCoordinates(): void {
    console.log('Coordinates:', this.coordinates);
  }

}
