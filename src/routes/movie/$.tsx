import { getDetails } from '@/lib/api'
import { formatRuntime } from '@/lib/utils'
import { useTheme } from '@/components/theme-provider'
import { Switch } from '@/components/ui/switch'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, StarIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/movie/$')({
  component: RouteComponent,
})

function RouteComponent() {
  const { _splat } = Route.useParams()
  const { theme, setTheme } = useTheme()
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark')

  // Sync local state with theme provider
  useEffect(() => {
    setIsDarkMode(theme === 'dark')
  }, [theme])

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['movie', _splat],
    queryFn: () => getDetails(_splat || ''),
  });

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
    setIsDarkMode(checked)
  }

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground animate-pulse">Loading movie...</p>
      </main>
    );
  }

  if (isError || !data) {
    console.error('Error loading movie:', error);
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-red-500">Movie not found</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-8">
      <header>
        <div className="flex justify-between items-center py-4 md:max-w-4xl md:mx-auto">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back
          </Button>
          <section className='flex items-center' aria-label='Theme controls'>
            <label htmlFor='dark-mode-toggle-movie' className='sr-only'>
              toggle dark mode
            </label>
            <Switch
              id='dark-mode-toggle-movie'
              checked={isDarkMode}
              onCheckedChange={handleThemeChange}
              className='data-[state=unchecked]:bg-[#AAA9B1]'
              aria-label={`toggle dark mode`}
              role='switch'
              aria-checked={isDarkMode}
            />
          </section>
        </div>
          <figure>
            <div>
              {(() => {
                const officialTrailer = data.videos?.results.find(
                  video => video.type === 'Trailer' && video.official && video.site === 'YouTube'
                );
                return officialTrailer?.key ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${officialTrailer.key}`}
                    title={data.title}
                    className="w-full aspect-video"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={`https://image.tmdb.org/t/p/original/${data.backdrop_path}`}
                    alt={data.title}
                    className="w-full aspect-video object-cover"
                  />
                );
              })()}
            </div>
          <figcaption className="px-4 mt-4 md:max-w-4xl md:mx-auto">
            <h1 className="text-2xl font-bold text-balance md:text-4xl">{data.title}</h1>
            <div className="flex items-center gap-1 text-base text-muted-foreground mt-2 md:text-lg">
              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400 md:w-5 md:h-5" />
              {data.vote_average.toFixed(1)}/10 IMDb
            </div>
          </figcaption>
        </figure>
      </header>

      <div className="px-4 flex flex-col gap-6 md:max-w-4xl md:mx-auto md:gap-8">
        <section aria-label="Genres">
          <h2 className="text-[#110E47] dark:text-[#DBE3FF] text-base font-black tracking-[0.02em] mb-3 md:text-lg">Genres</h2>
          <ul className="flex flex-wrap gap-2 justify-start">
            {data.genres && data.genres.length > 0 ? (
              data.genres.map((genre) => (
                <li
                  key={genre.id}
                  className="px-3 py-1 bg-[#DBE3FF] text-[#88A4E8] text-xs font-medium rounded-full uppercase md:px-4 md:py-2 md:text-sm"
                >
                  {genre.name}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">No genres available</li>
            )}
          </ul>
        </section>

        <section className='grid grid-cols-3 gap-4 md:grid-cols-6 md:gap-8' aria-label="Movie details">
          <div className='flex flex-col gap-1 md:col-span-2'>
            <dt className="text-sm font-medium text-muted-foreground md:text-base">Length</dt>
            <dd className="text-base md:text-lg">{formatRuntime(data.runtime)}</dd>
          </div>
          <div className='flex flex-col gap-1 md:col-span-2'>
            <dt className="text-sm font-medium text-muted-foreground md:text-base">Language</dt>
            <dd className="text-base md:text-lg">{data.spoken_languages[0]?.english_name}</dd>
          </div>
          <div className='flex flex-col gap-1 md:col-span-2'>
            <dt className="text-sm font-medium text-muted-foreground md:text-base">Rating</dt>
            <dd className="text-base md:text-lg">{data.vote_average.toFixed(1)}/10 IMDb</dd>
          </div>
        </section>

        <section>
          <h2 className="text-[#110E47] dark:text-[#DBE3FF] text-base font-black tracking-[0.02em] mb-3 md:text-lg">Description</h2>
          <p className="text-muted-foreground leading-relaxed md:text-lg md:leading-relaxed">{data.overview}</p>
        </section>

        <section>
          <header className='flex justify-between items-center'>
            <h2
              className='text-[#110E47] dark:text-[#DBE3FF] text-base font-black tracking-[0.02em] mb-3 md:text-lg'
              role='heading'
              aria-level={2}
              id='cast-heading'
            >
              Cast
            </h2>
            <Link to='/movie/cast/$' params={{ _splat: data.id.toString() }}>
                <Button
                    type='button'
                    variant='outline'
                    aria-label='view all cast'
                    tabIndex={0}
                    className='rounded-full py-0 px-3 text-xs text-[#AAA9B1] border-[#AAA9B1] h-8'
                >
                    See more
                </Button>
            </Link>
          </header>
          <div className="flex flex-wrap gap-4 md:gap-6">
            {data.credits?.cast?.slice(0, 4).map((cast) => (
              <figure key={cast.id} className="flex flex-col gap-2">
                <img src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`} width={64} height={64} alt={cast.name} className='rounded-md object-cover md:w-20 md:h-20' />
                <figcaption className='text-sm text-balance text-muted-foreground max-w-[64px] md:max-w-[80px] md:text-base'>{cast.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}