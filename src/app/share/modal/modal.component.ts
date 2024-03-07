import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @ViewChild('myModal') myModal!: ElementRef;

  closeModal(): void {
    this.myModal.nativeElement.style.display = 'none';
  }
}
