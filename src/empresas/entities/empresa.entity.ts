import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('empresas')
export class Empresa {
  @PrimaryColumn({ type: 'varchar' })
  codigo_proveedor: string;

  @Column({ type: 'varchar', nullable: true })
  rif: string;

  @Column({ type: 'varchar', nullable: true })
  nombre: string;
}
