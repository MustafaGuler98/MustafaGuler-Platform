'use client';

import { useParams, useRouter } from 'next/navigation';
import { movieAdminService } from '@/services/admin/archivesAdminService';
import { useResourceById, useUpdateResource, useDeleteResource } from '@/hooks/admin';
import { LoadingState } from '@/components/admin/layout';
import { CyberConfirmationModal } from '@/components/ui/cyber/CyberConfirmationModal';
import { MovieForm } from '@/components/admin/archives/forms/MovieForm';
import type { Movie, UpdateMovie } from '@/types/archives';
import { useState } from 'react';

export default function EditMoviePage() {
    const router = useRouter();
    const { id } = useParams() as { id: string };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data: movie, isLoading } = useResourceById<Movie>(
        'archives-movie',
        id,
        (id) => movieAdminService.getById(id)
    );

    const updateMutation = useUpdateResource<Movie>(
        'archives-movies',
        (id, data) => movieAdminService.updateMovie(id, data as UpdateMovie),
        { invalidateQueries: ['archives-movies', 'archives-movie'] }
    );

    const deleteMutation = useDeleteResource(
        'archives-movies',
        (id) => movieAdminService.delete(id),
        { onSuccessRedirect: '/admin/archives/movies' }
    );

    if (isLoading) return <LoadingState />;

    const handleSubmit = (data: UpdateMovie) => {
        updateMutation.mutate({ id, data });
    };

    const handleDelete = () => setIsDeleteModalOpen(true);

    const confirmDelete = () => {
        deleteMutation.mutate(id);
    };

    return (
        <>
            <MovieForm
                initialData={movie}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                isPending={updateMutation.isPending}
            />

            <CyberConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="DELETE MOVIE"
                message={`Are you sure you want to delete "${movie?.title}"? This action cannot be undone.`}
            />
        </>
    );
}
