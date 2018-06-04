export interface IProduct {
  id: number;
  parentId: number;
  title: string;
  weight?: number;
  expanded: boolean;
  type?: string;
  children?: IProduct[];
  visible?: boolean;
}
