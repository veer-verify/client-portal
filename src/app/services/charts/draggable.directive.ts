import { DOCUMENT } from "@angular/common";
import { Directive, ElementRef, HostListener, Inject, OnDestroy, OnInit } from "@angular/core";
import { fromEvent, Subscription, takeUntil } from "rxjs";







@Directive({
  selector: "[drag]",
})

export class DraggingDirective {

  canDrag: boolean;

  currentX: number;
  currentY: number;

  initialX: number
  initialY: number;

  xOffset = 0;
  yOffset = 0;

  constructor(private el: ElementRef) {
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  public dragStart(e:any) {
    if (e.type === "touchstart") {
      this.initialX = e.touches[0].clientX - this.xOffset;
      this.initialY = e.touches[0].clientY - this.yOffset;
    } else {
      this.initialX = e.clientX - this.xOffset;
      this.initialY = e.clientY - this.yOffset;
    }

    if (e.target === this.el.nativeElement) {
      this.canDrag = true;
    }
  }


  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  public dragEnd(e:any) {
    this.initialX = this.currentX;
    this.initialY = this.currentY;
    this.canDrag = false;
  }


  @HostListener('touchmove', ['$event'])
  @HostListener('mousemove', ['$event'])
  public drag(e:any) {
    if (this.canDrag) {
      e.preventDefault();

      if (e.type === "touchmove") {
        this.currentX = e.touches[0].clientX - this.initialX;
        this.currentY = e.touches[0].clientY - this.initialY;
      } else {
        this.currentX = e.clientX - this.initialX;
        this.currentY = e.clientY - this.initialY;
      }

      this.xOffset = this.currentX;
      this.yOffset = this.currentY;
      this.el.nativeElement.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;

    }
  }

}



/*
export class DraggingDirective implements OnInit, OnDestroy {
  private element: HTMLElement;

  private subscriptions: Subscription[] = [];

  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.element = this.elementRef.nativeElement as HTMLElement;
    this.initDrag();
  }

  initDrag(): void {
   // 1
   const dragStart$ = fromEvent<MouseEvent>(this.element, "mousedown");
   const dragEnd$ = fromEvent<MouseEvent>(this.document, "mouseup");
   const drag$ = fromEvent<MouseEvent>(this.document, "mousemove").pipe(
     takeUntil(dragEnd$)
   );

   // 2
   let initialX: number,
     initialY: number,
     currentX = 0,
     currentY = 0;

   let dragSub: Subscription;

   // 3
   const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
     initialX = event.clientX - currentX;
     initialY = event.clientY - currentY;
     this.element.classList.add('free-dragging');

     // 4
     dragSub = drag$.subscribe((event: MouseEvent) => {
       event.preventDefault();

       currentX = event.clientX - initialX;
       currentY = event.clientY - initialY;

       this.element.style.transform =
         "translate3d(" + currentX + "px, " + currentY + "px, 0)";
     });
   });

   // 5
   const dragEndSub = dragEnd$.subscribe(() => {
     initialX = currentX;
     initialY = currentY;
     this.element.classList.remove('free-dragging');
     if (dragSub) {
       dragSub.unsubscribe();
     }
   });

   // 6
   this.subscriptions.push.apply(this.subscriptions, [
     dragStartSub,
     dragSub,
     dragEndSub,
   ]);
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s?.unsubscribe());
  }
}

/*

@Directive({
    selector: '[draggable]'
})
export class Draggable implements OnInit {

    mouseup = new EventEmitter<MouseEvent>();
    mousedown = new EventEmitter<MouseEvent>();
    mousemove = new EventEmitter<MouseEvent>();

    mousedrag: Observable<{top:any, left:any}>;

    @HostListener('document:mouseup', ['$event'])
    onMouseup(event: MouseEvent) {
        this.mouseup.emit(event);
    }

    @HostListener('mousedown', ['$event'])
    onMousedown(event: MouseEvent) {
        this.mousedown.emit(event);
        return false; // Call preventDefault() on the event
    }

    @HostListener('document:mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        this.mousemove.emit(event);
    }

    constructor(public element: ElementRef) {
        this.element.nativeElement.style.position = 'relative';
        this.element.nativeElement.style.cursor = 'pointer';

        // this.mousedrag = this.mousedown.map((event:any) => {
        //     return {
        //         top: event.clientY - this.element.nativeElement.getBoundingClientRect().top,
        //         left: event.clientX - this.element.nativeElement.getBoundingClientRect().left,
        //     };
        // })
        // .flatMap(
        //     (imageOffset:any) => this.mousemove.map((pos:any) => ({
        //         top: pos.clientY - imageOffset.top,
        //         left: pos.clientX - imageOffset.left
        //     }))
        //     .takeUntil(this.mouseup)
        // );
    }

    ngOnInit() {
        this.mousedrag.subscribe({
            next: pos => {
                this.element.nativeElement.style.top = pos.top + 'px';
                this.element.nativeElement.style.left = pos.left + 'px';
            }
        });
    }
}

*/