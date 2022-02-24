import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from 'typeorm';
import { User } from './user';

@Entity('chat_session')
export class ChatSession extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => User, user => user.chatSessions)
    creator: User;
}
