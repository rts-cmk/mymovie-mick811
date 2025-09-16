import { getPopular, getDetails } from "@/lib/api";
import { Movie } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { StarIcon, Clock } from "lucide-react";

const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60 // modulo operator; gives the remainder of the division
    return `${hours}h ${mins}m`;
};

export function PopularCard({
    movie,
}: {
    movie: Movie;
}) {
    const { data: movieDetails } = useQuery({
        queryKey: ['movieDetails', movie.id],
        queryFn: () => getDetails(movie.id),
        enabled: !!movie.id,
    });

    const genres = movieDetails?.genres?.slice(0, 3) || [];
    const runtime = movieDetails?.runtime || 0; // default to 0 if runtime is not available

    return (
        <Link to="/movie/$" params={{ _splat: encodeURIComponent(movie.id.toString()) }}>
            <div>
                <div className="flex gap-4 p-4">
                    <div className="flex-shrink-0">
                        <img 
                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                            alt={`${movie.title} poster`} 
                            className="w-20 h-28 object-cover rounded-lg"
                        />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {movie.title}
                        </h3>

                        <div className="flex items-center gap-1 mb-3">
                            <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">
                                {movie.vote_average.toFixed(1)}/10 IMDb
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                            {genres.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="px-3 py-1 bg-[#DBE3FF] text-[#88A4E8] text-xs font-medium rounded-full uppercase"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-1 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{runtime > 0 ? formatRuntime(runtime) : '—'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default function PopularMovies() {
    const { data: moviesData, isLoading } = useQuery({
        queryKey: ['popularMovies'],
        queryFn: getPopular,
    });

    const movies = moviesData?.results || []; // default to empty array if moviesData is not available

    const displayMovies = isLoading
        ? Array.from({ length: 6 }).map((_, index) => <div key={index} className="animate-pulse">Loading...</div>) // default to loading state if isLoading is true
        : movies.slice(0, 6).map((movie) => (
            <PopularCard key={movie.id} movie={movie} />
        ));

    return (
        <div className="grid md:grid-cols-2 space-y-4 py-4">
            {displayMovies}
        </div>
    )
}