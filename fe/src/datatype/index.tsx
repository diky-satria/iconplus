export type TErrors = {
  value?: string;
  msg: string;
  param: string;
  location?: string;
};

export type TUnit = {
  id: string;
  officeName: string;
  createdAt: string;
};
export type TUnitOption = {
  value: string;
  label: string;
};

export type TRoom = {
  createdAt: string;
  officeId: string;
  officeName: string;
  roomName: string;
  capacity: number;
  id: string;
};
export type TRoomOption = {
  value: string;
  label: string;
  kapasitas: number;
};

export type TKonsumsi = {
  createdAt: string;
  name: string;
  maxPrice: number;
  id: string;
};
export type TKonsumsiOption = {
  id: string;
  value: string;
  label: string;
  harga: number;
};
