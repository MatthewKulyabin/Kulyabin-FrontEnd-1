import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DatePickerRangeComponent } from './date-picker-range/date-picker-range.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [DatePickerRangeComponent, ModalComponent],
  imports: [CommonModule],
  providers: [DatePipe],
  exports: [DatePickerRangeComponent, ModalComponent],
})
export class ShareModule {}
