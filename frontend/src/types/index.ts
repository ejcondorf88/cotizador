export interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}

// Re-export coverage types for convenience
export * from './coverage';
export * from './quote';
export * from './property';
