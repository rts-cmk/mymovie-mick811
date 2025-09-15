import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StarIcon, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchNowPlayingMovies, getImageUrl } from "@/lib/api";
import type { Movie } from "@/types/api";

const MovieCard = ({ movie }: { movie: Movie }) => (
    <figure className="shrink-0 md:shrink">
        <div className="overflow-hidden rounded-md">
            <img
                src={movie.poster_path ? getImageUrl(movie.poster_path) : "https://placehold.co/300x400"}
                alt={`${movie.title} poster`}
                className="aspect-[3/4] h-fit w-fit object-cover"
                width={300}
                height={400}
            />
        </div>
        <figcaption className="pt-2 text-left">
            <div className="font-medium truncate max-w-[200px]" title={movie.title}>
                {movie.title}
            </div>
            <span className="text-muted-foreground text-xs flex items-center gap-1">
                <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {movie.vote_average.toFixed(1)}/10 IMDb
            </span>
        </figcaption>
    </figure>
);

const LoadingCard = () => (
    <figure className="shrink-0 md:shrink animate-pulse">
        <div className="overflow-hidden rounded-md bg-muted aspect-[3/4] w-[300px] h-[400px]">
            <div className="w-full h-full bg-muted flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        </div>
        <figcaption className="pt-2 text-left">
            <div className="h-4 bg-muted rounded mb-1"></div>
            <div className="h-3 bg-muted rounded w-20"></div>
        </figcaption>
    </figure>
);

const ErrorState = ({ error }: { error: Error }) => (
    <div className="flex items-center justify-center py-8 text-center">
        <div className="text-muted-foreground">
            <p className="font-medium">Failed to load movies</p>
            <p className="text-sm">{error.message}</p>
        </div>
    </div>
);

export default function NowShowing() {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ['nowPlayingMovies'],
        queryFn: fetchNowPlayingMovies,
    });

    if (isError && error) {
        return <ErrorState error={error} />;
    }

    const movies = data?.results || [];
    const displayMovies = isLoading 
        ? Array.from({ length: 8 }).map((_, index) => <LoadingCard key={index} />)
        : movies.slice(0, 8).map((movie) => <MovieCard key={movie.id} movie={movie} />);

    return (
        <>
            <div className="md:hidden">
                <ScrollArea className="w-full rounded-md whitespace-nowrap">
                    <div className="flex w-max space-x-4 py-4">
                        {displayMovies}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            <div className="hidden md:grid md:grid-cols-4 gap-4 py-4">
                {displayMovies}
            </div>
        </>
    )
}