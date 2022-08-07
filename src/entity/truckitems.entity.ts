import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TruckItemEntity {
  @PrimaryGeneratedColumn({})
  id!: number;

  @Column({ unique: true })
  itemId?: string;

  @Column()
  price?: string;

  @Column()
  title?: string;

  @Column()
  registrationDate?: string;

  @Column()
  productionDate?: string;

  @Column()
  mileage?: string;

  @Column()
  power?: string;
}
