


interface IParticipantRead {
    userId: string;
    lastReadAt: Date;
}
interface IMessageEntry {
    _id: string;
    text: string;
    attachments?: string[];
    author: string;
    readBy: string[];
    createdAt: Date;
}
export interface IMessage extends Document {
    _id: string;
    participants: string[];
    projects: string[];
    messages: IMessageEntry[];
    participantReads: IParticipantRead[];
    createdAt: Date;
    updatedAt: Date;
}