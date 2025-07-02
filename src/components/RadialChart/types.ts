
export interface DataPoint {
  id: number;
  year: number;
  name: string;
  category: string;
  value: number;
  connections?: number[];
  x?: number;
  y?: number;
}
