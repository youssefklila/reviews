'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input"; // shadcn/ui Input
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // shadcn/ui Table

interface Review {
  id: string;
  full_name: string;
  overall_rating: number;
  suggestions: string;
  room_number?: string | null;
  nationality?: string | null;
  submitted_at?: string; // Assuming it comes as ISO string
}

export default function ReviewsManagementPage() {
  const { t } = useTranslation('common');

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [ratingFilter, setRatingFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (ratingFilter) params.append('overall_rating', ratingFilter);
    if (roomFilter) params.append('room_number', roomFilter);
    if (nationalityFilter) params.append('nationality', nationalityFilter);
    if (searchQuery) params.append('q', searchQuery);

    try {
      const response = await fetch(`/api/reviews?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Error fetching reviews: ${response.statusText}`);
      }
      const data = await response.json();
      setReviews(data.data || []); // Assuming API returns data in data.data
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]); // Clear reviews on error or show error message
    } finally {
      setIsLoading(false);
    }
  }, [ratingFilter, roomFilter, nationalityFilter, searchQuery]);

  useEffect(() => {
    fetchReviews(); // Fetch on initial load
  }, [fetchReviews]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReviews();
  };

  const clearAllFilters = () => {
    setRatingFilter('');
    setRoomFilter('');
    setNationalityFilter('');
    setSearchQuery('');
    // Optionally, trigger fetchReviews immediately after clearing,
    // or let user click "Apply Filters" again. For now, explicit apply.
    // To trigger immediately: (add fetchReviews to dependency array of a new useEffect or call it here)
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{t('reviewsManagement')}</h1> {/* Assuming 'reviewsManagement' key exists */}

      <form onSubmit={handleFilterSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">{t('searchReviews')}</label>
            <Input
              id="searchQuery"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchReviews')}
            />
          </div>
          <div>
            <label htmlFor="ratingFilter" className="block text-sm font-medium text-gray-700 mb-1">{t('filterByRating')}</label>
            <Input
              id="ratingFilter"
              type="number"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              placeholder="e.g., 5"
              min="1"
              max="10"
            />
          </div>
          <div>
            <label htmlFor="roomFilter" className="block text-sm font-medium text-gray-700 mb-1">{t('filterByRoom')}</label>
            <Input
              id="roomFilter"
              type="text"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              placeholder="e.g., 101"
            />
          </div>
          <div>
            <label htmlFor="nationalityFilter" className="block text-sm font-medium text-gray-700 mb-1">{t('nationality')}</label>
            <Input
              id="nationalityFilter"
              type="text"
              value={nationalityFilter}
              onChange={(e) => setNationalityFilter(e.target.value)}
              placeholder="e.g., US, CA"
            />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('loading') : t('applyFilters')}
          </Button>
          <Button type="button" variant="outline" onClick={clearAllFilters} disabled={isLoading}>
            {t('clearFilters')}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <p className="text-center py-4">{t('loading')}</p>
      ) : (
        reviews.length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('fullName')}</TableHead>
                  <TableHead>{t('rating')}</TableHead>
                  <TableHead>{t('roomNumber')}</TableHead>
                  <TableHead>{t('nationality')}</TableHead>
                  <TableHead className="w-1/3">{t('suggestions')}</TableHead>
                  {/* <TableHead>{t('actions')}</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.full_name}</TableCell>
                    <TableCell>{review.overall_rating} / 10</TableCell>
                    <TableCell>{review.room_number || 'N/A'}</TableCell>
                    <TableCell>{review.nationality || 'N/A'}</TableCell>
                    <TableCell className="truncate max-w-xs">{review.suggestions || 'N/A'}</TableCell>
                    {/* <TableCell> <Button variant="outline" size="sm">View</Button> </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500">{t('noReviewsFound')}</p>
          </div>
        )
      )}
    </div>
  );
}
