import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationEvent,
} from '@angular/animations';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { OptionComponent } from 'custom-form-controls';

@Component({
  selector: 'cfc-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [
    trigger('dropDown', [
      state('void', style({ transform: 'scaleY(0)', opacity: 0 })),
      state('*', style({ transform: 'scaleY(1)', opacity: 1 })),
      // :enter === void => *
      transition(':enter', [animate('320ms cubic-bezier(0, 1, 0.45, 1.34)')]),
      // :leave === * => void
      transition(':leave', [
        animate('420ms cubic-bezier(0.88, -0.7, 0.86, 0.85)'),
      ]),
    ]),
  ],
})
export class SelectComponent implements AfterContentInit {
  @Input()
  label = '';

  @Input()
  value: string | null = null;

  @Output()
  readonly opened = new EventEmitter<void>();
  @Output()
  readonly closed = new EventEmitter<void>();

  @HostListener('click')
  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent>;

  isOpen = false;

  constructor() {}

  ngAfterContentInit(): void {
    this.higlightSelectedOptions(this.value);
  }

  onPanelAnimationDone({ fromState, toState }: AnimationEvent) {
    if (fromState === 'void' && toState === null && this.isOpen) {
      this.opened.emit();
    }

    if (fromState === null && toState === 'void' && !this.isOpen) {
      this.closed.emit();
    }
  }

  private higlightSelectedOptions(value: string | null) {
    // this.findOptionsByValue(value)?.highlightAsSelected();
  }

  private findOptionsByValue(value: string | null) {
    return this.options && this.options.find((o) => o.value === value);
  }
}
