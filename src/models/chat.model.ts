export interface Chat {
    id: string;
    messages: Message[];
}

export interface Message {
    id: string;
    from: string;
    text: string;
    date: string;
}