export enum DeviceType {
  XR_HEADSET = 'XR_HEADSET',
  MOBILE = 'MOBILE',
  WATCH = 'WATCH',
  MONITOR = 'MONITOR',
  HEADPHONE = 'HEADPHONE',
  PUBLICATION = 'PUBLICATION'
}

export interface Project {
  id: string;
  title: string;
  category: string;
  deviceType: DeviceType;

  details: string; // Static detailed description
  color: string;
  position: [number, number, number];
}

// Screen-space rectangle used to pass 3D object projections to 2D text layout
export type ScreenRect = {
  x: number; // left edge in canvas CSS pixels
  y: number; // top edge in canvas CSS pixels
  w: number;
  h: number;
};

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  image: string;
  year: string;
}
