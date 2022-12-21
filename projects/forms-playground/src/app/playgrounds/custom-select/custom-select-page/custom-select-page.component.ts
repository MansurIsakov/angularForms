import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'custom-form-controls';

@Component({
  selector: 'app-custom-select-page',
  standalone: true,
  templateUrl: './custom-select-page.component.html',
  styleUrls: ['../../common-page.scss', './custom-select-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SelectModule],
})
export class CustomSelectPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
