export type Datum = {
  xValue: Date;
  yValue: number;
  category: string;
};

export type Bounds = {
  height: number;
  innerHeight: number;
  innerWidth: number;
  padding: { top: number; right: number; bottom: number; left: number };
  screenHeight: number;
  screenWidth: number;
  width: number;
};