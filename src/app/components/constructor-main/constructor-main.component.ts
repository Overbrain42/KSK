import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { cellData, tableData } from '../../static/interfaces';
import { CellTypes, defaultModalConfig, ModalTypes, tableDataName } from '../../static/app.constants';
import { UUID } from 'angular2-uuid';
import { Dialog } from '@angular/cdk/dialog';
import { CellModalComponent } from '../cell-modal/cell-modal.component';

declare var LeaderLine: any;

@Component({
  selector: 'app-constructor-main',
  templateUrl: './constructor-main.component.html',
  styleUrls: ['./constructor-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConstructorMainComponent implements AfterViewInit, AfterViewChecked {
  @ViewChildren("cellEl", { read: ElementRef }) cellEl!: QueryList<ElementRef>;
  data: tableData = {rowElements: 2, colElements: 2, cellData: []};
  source: cellData[][] = [[], []];
  cellTypes = CellTypes;
  lines:any[] = [];
  activeSelection: cellData | null = null;

  constructor(
    public dialog: Dialog,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit() {
    let tableData = localStorage.getItem(tableDataName);
    if (!tableData) {
      localStorage.setItem(tableDataName, JSON.stringify(this.data));
    } else {
      this.data = JSON.parse(tableData);
    }
    this.parseTable();
  }

  ngAfterViewChecked() {
  }

  parseTable() {
    let sourceArray: cellData[][] = [];
    for (let row = 1; row <= this.data.rowElements; row++) {
      const index = row - 1;
      const rowData = this.data.cellData.filter(cell => cell.row === row).sort((a, b) => a.index - b.index);
      sourceArray[index] = rowData;
      if (sourceArray[index].length < this.data.colElements) {
        sourceArray[index].push({type: CellTypes.AddBtn, row: row, index: sourceArray[index].length})
      }
    }
    this.source = sourceArray;
    this.cdr.detectChanges();
    this.lines.forEach(line => line.remove());
    this.lines = [];
    const config = {
      path: 'straight', endPlug: 'behind', endSocket: 'top'
    }
    this.data.cellData.forEach(cell => {
      cell.connections?.forEach(connection => {
        const element = this.cellEl.find(el => el.nativeElement.id === cell.id)?.nativeElement;
        const connectedElement = this.cellEl.find(el => el.nativeElement.id === connection)?.nativeElement;
        this.lines.push(new LeaderLine(element, connectedElement, config));
      })
    })
    this.cdr.detectChanges();
  }

  onRightClick(event: Event, cell: cellData) {
    event.preventDefault();
    if (this.activeSelection) {
      if (Math.abs(this.activeSelection.row - cell.row) === 1) {
        this.activeSelection.row - cell.row === -1 ? this.toggleCells(this.activeSelection, cell) : this.toggleCells(cell, this.activeSelection);
        this.activeSelection = null;
      }
    } else {
      this.activeSelection = cell;
    }
    this.cdr.detectChanges();
  }

  toggleCells(mainCell: cellData, relatedCell: cellData) {
    if (mainCell.connections?.includes(relatedCell.id as string)) {
      mainCell.connections?.splice(mainCell.connections?.indexOf(relatedCell.id as string), 1);
    } else {
      mainCell.connections?.push(relatedCell.id as string);
    }
    localStorage.setItem(tableDataName, JSON.stringify(this.data));
    this.parseTable();
  }

  addCell(row: number) {
    const dialogRef = this.dialog.open(CellModalComponent, {...defaultModalConfig, data: {type: ModalTypes.New}});

    dialogRef.closed.subscribe(res => {
      if (res) {
        const cell: cellData = {id: UUID.UUID(), name: res as string, row: row, index: this.source[row -1].length, type: CellTypes.Cell, connections: []};
        this.data.cellData.push(cell);
        localStorage.setItem(tableDataName, JSON.stringify(this.data));
        this.parseTable();
      }
    })
  }

  addCol() {
    this.data.colElements+=1;
    localStorage.setItem(tableDataName, JSON.stringify(this.data));
    this.parseTable();
  }

  addRow() {
    this.data.rowElements+=1;
    localStorage.setItem(tableDataName, JSON.stringify(this.data));
    this.parseTable();
  }

  drop(event: CdkDragDrop<string[]>, row: cellData[]) {
    const elementDragged = this.data.cellData.find(item => item.id === row[event.previousIndex].id);
    if (elementDragged) {
      elementDragged.index = event.currentIndex;
    }
    const elementDroppedOn = this.data.cellData.find(item => item.id === row[event.currentIndex].id);
    if (elementDroppedOn) {
      elementDroppedOn.index = event.previousIndex;
    }
    localStorage.setItem(tableDataName, JSON.stringify(this.data));
    this.parseTable();
  }

}
