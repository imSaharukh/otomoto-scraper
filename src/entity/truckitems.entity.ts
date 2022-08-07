import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TruckItemEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ unique: true, type: "varchar", length: 255 })
  itemId?: string;

  @Column({ type: "varchar", length: 255 })
  price?: string;

  @Column({ type: "varchar", length: 255 })
  title?: string;

  @Column({ type: "varchar", length: 255 })
  registrationDate?: string;

  @Column({ type: "varchar", length: 255 })
  productionDate?: string;

  @Column({ type: "varchar", length: 255 })
  mileage?: string;

  @Column({ type: "varchar", length: 255 })
  power?: string;
}
