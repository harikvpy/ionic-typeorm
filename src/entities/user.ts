import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from 'typeorm';
import { ChatSession } from './chat-session';

@Entity('user')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @OneToMany(() => ChatSession, chat => chat.creator)
    chatSessions: ChatSession[];
}
