import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getMovieDetails } from '@/lib/fn'
import { formatRuntime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Video } from '@/lib/api'
import { ThemeToggle } from '@/components/theme-toggle'

export const Route = createFileRoute('/movie/$')({
  component: RouteComponent,
})

function RouteComponent() {
  const { _splat } = Route.useParams()

  if (!_splat) {
    return <div>Movie ID not found</div>
  }

  const { data: movieDetails, isLoading, error } = useQuery({
    queryKey: ['movieDetails', _splat],
    queryFn: () => getMovieDetails({ data: { movieId: _splat } }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  })

  if (error) throw new Error(error.message)
  if (isLoading || !movieDetails) return <div>Loading movie details...</div>

  return (
    <div className='md:max-w-5xl md:mx-auto md:px-4 md:py-8'>
      {/* Header with theme toggle - Desktop */}
      <header className='hidden md:flex justify-between items-center mb-6'>
        <Link to="/">
          <Button variant="ghost" className='flex items-center gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Movies
          </Button>
        </Link>
        <ThemeToggle />
      </header>

      <div className='grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8'>
        <div className='relative'>
          {/* Mobile navigation */}
          <div className='absolute top-4 left-4 z-10 md:hidden'>
            <Link to="/">
              <Button variant="ghost" size="icon" className="text- rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </Button>
            </Link>
          </div>
          <div className='absolute top-4 right-4 z-10 md:hidden'>
            <div className='rounded-full p-2'>
              <ThemeToggle />
            </div>
          </div>

          <img
            src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
            alt={movieDetails.title}
            className='w-full'
          />
          <div className='absolute inset-0 flex flex-col items-center justify-center md:hidden'>
            <Button
              onClick={() => {
                const trailer = movieDetails.videos?.results?.find(
                  (video) => video.type === 'Trailer' && video.site === 'YouTube'
                )
                if (trailer) {
                  window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')
                }
              }}
              className='bg-white size-16 rounded-full flex items-center justify-center'
              aria-label='Play trailer'
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-black size-8"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </Button>
            <span className='text-white text-base font-medium mt-2'>Play Trailer</span>
          </div>
        </div>

        <div className='space-y-6 px-4'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-black dark:text-white mb-2'>
              {movieDetails.title}
            </h1>
            {movieDetails.tagline && (
              <p className='text-lg text-muted-foreground italic'>
                "{movieDetails.tagline}"
              </p>
            )}
          </div>

          {/* average rating info */}
          <div className='flex flex-wrap gap-4 items-center'>
            <div className='flex gap-x-1 items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star-icon lucide-star">
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" className='fill-yellow-500 text-yellow-500' />
              </svg>
              <span className='font-medium text-muted-foreground'>{movieDetails.vote_average.toFixed(1)}/10 IMDb</span>
            </div>
          </div>

          {/* genres info */}
          {movieDetails.genres && movieDetails.genres.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {movieDetails.genres.map((genre) => (
                <span key={genre.id} className='text-sm font-medium bg-primary text-[#88A4E8] px-3 py-1 rounded-full uppercase'>
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* movie info */}
          <div className='grid grid-cols-3 gap-4 '>
            <div className='flex flex-col gap-x-1'>
              <span className='text-sm text-muted-foreground'>Length:</span>
              <span>{formatRuntime(movieDetails.runtime)}</span>
            </div>
            <div className='flex flex-col gap-x-1'>
              <span className='text-sm text-muted-foreground'>Language:</span>
              <span>{movieDetails.spoken_languages[0]?.english_name}</span>
            </div>
            <div className='flex flex-col gap-x-1'>
              <span className='text-sm text-muted-foreground'>Rating:</span>
              <span>{movieDetails.adult ? 'R' : 'PG'}</span>
            </div>
          </div>

          {/* description hvis det er tilgængeligt */}
          <div>
            <h2 className='text-xl font-semibold mb-3 text-black dark:text-primary'>Description</h2>
            <p className='text-muted-foreground leading-relaxed'>
              {movieDetails.overview}
            </p>
          </div>

          {/* cast hvis det er tilgængeligt */}
          {movieDetails.credits?.cast && movieDetails.credits.cast.length > 0 && (
            <div>
              <div className='flex justify-between items-center mb-3'>
                <h2 className='text-xl font-semibold text-black dark:text-primary'>Cast</h2>
                <Link to='/movie/cast/$' params={{ _splat: movieDetails.id.toString() }}>
                  <Button variant='ghost' className='text-sm rounded-full border shadow-xs hover:bg-accent text-black dark:text-white dark:bg-input/30 dark:border-input dark:hover:bg-input/50'>
                    See more
                  </Button>
                </Link>
              </div>
              <div className='grid grid-cols-4 gap-4'>
                {movieDetails.credits.cast.slice(0, 4).map((actor) => (
                  <div key={actor.id} className='text-center'>
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className='w-full aspect-[2/3] object-cover rounded-lg mb-2'
                      />
                    ) : (
                      <div className='w-full aspect-[2/3] bg-background dark:bg-muted rounded-lg mb-2 flex items-center justify-center'>
                        <span className='text-muted-foreground dark:text-muted-foreground'>No Image</span>
                      </div>
                    )}
                    <p className='text-xs text-black dark:text-primary'>{actor.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* trailer section for desktop */}
      <div className='hidden md:block mt-8 md:max-w-5xl md:mx-auto px-4'>
        <h2 className='text-xl font-semibold mb-6 text-black dark:text-primary'>Trailers</h2>
        <div className='grid grid-cols-2 gap-6'>
          {movieDetails.videos?.results.filter((video: Video) => video.type === 'Trailer').slice(0, 2).map((video: Video) => (
            <div key={video.id} className='bg-background dark:bg-muted/30 rounded-xl p-4 shadow-sm border dark:border-input/50'>
              <div className='aspect-video w-full rounded-lg overflow-hidden mb-3'>
                <iframe
                  src={`https://www.youtube.com/embed/${video.key}`}
                  title={`${movieDetails.title} ${video.type} Trailer`}
                  className='w-full h-full'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
              </div>
              <h3 className='font-medium text-black dark:text-primary mb-1'>{video.name}</h3>
              <p className='text-sm text-muted-foreground'>{video.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div >
  )
}