import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiSelectOptions } from './options.interface';

@Component({
  selector: 'ngx-multi-select',
  templateUrl: 'multi-select.component.html',
  styleUrls: ['multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
})
export class MultiSelectComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  /**
   * Holds the current value of the slider
   */
  value: any = null;

  /**
   * Invoked when the model has been changed
   */
  onChange: (_: any) => void = (_: any) => {};

  /**
   * Invoked when the model has been touched
   */
  onTouched: () => void = () => {};

  @Input() data: any[];
  @Input() selected: any[] = [];
  @Input() options: MultiSelectOptions = {
    labelKey: 'title',
    dataKey: 'id',
    maxSelection: -1,
    onlyOneGroupSelectable: false,
  };
  @Input() groupLabels: any;
  @Input() placeholder = 'Please select...';
  @Input() disabled: boolean;

  groups: string[] = [];
  group: string = null;
  showDropDown = false;

  constructor() {}

  ngOnInit() {
    this.initGroups();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.groupBy) {
        this.initGroups();
      }
    }
  }

  /**
   * Method that is invoked on an update of a model.
   */
  updateChanges() {
    this.onChange(this.value);
  }

  ///////////////
  // OVERRIDES //
  ///////////////

  /**
   * Writes a new item to the element.
   * @param value the value
   */
  writeValue(value: number): void {
    this.value = value;
    this.updateChanges();
  }

  /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that should be called when the control receives a blur event.
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  initGroups() {
    if (this.options.groupBy) {
      this.groups = [];
      this.data.forEach((item) => {
        if (!this.groups.some((a) => a === item[this.options.groupBy])) {
          this.groups.push(item[this.options.groupBy]);
          if (!this.group && item[this.options.groupBy]) {
            this.group = item[this.options.groupBy];
          }
        }
      });
    }
    if (this.selected && this.selected.length > 0) {
      this.group = this.selected[0][this.options.groupBy];
    }
  }

  /**
   * Returns an array that contains all items that match the given group
   */
  getByGroup(group: string) {
    return this.data.filter((item) => item[this.options.groupBy] === group);
  }

  /**
   * Item toggle - adds or removes the item based on this.selected
   */
  updateSelection(item) {
    if (
      this.selected.some(
        (a) => a[this.options.dataKey] === item[this.options.dataKey]
      )
    ) {
      this.removeItem(item);
    } else if (
      this.options.maxSelection < 0 ||
      this.selected.length < this.options.maxSelection
    ) {
      item.checked = true;
      this.selected.push(item);
      if (!this.group) {
        this.group = item[this.options.groupBy];
      }
    }
    this.value = this.selected;
    this.onChange(this.value);
  }

  /**
   * Checks if the provided item can be selected or not
   */
  canSelectItem(item) {
    if (this.group && this.options.onlyOneGroupSelectable) {
      return (
        (item[this.options.groupBy] === this.group &&
          ((this.options.maxSelection > 0 &&
            this.selected.length < this.options.maxSelection) ||
            this.options.maxSelection < 0)) ||
        this.isSelected(item)
      );
    }
    // TODO: fix
    // This second condition does not work properly
    return (
      (this.options.maxSelection > 0 &&
        this.selected.length < this.options.maxSelection) ||
      this.isSelected(item) ||
      this.options.maxSelection < 0
    );
  }

  /**
   * Checks if the provided item is in this.selected
   */
  isSelected(item) {
    return this.selected.some(
      (a) => a[this.options.dataKey] === item[this.options.dataKey]
    );
  }

  /**
   * Removes the provided item from this.selected
   */
  removeItem(item) {
    this.selected = this.selected.filter(
      (a) => a[this.options.dataKey] !== item[this.options.dataKey]
    );
    if (this.selected.length === 0) {
      this.group = null;
    }
  }
}
