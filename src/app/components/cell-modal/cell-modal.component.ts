import { Component, Inject, OnInit } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogData } from '../../static/interfaces';
import { ModalTypes } from '../../static/app.constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cell-modal',
  templateUrl: './cell-modal.component.html',
  styleUrls: ['./cell-modal.component.scss']
})
export class CellModalComponent implements OnInit {
  public new = true;
  public modalForm = new FormGroup({
    name: new FormControl('', Validators.required)
  })

  constructor(
    private dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
    this.new = this.data.type === ModalTypes.New;
  }

  onSubmit() {
    this.close(this.modalForm.get('name')?.value as string)
  }

  close(data?: string) {
    this.dialogRef.close(data);
  }
}
