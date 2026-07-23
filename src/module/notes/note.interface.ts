export interface CreateNotePayload {
  title: string;
  content: string;
  userId: number;
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
}