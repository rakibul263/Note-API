export interface CreateNotePayload {
  title: string;
  content: string;
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
}