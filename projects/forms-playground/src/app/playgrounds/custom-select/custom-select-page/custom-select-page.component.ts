import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule, SelectValue } from 'custom-form-controls';
import { User } from '../../../core/user';

@Component({
  selector: 'app-custom-select-page',
  standalone: true,
  templateUrl: './custom-select-page.component.html',
  styleUrls: ['../../common-page.scss', './custom-select-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SelectModule],
})
export class CustomSelectPageComponent implements OnInit {
  selectValue: SelectValue<User> = [
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
    new User(4, 'Isaac Newton', 'isaac', 'United Kingdom', true),
  ];
  users: User[] = [
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
    new User(3, 'Marie Curie', 'marie', 'Poland/French'),
    new User(4, 'Isaac Newton', 'isaac', 'United Kingdom', true),
  ];

  constructor(private cd: ChangeDetectorRef) {
    setTimeout(() => {
      this.selectValue = new User(3, 'Marie Curie', 'marie', 'Poland/French');
      this.users = [
        new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
        new User(2, 'Niels Bohr', 'niels', 'Denmark'),
        new User(3, 'Marie Curie', 'marie', 'Poland/French'),
      ];
      this.cd.markForCheck();
    }, 3000);
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.selectValue = 'nomon';
    //   this.cd.markForCheck();
    // }, 5000);
  }

  displayWithFn(user: User) {
    return user.name;
  }

  compareWithFn(user: User | null, user2: User | null) {
    return user?.id === user2?.id;
  }

  onSelectionChanged(value: unknown) {
    console.log('Selected option: ' + value);
  }
}
