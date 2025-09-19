import { Button } from '@/components/ui/button'
import { getMovieData } from '@/lib/fn'
import { DetailsResponse, Movie } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { formatRuntime } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['movieData'],
        queryFn: () => getMovieData(),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 2, // 2 minutes
        retry: 3,
    })

    // gider ik gøre noget specielt hvis der er en fejl
    if (error) throw new Error(error.message)
    if (isLoading || !data) return <div>Loading...</div>

    const { nowPlaying, popular } = data

    return (
        <div className='md:max-w-5xl md:mx-auto py-8'>
            <header className='flex justify-between items-center px-4' role='banner'>
                <nav role='navigation' aria-label='Main navigation' className='md:hidden'>
                    <Button
                        type='button'
                        variant='ghost'
                        aria-label='open navigation menu'
                        className='p-1'
                        tabIndex={0}
                    >
                        <img
                            src='/assets/Menu.svg'
                            alt='menu icon'
                            className='w-6 h-6 brightness-0 dark:invert'
                            role='img'
                            aria-hidden='true'
                        />
                    </Button>
                </nav>
                <h1 className='text-base md:text-2xl font-semibold text-black dark:text-white' role='heading' aria-level={1}>
                    MyMovies
                </h1>
                <ThemeToggle />
            </header>
            <main className='space-y-5 px-4 pt-4'>
                <section className='space-y-4'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-lg md:text-xl font-semibold text-black dark:text-primary'>Now Playing</h2>
                        <Link to="/movie/more/$" params={{ _splat: 'now-playing' }} search={{ page: 1 }}>
                            <Button variant='ghost' className='text-sm rounded-full border shadow-xs hover:bg-accent text-black dark:text-white dark:bg-input/30 dark:border-input dark:hover:bg-input/50'>
                                See more
                            </Button>
                        </Link>
                    </div>
                    <div className='flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-x-visible'>
                        {nowPlaying.slice(0, 8).map((movie: Movie) => (
                            <Link to="/movie/$" params={{ _splat: movie.id.toString() }} key={movie.id} className='flex-shrink-0 w-[calc(50%-0.5rem)] md:w-auto'>
                                <figure className='space-y-1'>
                                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className='w-full object-cover md:w-fit' />
                                    <figcaption className='text-sm font-bold text-black dark:text-white text-balance space-y-3'>
                                        {movie.title}
                                        <p className='flex gap-x-1 items-center mt-3'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" className='fill-yellow-500 text-yellow-500' /></svg>
                                            <span className='text-xs font-medium text-muted-foreground'>{movie.vote_average.toFixed(1)}/10 IMDb</span>
                                        </p>
                                    </figcaption>
                                </figure>
                            </Link>
                        ))}
                    </div>
                </section>

                <div className='md:border-t border-border my-8'></div>

                <section className='space-y-4'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-lg md:text-xl font-semibold text-black dark:text-primary'>Popular</h2>
                        <Link to="/movie/more/$" params={{ _splat: 'popular' }} search={{ page: 1 }}>
                            <Button variant='ghost' className='text-sm rounded-full border shadow-xs hover:bg-accent text-black dark:text-white dark:bg-input/30 dark:border-input dark:hover:bg-input/50'>
                                See more
                            </Button>
                        </Link>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {popular.map((movie: DetailsResponse) => (
                            <Link to="/movie/$" params={{ _splat: movie.id.toString() }} key={movie.id}>
                                <div className='grid grid-cols-[auto_1fr] gap-4'>
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className='w-24 h-36 object-cover rounded-md'
                                    />
                                    <div className='space-y-2'>
                                        <h3 className='text-lg font-bold text-black dark:text-white leading-tight text-bala'>
                                            {movie.title}
                                        </h3>
                                        <div className='flex gap-x-4 items-center'>
                                            <div className='flex gap-x-1 items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" className='fill-yellow-500 text-yellow-500' /></svg>
                                                <span className='text-sm font-medium text-muted-foreground'>{movie.vote_average.toFixed(1)}/10 IMDb</span>
                                            </div>
                                        </div>
                                        {movie.genres && movie.genres.length > 0 && (
                                            <div className='flex flex-wrap gap-2'>
                                                {movie.genres.slice(0, 3).map((genre) => (
                                                    <span key={genre.id} className='text-xs font-medium bg-[#DBE3FF] text-[#88A4E8] px-2 py-1 rounded-full uppercase'>
                                                        {genre.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {movie.runtime && (
                                            <div className='flex gap-x-1 items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
                                                <span className='text-sm font-medium text-muted-foreground'>{formatRuntime(movie.runtime)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}