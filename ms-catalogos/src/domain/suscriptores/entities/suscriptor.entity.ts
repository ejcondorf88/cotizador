import { v4 as uuidv4 } from 'uuid';

export interface CreateSuscriptorProps {
  codigo: string;
  nombre: string;
  tipo?: string;
  activo?: boolean;
}

export class Suscriptor {
  constructor(
    public readonly id: string,
    public codigo: string,
    public nombre: string,
    public tipo: string | null,
    public activo: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(props: CreateSuscriptorProps): Suscriptor {
    const now = new Date();
    return new Suscriptor(
      uuidv4(),
      props.codigo,
      props.nombre,
      props.tipo ?? null,
      props.activo ?? true,
      now,
      now,
    );
  }

  update(props: Partial<CreateSuscriptorProps>): void {
    if (props.codigo !== undefined) this.codigo = props.codigo;
    if (props.nombre !== undefined) this.nombre = props.nombre;
    if (props.tipo !== undefined) this.tipo = props.tipo ?? null;
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
