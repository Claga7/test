
export interface FintechStartup {
  id: number;
  name: string;
  country: string;
  foundingYear: number;
  funding: number; // in millions USD
  x?: number;
  y?: number;
}

export interface ProcessedStartup extends FintechStartup {
  x: number;
  y: number;
  groupSize: number;
}
