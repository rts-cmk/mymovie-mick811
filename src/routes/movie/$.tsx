import { getDetails } from '@/lib/api'
import { formatRuntime } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { StarIcon } from 'lucide-react'

export const Route = createFileRoute('/movie/$')({
  component: RouteComponent,
})

function RouteComponent() {
  const { _splat } = Route.useParams()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['movie', _splat],
    queryFn: () => getDetails(_splat || ''),
  });

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
        <figure className="space-y-4">
          <div>
            <img
              src={`https://image.tmdb.org/t/p/original/${data.backdrop_path}`}
              alt={data.title}
              width={500}
              height={1080}
              className="w-full object-cover"
            />
          </div>
          <figcaption className="px-4">
            <h1 className="text-2xl font-bold mb-2 text-balance">{data.title}</h1>
            <span className="flex items-center gap-1 text-base text-muted-foreground">
              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {data.vote_average.toFixed(1)}/10 IMDb
            </span>
          </figcaption>
        </figure>
      </header>

      <section className="px-4 flex flex-col gap-6">
        <nav aria-label="Genres">
          <ul className="flex flex-wrap gap-2 justify-start">
            {data.genres && data.genres.length > 0 ? (
              data.genres.map((genre) => (
                <li
                  key={genre.id}
                  className="px-3 py-1 bg-[#DBE3FF] text-[#88A4E8] text-xs font-medium rounded-full uppercase"
                >
                  {genre.name}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">No genres available</li>
            )}
          </ul>
        </nav>

        <section>
          <h2 className="text-[#DBE3FF] text-base font-black tracking-[0.02em] mb-2">Description</h2>
          <p className="text-muted-foreground">{data.overview}</p>
        </section>
      </section>
    </main>
  )
}