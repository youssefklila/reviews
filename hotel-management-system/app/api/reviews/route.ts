import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define the Zod schema for review submission
const reviewSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required." }),
  nationality: z.string().optional().nullable(),
  age: z.number().int().positive().optional().nullable(),
  room_number: z.string().optional().nullable(),
  overall_rating: z.number().int().min(1).max(10, { message: "Overall rating must be between 1 and 10." }),
  recommend: z.boolean().optional().nullable(),
  visit_again: z.boolean().optional().nullable(),
  services: z.record(z.string(), z.number().int().min(1).max(5)).optional().nullable(), // e.g., {"wifi": 5, "food": 4}
  suggestions: z.string().optional().nullable(),
  created_by: z.string().uuid().optional().nullable(), // Assuming UUID if provided by a logged-in user
});

// Type alias for the review data
export type ReviewSubmissionData = z.infer<typeof reviewSchema>;

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    // Validate the request body against the schema
    const validationResult = reviewSchema.safeParse(requestBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: 'Invalid submission data.',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // At this point, validationResult.data contains the validated data
    const validatedReviewData: ReviewSubmissionData = validationResult.data;

    // TODO: Enhance created_by handling if user is authenticated
    // For example, extract user ID from verified JWT token if this route is protected
    // For now, it relies on the client sending it, or it remains null for anonymous reviews.

    console.log('Validated review data:', validatedReviewData);

    // TODO: Save review to database
    // Example: const savedReview = await prisma.review.create({ data: validatedReviewData });
    // For now, we simulate the save and return the validated data as if it were saved.

    const simulatedSavedReview = {
      id: crypto.randomUUID(), // Simulate a generated ID
      submitted_at: new Date().toISOString(), // Simulate a generated timestamp
      ...validatedReviewData,
    };

    return NextResponse.json(
      {
        message: 'Review submitted successfully!',
        review: simulatedSavedReview,
      },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    // Handle JSON parsing errors or other unexpected errors
    if (error instanceof SyntaxError) { // Caused by malformed JSON
      return NextResponse.json({ message: 'Invalid JSON format in request body.' }, { status: 400 });
    }
    console.error('Error submitting review:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
