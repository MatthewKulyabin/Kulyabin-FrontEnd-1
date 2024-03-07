import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

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
  monthsLimit: number = 3;

  leftDateAfterSetMonth?: number;
  rightDateAfterSetMonth?: number;

  allYears: Array<number> = [];
  allMonths: Array<string> = [];
  allMonthsAfterResize: Array<string> = [];

  constructor(private datePipe: DatePipe) {
    this.detectMonthsLimit();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.detectMonthsLimit();
    this.getAllYears();
    this.getAllMonthsAccordingWidth();
  }

  detectMonthsLimit(): void {
    if (window.innerWidth <= 1200) {
      this.monthsLimit = 2;
      return;
    }
    this.monthsLimit = 3;
  }

  ngOnInit(): void {
    if (!this.leftDate || !this.rightDate) {
      throw Error(
        'Error. Please provide "leftDate" and "rightDate" to "DatePickerRange"'
      );
    }

    this.getAllYears();
  }

  getAllYears(): void {
    const dateFromLeftDate = new Date(this.leftDate);
    this.allYears = Array.from(
      {
        length:
          new Date(this.rightDate - this.leftDate).getFullYear() - 1970 + 1,
      },
      (_, i) => {
        return i
          ? new Date(
              dateFromLeftDate.setFullYear(dateFromLeftDate.getFullYear() + 1)
            ).getFullYear()
          : dateFromLeftDate.getFullYear();
      }
    );

    this.getAllYearsAccordingWidth();
  }

  getAllYearsAccordingWidth(): void {
    if (this.allYears.length < 10) return;
    if (window.innerWidth <= 850) {
      this.allYears = this.allYears.filter((year, i) => {
        if (!i) return year;
        if (i === this.allYears.length - 1) return year;
        if (i && i % 3 === 0) return year;
        return;
      });
    }

    if (window.innerWidth <= 1200) {
      this.allYears = this.allYears.filter((year, i) => {
        if (!i) return year;
        if (i && i % 2 === 0) return year;
        return;
      });
    }
  }

  getAllMonthsAccordingWidth(): void {
    if (this.years) return;
    if (window.innerWidth > 1200) {
      this.allMonthsAfterResize = this.allMonths;
      return;
    }

    if (window.innerWidth <= 850) {
      this.allMonthsAfterResize = this.allMonths;
      this.allMonthsAfterResize = this.allMonths.filter((month, i) => {
        if (!i) return month;
        if (i === this.allMonths.length - 1) return month;
        if (this.allMonths.length > 13) {
          if (i % 6 === 0) return month;
        } else if (i % 3 === 0) return month;
        return;
      });
      return;
    }

    if (window.innerWidth <= 1200) {
      this.allMonthsAfterResize = this.allMonths;
      this.allMonthsAfterResize = this.allMonths.filter((month, i) => {
        if (!i) return month;
        if (i === this.allMonths.length - 1) return month;
        if (i && i % 2 === 0) return month;
        return;
      });
      return;
    }
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
    if (this.years) return;
    this.years = true;
    this.allMonths = [];
    this.allMonthsAfterResize = [];
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
    const currentLeftDate = new Date(
      parseInt(this.inputLeft?.nativeElement.value)
    ).setFullYear(
      new Date(parseInt(this.inputLeft?.nativeElement.value)).getFullYear(),
      0,
      1
    );

    let currentRightDate = new Date(
      parseInt(this.inputRight?.nativeElement.value)
    ).setFullYear(
      new Date(parseInt(this.inputRight?.nativeElement.value)).getFullYear() +
        1,
      0,
      1
    );

    if (
      new Date(currentRightDate - currentLeftDate).getFullYear() - 1970 ===
      0
    ) {
      currentRightDate = new Date(currentLeftDate).setFullYear(
        new Date(currentLeftDate).getFullYear() + 1
      );
    } else if (window.innerWidth > 1200) {
      if (
        new Date(currentRightDate - currentLeftDate).getFullYear() - 1970 >=
        3
      ) {
        console.log('HALLO');
        currentRightDate = new Date(currentLeftDate).setFullYear(
          new Date(currentLeftDate).getFullYear() + 2
        );
      }
    } else if (window.innerWidth <= 850) {
      currentRightDate = new Date(currentLeftDate).setFullYear(
        new Date(currentLeftDate).getFullYear() + 1
      );
    } else if (window.innerWidth <= 1200) {
      if (
        new Date(currentRightDate - currentLeftDate).getFullYear() - 1970 > 2 ||
        new Date(currentRightDate - currentLeftDate).getFullYear() - 1970 === 0
      ) {
        currentRightDate = new Date(currentLeftDate).setFullYear(
          new Date(currentLeftDate).getFullYear() + 2
        );
      }
    }

    this.leftDateAfterSetMonth = currentLeftDate;
    this.rightDateAfterSetMonth = currentRightDate;

    const currentYearFromLeftDate = new Date(
      new Date(currentLeftDate).getFullYear(),
      0,
      1
    );
    const currentYearFromRightDate = new Date(currentRightDate);

    this.allMonths = Array.from(
      {
        length:
          (currentYearFromRightDate.getFullYear() -
            currentYearFromLeftDate.getFullYear()) *
            12 +
          1,
      },
      (_, i): string => {
        let result: Date = currentYearFromLeftDate;
        if (!i) {
          return currentYearFromLeftDate.getFullYear().toString();
        } else {
          result = new Date(
            currentYearFromLeftDate.setMonth(
              currentYearFromLeftDate.getMonth() + 1
            )
          );
        }
        if (result.getMonth() === 0) {
          return result.getFullYear().toString();
        }
        return this.datePipe.transform(result, 'MMM') as string;
      }
    );

    this.allMonthsAfterResize = this.allMonths;
    this.getAllMonthsAccordingWidth();

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
}
