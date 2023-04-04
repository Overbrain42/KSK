import { CellTypes, ModalTypes } from './app.constants';

export interface tableData {
  rowElements: number;
  colElements: number;
  cellData: cellData[];
}

export interface cellData {
  id?: string;
  name?: string;
  connections?: string[];
  row: number;
  index: number;
  type: CellTypes;
}

export interface DialogData {
  type: ModalTypes
}

export interface DialogConfig {
  data?: any;
}
