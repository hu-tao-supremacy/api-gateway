import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  isVerified: boolean;

  @Column({ nullable: true })
  abbreviation?: string;

  @Column({ nullable: true })
  advisor?: string;

  @Column({ nullable: true })
  associatedFaculty?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  facebookPage?: string;

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  lineOfficialAccount?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  contactFullName?: string;

  @Column({ nullable: true })
  contactEmail?: string;

  @Column({ nullable: true })
  contactPhoneNumber?: string;

  @Column({ nullable: true })
  contactLineId?: string;

  @Column({ nullable: true })
  profilePictureUrl?: string;

  @Column({ nullable: true })
  profilePictureHash?: string;
}
