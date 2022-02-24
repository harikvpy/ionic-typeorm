import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';

@Entity('contact')
export class Contact extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;
}
