import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPlaying } from "@/lib/api";
import type { Movie } from "@/types/api";
import { Link } from "@tanstack/react-router";

export function MovieCard({
    movie,
}: {
    movie: Movie,
}) {
    return (
        <Link to="/movie/$" params={{ _splat: encodeURIComponent(movie.id) }}>
            <figure className="shrink-0 md:shrink">
                <div className="overflow-hidden rounded-md">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={`${movie.title} poster`}
                        className="aspect-[3/4] h-fit w-fit object-cover"
                        width={300}
                        height={400}
                    />
                </div>
                <figcaption className="pt-2 text-left">
                    <div className="font-medium max-w-[200px]" title={movie.title}>
                        {movie.title}
                    </div>
                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                        <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {movie.vote_average.toFixed(1)}/10 IMDb
                    </span>
                </figcaption>
            </figure>
        </Link>
    );
}

export default function NowShowing() {
    const { data, isLoading } = useQuery({
        queryKey: ['nowPlayingMovies'],
        queryFn: getPlaying,
    });

    const movies = data?.results || [];
    const displayMovies = isLoading
        ? Array.from({ length: 8 }).map((_, index) => <div key={index} className="animate-pulse">Loading...</div>)
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