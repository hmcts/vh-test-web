import { DeleteData } from './data/delete-data';

export class DeleteModel {
  constructor() {
    this.limit = DeleteData.Limit;
  }

  case_name: string | undefined;
  limit: number | undefined;
}
