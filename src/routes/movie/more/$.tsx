import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getNowPlayingPaginated, getPopularPaginated } from '@/lib/fn'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Movie } from '@/lib/api'

export const Route = createFileRoute('/movie/more/$')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search?.page ?? 1),
    }
  },
})

function RouteComponent() {
  const { _splat } = Route.useParams()
  const { page } = Route.useSearch()
  const navigate = useNavigate()

  if (!_splat || !['now-playing', 'popular'].includes(_splat)) {
    return <div>Invalid movie category</div>
  }

  const isNowPlaying = _splat === 'now-playing'
  const title = isNowPlaying ? 'Now Playing' : 'Popular Movies'

  const { data, isLoading, error } = useQuery({
    queryKey: [isNowPlaying ? 'nowPlayingPaginated' : 'popularPaginated', page],
    queryFn: () => {
      if (isNowPlaying) {
        return getNowPlayingPaginated({ data: { page } })
      } else {
        return getPopularPaginated({ data: { page } })
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 3,
  })

  if (error) throw new Error(error.message)
  if (isLoading || !data) return <div>Loading movies...</div>

  const movies = data.results as Movie[]
  const totalPages = Math.min(data.total_pages, 500) // TMDB limits to 500 pages

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/movie/more/$',
      params: { _splat },
      search: { page: newPage },
    })
  }

  return (
    <div className='md:max-w-7xl md:mx-auto md:px-4 md:py-8'>
      {/* Header with theme toggle - Desktop */}
      <header className='hidden md:flex justify-between items-center mb-6'>
        <Link to="/">
          <Button variant="ghost" className='flex items-center gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Home
          </Button>
        </Link>
        <ThemeToggle />
      </header>

      <div className='px-4 md:px-0'>
        {/* Mobile back button */}
        <div className='md:hidden mb-6'>
          <Link to="/">
            <Button variant="ghost" className='flex items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Page title and info */}
        <div className='mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold text-black dark:text-white mb-2'>
            {title}
          </h1>
          <p className='text-muted-foreground'>
            Page {page} of {totalPages} • {data.total_results.toLocaleString()} movies
          </p>
        </div>

        {/* Movies Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12'>
          {movies.map((movie: Movie) => (
            <Link to="/movie/$" params={{ _splat: movie.id.toString() }} key={movie.id}>
              <div className='group cursor-pointer'>
                <div className='relative overflow-hidden rounded-lg mb-3'>
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className='w-full aspect-[2/3] object-cover transition-transform group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors' />
                </div>
                <div className='space-y-1'>
                  <h3 className='font-medium text-sm text-black dark:text-white leading-tight line-clamp-2'>
                    {movie.title}
                  </h3>
                  <div className='flex items-center gap-2'>
                    <div className='flex gap-x-1 items-center'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star">
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" className='fill-yellow-500 text-yellow-500' />
                      </svg>
                      <span className='text-xs text-muted-foreground'>{movie.vote_average.toFixed(1)}</span>
                    </div>
                    <span className='text-xs text-muted-foreground'>
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <Pagination className="mb-8">
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(page - 1)}
                  href="#"
                />
              </PaginationItem>
            )}
            
            {/* First page */}
            {page > 3 && (
              <PaginationItem>
                <PaginationLink 
                  onClick={() => handlePageChange(1)}
                  isActive={page === 1}
                  href="#"
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            
            {/* Ellipsis before current page range */}
            {page > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            {/* Page range around current page */}
            {[...Array(5)].map((_, index) => {
              const pageNumber = page - 2 + index
              if (pageNumber < 1 || pageNumber > totalPages) return null
              
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink 
                    onClick={() => handlePageChange(pageNumber)}
                    isActive={page === pageNumber}
                    href="#"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            
            {/* Ellipsis after current page range */}
            {page < totalPages - 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            {/* Last page */}
            {page < totalPages - 2 && (
              <PaginationItem>
                <PaginationLink 
                  onClick={() => handlePageChange(totalPages)}
                  isActive={page === totalPages}
                  href="#"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            
            {page < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(page + 1)}
                  href="#"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
