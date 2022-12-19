import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserInfo } from '../../../core/user-info';
import { BanWordsDirective } from '../validators/ban-words.directive';
import { PasswordShouldMatchDirective } from '../validators/password-should-match.directive';
import { UniqueNicknameDirective } from '../validators/unique-nickname.directive';

@Component({
  selector: 'app-template-forms-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BanWordsDirective,
    PasswordShouldMatchDirective,
    UniqueNicknameDirective,
  ],
  templateUrl: './template-forms-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    '../../common-form.scss',
    './template-forms-page.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateFormsPageComponent implements OnInit, AfterViewInit {
  userInfo: UserInfo = {
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    yearOfBirth: 2022,
    passport: '',
    fullAdress: '',
    city: '',
    postCode: 0,
    password: '',
    passwordConfirm: '',
  };

  @ViewChild(NgForm)
  formDir!: NgForm;

  private initialFormValues: unknown;

  get isAdult() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.userInfo.yearOfBirth >= 18;
  }

  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40))
      .fill('')
      .map((_, idx) => now - idx);
  }

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.initialFormValues = this.formDir.value;
    });
  }

  onSubmitForm(e: SubmitEvent) {
    console.log('The Form', this.formDir.value);
    console.log('The native submit event', e);

    // Strategy 1 - Reset from values, validation statuses, mkaing controls untoched, prestine, etc.
    // form.resetForm();

    // Strategy 2 - Reset only control statuses but not values.
    // this.formDir.resetForm(this.formDir.value);

    // Strategy 3 - Full reset
    this.formDir.reset();
    // this.initialFormValues = this.formDir.value;
  }

  onReset(e: Event) {
    e.preventDefault();
    this.formDir.resetForm(this.initialFormValues);
  }
}
