import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  reactiveSearchString = new FormControl('');

  constructor() {}

  ngOnInit(): void {
    this.reactiveSearchString.valueChanges.subscribe(console.log);
  }

  // searchString: string = '';
  // findSome(search: string) {
  //   console.log(search);
  // }
}
