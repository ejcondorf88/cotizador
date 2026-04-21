import { v4 as uuidv4 } from 'uuid';

export interface CreateOficinaProps {
  codigo: string;
  nombre: string;
  ciudad?: string;
  estado?: string;
  activo?: boolean;
}

export class Oficina {
  constructor(
    public readonly id: string,
    public codigo: string,
    public nombre: string,
    public ciudad: string | null,
    public estado: string | null,
    public activo: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(props: CreateOficinaProps): Oficina {
    const now = new Date();
    return new Oficina(
      uuidv4(),
      props.codigo,
      props.nombre,
      props.ciudad ?? null,
      props.estado ?? null,
      props.activo ?? true,
      now,
      now,
    );
  }

  update(props: Partial<CreateOficinaProps>): void {
    if (props.codigo !== undefined) this.codigo = props.codigo;
    if (props.nombre !== undefined) this.nombre = props.nombre;
    if (props.ciudad !== undefined) this.ciudad = props.ciudad ?? null;
    if (props.estado !== undefined) this.estado = props.estado ?? null;
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
