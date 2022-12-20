import { CommonModule } from '@angular/common';
import '@polymer/paper-input/paper-textarea';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EditableContentValueAccessor } from '../value-accessor/editable-content.directive';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-rating-picker-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditableContentValueAccessor],
  templateUrl: './rating-picker-page.component.html',
  styleUrls: ['../../common-page.scss', './rating-picker-page.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingPickerPageComponent implements OnInit {
  form = this.fb.group({
    reviewText: '',
  });
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {}
  onSubmit() {
    console.log(this.form.value);
    this.form.reset();
  }
}
