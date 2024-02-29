import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-date-picker-range',
  templateUrl: './date-picker-range.component.html',
  styleUrl: './date-picker-range.component.scss',
})
export class DatePickerRangeComponent implements OnInit {
  @Input('leftDate') leftDate!: number;
  @Input('rightDate') rightDate!: number;

  @ViewChild('titleMin') titleMin?: ElementRef;
  @ViewChild('titleMax') titleMax?: ElementRef;

  @ViewChild('sliderRange') sliderRange?: ElementRef;

  @ViewChild('dotLeft') dotLeft?: ElementRef;
  @ViewChild('dotRight') dotRight?: ElementRef;

  @ViewChild('inputLeft') inputLeft?: ElementRef;
  @ViewChild('inputRight') inputRight?: ElementRef;

  years: boolean = true;

  leftDateAfterSetMonth?: number;
  rightDateAfterSetMonth?: number;

  allYears: Array<number> = [];
  allMonths: Array<string> = [];

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    if (!this.leftDate || !this.rightDate) {
      throw Error(
        'Error. Please provide "leftDate" and "rightDate" to "DatePickerRange"'
      );
    }
    const dateFromLeftDate = new Date(this.leftDate);

    this.allYears = Array.from(
      {
        length:
          new Date(this.rightDate - this.leftDate).getFullYear() - 1970 + 1,
      },
      (_, i) =>
        i
          ? new Date(
              dateFromLeftDate.setFullYear(dateFromLeftDate.getFullYear() + 1)
            ).getFullYear()
          : dateFromLeftDate.getFullYear()
    );
  }

  setLeftValue(event: Event) {
    let leftValue = this.inputLeft?.nativeElement.value;

    const min = parseInt(this.inputLeft?.nativeElement.min);
    const max = parseInt(this.inputLeft?.nativeElement.max);

    leftValue = Math.min(
      parseInt(leftValue),
      parseInt(this.inputRight?.nativeElement.value) - 1
    );

    const percent = ((leftValue - min) / (max - min)) * 100;

    this.sliderRange!.nativeElement.style.left = percent + '%';
    this.dotLeft!.nativeElement.style.left = percent + '%';
    this.titleMin!.nativeElement.textContent = this.datePipe.transform(
      leftValue,
      'MMMM yyyy'
    );
  }

  setRightValue(event: Event) {
    event.preventDefault();
    let rightValue = this.inputRight?.nativeElement.value;

    const min = parseInt(this.inputRight?.nativeElement.min);
    const max = parseInt(this.inputRight?.nativeElement.max);

    rightValue = Math.max(
      parseInt(rightValue),
      parseInt(this.inputLeft?.nativeElement.value) + 1
    );

    const percent = ((rightValue - min) / (max - min)) * 100;

    this.sliderRange!.nativeElement.style.right = 100 - percent + '%';
    this.dotRight!.nativeElement.style.right = 100 - percent + '%';
    this.titleMax!.nativeElement.textContent = this.datePipe.transform(
      rightValue,
      'MMMM yyyy'
    );
  }

  setYears(): void {
    this.years = true;
    this.allMonths = [];
    this.leftDateAfterSetMonth = undefined;
    this.rightDateAfterSetMonth = undefined;

    this.reset();
  }

  setMonths(): void {
    if (!this.years) {
      this.setYears();
      return;
    }
    this.years = false;
    const currentLeftDate = parseInt(this.inputLeft?.nativeElement.value);
    const currentRightDate = parseInt(this.inputRight?.nativeElement.value);

    this.leftDateAfterSetMonth = currentLeftDate;
    this.rightDateAfterSetMonth = currentRightDate;

    const currentYearFromLeftDate = new Date(
      new Date(currentLeftDate).getFullYear(),
      0,
      1
    );
    const currentYearFromRightDate = new Date(currentRightDate);
    let month: Date;
    this.allMonths = Array.from(
      {
        length:
          (currentYearFromRightDate.getFullYear() -
            currentYearFromLeftDate.getFullYear() +
            1) *
          12,
      },
      (_, i) => {
        month = new Date(
          currentYearFromLeftDate.setMonth(
            currentYearFromLeftDate.getMonth() + 1
          )
        );
        if (!i) {
          return currentYearFromLeftDate.getFullYear().toString();
        }
        if (currentYearFromLeftDate.getMonth() === 0) {
          return currentYearFromLeftDate.getFullYear().toString();
        } else {
          return this.datePipe.transform(month, 'MMMM') as string;
        }
      }
    );

    this.reset();
  }

  reset(): void {
    const currentRightDate = parseInt(this.inputRight?.nativeElement.value);

    this.sliderRange!.nativeElement.style.right = 0 + '%';
    this.sliderRange!.nativeElement.style.left = 0 + '%';
    this.dotRight!.nativeElement.style.right = 0 + '%';
    this.dotLeft!.nativeElement.style.left = 0 + '%';
    this.titleMax!.nativeElement.textContent = this.datePipe.transform(
      currentRightDate,
      'MMMM yyyy'
    );
  }

  getTooltipString(type: 'left' | 'right'): string {
    switch (type) {
      case 'left':
        if (this.years) {
          return this.datePipe.transform(this.leftDate, 'MMMM yyyy') as string;
        }
        return this.datePipe.transform(this.leftDateAfterSetMonth) as string;
      case 'right':
        if (this.years) {
          return this.datePipe.transform(this.rightDate, 'MMMM yyyy') as string;
        }
        return this.datePipe.transform(this.rightDateAfterSetMonth) as string;
    }
  }
}
