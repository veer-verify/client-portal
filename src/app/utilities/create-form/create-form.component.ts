import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent {
  
  fields = [
    {
      label: "name",
      required: false,
      type: "text"
    },
    {
      label: "email",
      required: true,
      type: "email"
    },
    {
      label: "role",
      required: true,
      type: "select"
    }
  ];

  constructor(
    private fb: FormBuilder
  ) {}

  createForm: FormGroup;
  ngOnInit(): void {
    let config: any = {};
    this.fields.map((item) => {
      config[item.label] = new FormControl('');
    });
    this.createForm = this.fb.group(config)

    console.log(this.createForm.value)
  }

}
