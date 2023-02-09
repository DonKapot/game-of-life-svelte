export type Entity = {
  x: number;
  y: number;
  life: boolean;
};

export type EntityConfig = {
  [key: string | number]: any;
  life: boolean;
};

export type twoDimensionalWorld = Entity[][];
