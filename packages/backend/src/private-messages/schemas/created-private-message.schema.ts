import z from 'zod';

export const createdPrivateMessageSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the created post' }),
});

export type CreatedPrivateMessage = z.infer<typeof createdPrivateMessageSchema>;
