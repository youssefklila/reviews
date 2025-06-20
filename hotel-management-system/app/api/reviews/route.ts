import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define the Zod schema for review submission (POST)
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

// Mock database of reviews for GET simulation
const mockReviews = [
  { id: "uuid1-abc", full_name: "John Doe", overall_rating: 5, suggestions: "Great service and friendly staff!", room_number: "101", nationality: "US" },
  { id: "uuid2-def", full_name: "Jane Smith", overall_rating: 4, suggestions: "The room was clean, but the food could be better.", room_number: "202", nationality: "CA" },
  { id: "uuid3-ghi", full_name: "Peter Jones", overall_rating: 5, suggestions: "Excellent location and amenities.", room_number: "101", nationality: "GB" },
  { id: "uuid4-jkl", full_name: "Alice Wonderland", overall_rating: 3, suggestions: "WiFi was a bit slow. Service was okay.", room_number: "303", nationality: "US" },
  { id: "uuid5-mno", full_name: "Bob The Builder", overall_rating: 5, suggestions: "Everything was perfect, especially the construction of the breakfast buffet.", room_number: " penthouse", nationality: "DE" },
];


export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const overall_rating = searchParams.get('overall_rating');
  const room_number = searchParams.get('room_number');
  const nationality = searchParams.get('nationality');
  const q = searchParams.get('q'); // Search query

  const filters: Record<string, any> = {};
  if (overall_rating) filters.overall_rating = overall_rating;
  if (room_number) filters.room_number = room_number;
  if (nationality) filters.nationality = nationality;
  if (q) filters.q = q;

  console.log('Received GET /api/reviews with filters:', filters);

  // TODO: Fetch reviews from the database.
  // TODO: Apply filters and search query to the database query.
  // For now, simulate filtering on the mock data.
  let filteredReviews = [...mockReviews];

  if (overall_rating) {
    const rating = parseInt(overall_rating, 10);
    if (!isNaN(rating)) {
      filteredReviews = filteredReviews.filter(review => review.overall_rating === rating);
    }
  }
  if (room_number) {
    filteredReviews = filteredReviews.filter(review => review.room_number?.toLowerCase().includes(room_number.toLowerCase()));
  }
  if (nationality) {
    filteredReviews = filteredReviews.filter(review => review.nationality?.toLowerCase() === nationality.toLowerCase());
  }
  if (q) {
    const searchTerm = q.toLowerCase();
    filteredReviews = filteredReviews.filter(review =>
      review.full_name.toLowerCase().includes(searchTerm) ||
      review.suggestions.toLowerCase().includes(searchTerm)
    );
  }

  return NextResponse.json({
    message: "Reviews fetched (simulated)",
    filtersApplied: filters,
    data: filteredReviews,
    count: filteredReviews.length,
  });
}


export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
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

    const validatedReviewData: ReviewSubmissionData = validationResult.data;
    console.log('Validated review data (POST):', validatedReviewData);

    // TODO: Save review to database
    const newReview = {
      id: `uuid${mockReviews.length + 1}-${Math.random().toString(16).slice(2,5)}`, // Simulate new ID
      submitted_at: new Date().toISOString(),
      ...validatedReviewData,
    };
    mockReviews.push(newReview as any); // Add to mock database for simulation

    return NextResponse.json(
      {
        message: 'Review submitted successfully!',
        review: newReview,
      },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON format in request body.' }, { status: 400 });
    }
    console.error('Error submitting review (POST):', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
