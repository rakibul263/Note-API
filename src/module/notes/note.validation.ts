import { z } from "zod";

const createNoteValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        error: "Title must be a string.",
      })
      .min(1, "title is required"),
    content: z
      .string({
        error: "Content must be a string",
      })
      .min(1, "Content is required"),
  }),
});

const updateNoteValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
  }),
});

export const NoteValidation = {
  createNoteValidationSchema,
  updateNoteValidationSchema,
};
