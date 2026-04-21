import { v4 as uuidv4 } from 'uuid';

export interface CreateGiroProps {
  clave: string;
  descripcion: string;
  sector?: string;
  riesgo?: string;
  activo?: boolean;
}

export class Giro {
  constructor(
    public readonly id: string,
    public clave: string,
    public descripcion: string,
    public sector: string | null,
    public riesgo: string,
    public activo: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(props: CreateGiroProps): Giro {
    const now = new Date();
    return new Giro(
      uuidv4(),
      props.clave,
      props.descripcion,
      props.sector ?? null,
      props.riesgo ?? 'MEDIO',
      props.activo ?? true,
      now,
      now,
    );
  }

  update(props: Partial<CreateGiroProps>): void {
    if (props.clave !== undefined) this.clave = props.clave;
    if (props.descripcion !== undefined) this.descripcion = props.descripcion;
    if (props.sector !== undefined) this.sector = props.sector ?? null;
    if (props.riesgo !== undefined) this.riesgo = props.riesgo;
    if (props.activo !== undefined) this.activo = props.activo;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.activo = false;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.activo = true;
    this.updatedAt = new Date();
  }
}
