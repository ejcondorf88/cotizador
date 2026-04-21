import { v4 as uuidv4 } from 'uuid';

export interface CreateAgenteProps {
  codigo: string;
  nombre: string;
  email?: string;
  telefono?: string;
  oficinaId?: string;
  activo?: boolean;
}

export class Agente {
  constructor(
    public readonly id: string,
    public codigo: string,
    public nombre: string,
    public email: string | null,
    public telefono: string | null,
    public oficinaId: string | null,
    public activo: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(props: CreateAgenteProps): Agente {
    const now = new Date();
    return new Agente(
      uuidv4(),
      props.codigo,
      props.nombre,
      props.email ?? null,
      props.telefono ?? null,
      props.oficinaId ?? null,
      props.activo ?? true,
      now,
      now,
    );
  }

  update(props: Partial<CreateAgenteProps>): void {
    if (props.codigo !== undefined) this.codigo = props.codigo;
    if (props.nombre !== undefined) this.nombre = props.nombre;
    if (props.email !== undefined) this.email = props.email ?? null;
    if (props.telefono !== undefined) this.telefono = props.telefono ?? null;
    if (props.oficinaId !== undefined) this.oficinaId = props.oficinaId ?? null;
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
