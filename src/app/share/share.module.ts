import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DatePickerRangeComponent } from './date-picker-range/date-picker-range.component';

@NgModule({
  declarations: [DatePickerRangeComponent],
  imports: [CommonModule],
  providers: [DatePipe],
  exports: [DatePickerRangeComponent],
})
export class ShareModule {}
