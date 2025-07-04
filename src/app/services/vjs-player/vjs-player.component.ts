import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import videojs from 'video.js';

@Component({
  selector: 'app-vjs-player',
  templateUrl: './vjs-player.component.html',
  styleUrls: ['./vjs-player.component.css'],

  encapsulation: ViewEncapsulation.None,
})
export class VjsPlayerComponent implements OnInit {


  @ViewChild('target', { static: true })
  target!: ElementRef;

  @Input()
  options!: {
    fluid: boolean;
    aspectRatio: string;
    autoplay: boolean;
    plugins: {
      reloadSourceOnError: {}
    }
    // breakpoints: {
    //   tiny: 300,
    //   xsmall: 400,
    //   small: 500,
    //   medium: 600,
    //   large: 700,
    //   xlarge: 800,
    //   huge: 900
    // }
    sources: {
      src: string;
      type: string;
    }[];
  } | object;
  player!: videojs.Player;

  ngOnInit() {
    // instantiate Video.js
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      // console.log('onPlayerReady', this);
      this.on('error', (error:any) =>{
        this.hasStarted(false)
        // this.bigPlayButton.show()
        // console.log("video player error")
        // this.setTimeout(this.play,1000);
        this.tech(true).on('retryplaylist', (event) => {
          this.play();
        })
      });

   

      // player.tech().Hls.xhr.beforeRequest

    //   player.on('error', () => {
    //     player.createModal('Retrying connection');
    //     if (player.error().code === 4) {
    //         this.player.retryLock = setTimeout(() => {
    //             player.src({
    //                 src: data.url
    //             });
    //             player.load();
    //         }, 5000);
    //     }
    // });



    }); 


    

  }

  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
    
  }

 
}