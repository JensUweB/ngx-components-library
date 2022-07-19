import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent } from './multi-select.component';

@NgModule({
  declarations: [MultiSelectComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [MultiSelectComponent],
})
export class MultiSelectModule {}
