import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getMovieDetails } from '@/lib/fn'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Cast } from '@/lib/api'

export const Route = createFileRoute('/movie/cast/$')({
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
  if (isLoading || !movieDetails) return <div>Loading cast...</div>

  const cast = movieDetails.credits?.cast || []
  const crew = movieDetails.credits?.crew || []

  return (
    <div className='md:max-w-5xl md:mx-auto md:px-4 md:py-8'>
      {/* Header with theme toggle - Desktop */}
      <header className='hidden md:flex justify-between items-center mb-6'>
        <Link to="/movie/$" params={{ _splat }}>
          <Button variant="ghost" className='flex items-center gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Movie
          </Button>
        </Link>
        <ThemeToggle />
      </header>

      <div className='px-4 md:px-0'>
        {/* Mobile back button */}
        <div className='md:hidden mb-6'>
          <Link to="/movie/$" params={{ _splat }}>
            <Button variant="ghost" className='flex items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back to Movie
            </Button>
          </Link>
        </div>

        {/* Movie title */}
        <div className='mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold text-black dark:text-white mb-2'>
            {movieDetails.title}
          </h1>
          <p className='text-muted-foreground'>
            Cast & Crew
          </p>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <section className='mb-12'>
            <h2 className='text-xl font-semibold mb-6 text-black dark:text-primary'>
              Cast ({cast.length})
            </h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
              {cast.map((actor: Cast) => (
                <div key={actor.id} className='text-center'>
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                      alt={actor.name}
                      className='w-full aspect-[2/3] object-cover rounded-lg mb-3 shadow-sm'
                    />
                  ) : (
                    <div className='w-full aspect-[2/3] bg-background dark:bg-muted rounded-lg mb-3 flex items-center justify-center border'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  )}
                  <div className='space-y-1'>
                    <p className='font-medium text-sm text-black dark:text-white leading-tight'>
                      {actor.name}
                    </p>
                    {actor.character && (
                      <p className='text-xs text-muted-foreground leading-tight'>
                        {actor.character}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Crew Section */}
        {crew.length > 0 && (
          <section>
            <h2 className='text-xl font-semibold mb-6 text-black dark:text-primary'>
              Crew ({crew.length})
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {crew
                .filter((member: Cast) => member.job && ['Director', 'Producer', 'Writer', 'Screenplay', 'Story', 'Executive Producer', 'Cinematography', 'Music', 'Editing'].includes(member.job))
                .map((member: Cast) => (
                  <div key={`${member.id}-${member.job}`} className='flex items-center gap-3 p-3 rounded-lg border bg-background dark:bg-muted/30'>
                    {member.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${member.profile_path}`}
                        alt={member.name}
                        className='w-12 h-12 object-cover rounded-full'
                      />
                    ) : (
                      <div className='w-12 h-12 bg-muted rounded-full flex items-center justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-sm text-black dark:text-white truncate'>
                        {member.name}
                      </p>
                      <p className='text-xs text-muted-foreground truncate'>
                        {member.job}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* No cast/crew message */}
        {cast.length === 0 && crew.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              No cast and crew information available for this movie.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
