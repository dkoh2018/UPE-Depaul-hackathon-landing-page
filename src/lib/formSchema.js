import * as z from "zod";

export const registrationSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name is too long."),
    university: z.string().min(1, "Please enter your university."),
    email: z.string().email("Please enter a valid email address."),
    gradYear: z.string().min(1, "Please select your graduation year."),
    track: z.string().min(1, "Please select a track."),
    teamStatus: z.string().min(1, "Please select your team status."),
    teammateDetails: z.string().optional(),
    dietaryRestrictions: z.array(z.string()).optional(),
});
