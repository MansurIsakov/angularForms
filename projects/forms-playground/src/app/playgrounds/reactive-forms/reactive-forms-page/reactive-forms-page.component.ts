import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  bufferCount,
  filter,
  Observable,
  startWith,
  Subscription,
  tap,
} from 'rxjs';
import { UserSkillsService } from '../../../core/user-skills.service';
import { banWords } from '../validators/ban-words.validator';
import { passwordMatch } from '../validators/password-match';
import { UniqueNicknameValidator } from '../validators/unique-nickname.validator';

@Component({
  selector: 'app-reactive-forms-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-forms-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    '../../common-form.scss',
    './reactive-forms-page.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactiveFormsPageComponent implements OnInit, OnDestroy {
  phoneLabels = ['Main', 'Mobile', 'Work', 'Home'];

  getYears() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40))
      .fill('')
      .map((_, idx) => now - idx);
  }

  years = this.getYears();

  skills$!: Observable<string[]>;

  form = this.fb.group({
    firstName: [
      'Mansur',
      [
        Validators.required,
        Validators.minLength(2),
        banWords(['test', 'dummy']),
      ],
    ],
    lastName: ['Isakov', [Validators.required, Validators.minLength(2)]],
    nickname: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[\w.]+$/),
        ],
        asyncValidators: [
          this.uniqueNickname.validate.bind(this.uniqueNickname),
        ],
        updateOn: 'blur',
      },
    ],
    email: ['mansur@gmail.com', [Validators.required, Validators.email]],
    yearsOfBirth: this.fb.nonNullable.control(
      this.years[this.years.length - 1],
      Validators.required
    ),
    passport: ['', [Validators.pattern(/^[A-Z]{2}[0-9]{7}$/)]],
    address: this.fb.nonNullable.group({
      fullAddress: ['', Validators.required],
      city: ['', Validators.required],
      postCode: [0, Validators.required],
    }),
    phones: this.fb.array([
      this.fb.group({
        label: this.fb.nonNullable.control(this.phoneLabels[0]),
        phone: '',
      }),
    ]),
    skills: new FormRecord<FormControl<boolean>>({}),
    password: this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: '',
      },
      {
        validators: [passwordMatch],
      }
    ),
  });

  private ageValidators!: Subscription;
  private formPendingState!: Subscription;

  private initialFormValues: any;

  @ViewChild(FormGroupDirective)
  private formDir!: FormGroupDirective;

  constructor(
    private userSkills: UserSkillsService,
    private fb: FormBuilder,
    private uniqueNickname: UniqueNicknameValidator,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.skills$ = this.userSkills.getSkills().pipe(
      tap((skills) => this.buildSkillControls(skills)),
      tap(() => (this.initialFormValues = this.form.value))
    );
    this.ageValidators = this.form.controls.yearsOfBirth.valueChanges
      .pipe(
        tap(() => this.form.controls.passport.markAsDirty()),
        startWith(this.form.controls.yearsOfBirth.value)
      )
      .subscribe((yearOfBearth) => {
        this.isAdult(yearOfBearth)
          ? this.form.controls.passport.addValidators(Validators.required)
          : this.form.controls.passport.removeValidators(Validators.required);
        this.form.controls.passport.updateValueAndValidity();
      });

    this.formPendingState = this.form.statusChanges
      .pipe(
        bufferCount(2, 1),
        filter(([prevState]) => prevState === 'PENDING')
      )
      .subscribe(() => this.cd.markForCheck());
  }

  ngOnDestroy(): void {
    if (this.ageValidators) this.ageValidators.unsubscribe();

    if (this.formPendingState) this.formPendingState.unsubscribe();
  }

  addPhone() {
    this.form.controls.phones.insert(
      0,
      new FormGroup({
        label: new FormControl(this.phoneLabels[0], { nonNullable: true }),
        phone: new FormControl(''),
      })
    );
  }

  removePhone(index: number) {
    this.form.controls.phones.removeAt(index);
  }

  onSubmit(e: Event) {
    console.log(this.form.value);
    this.initialFormValues = this.form.value;

    // Reseting all the valeus and statuses without ng-submit
    // this.form.reset()

    // Reseting all the valeus and statuses as well as ng-submit
    this.formDir.resetForm();
  }

  onReset(e: Event) {
    e.preventDefault();
    this.formDir.resetForm(this.initialFormValues);
  }

  private buildSkillControls(skills: string[]) {
    skills.forEach((skill) =>
      this.form.controls.skills.addControl(
        skill,
        new FormControl(false, { nonNullable: true })
      )
    );
  }

  private isAdult(yearOfBearth: number): boolean {
    const currentYear = new Date().getFullYear();

    return currentYear - yearOfBearth >= 18;
  }
}
