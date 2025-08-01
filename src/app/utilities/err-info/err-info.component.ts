import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-err-info',
  templateUrl: './err-info.component.html',
  styleUrls: ['./err-info.component.css']
})
export class ErrInfoComponent {

  @Input({required: true}) text: string;

}
