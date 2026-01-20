'use client';

import { movieAdminService } from '@/services/admin/archivesAdminService';
import { useCreateResource } from '@/hooks/admin';
import { MovieForm } from '@/components/admin/archives/forms/MovieForm';
import type { Movie, CreateMovie } from '@/types/archives';

export default function CreateMoviePage() {

    const createMutation = useCreateResource<Movie, CreateMovie>(
        'archives-movies',
        (data) => movieAdminService.createMovie(data),
        {
            invalidateQueries: ['archives-movies', 'archives-movie'],
            onSuccessRedirect: (data) => `/admin/archives/movies/${data.id}`
        }
    );

    const handleSubmit = (data: any) => {
        createMutation.mutate(data as CreateMovie);
    };

    return (
        <MovieForm
            onSubmit={handleSubmit}
            isPending={createMutation.isPending}
            isNewMode={true}
        />
    );
}
