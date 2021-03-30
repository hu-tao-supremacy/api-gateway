import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  googleMapUrl: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  travelInformationImageUrl?: string;

  @Column({ nullable: true })
  travelInformationImageHash?: string;
}
