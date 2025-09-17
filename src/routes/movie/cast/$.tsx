import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { getDetails } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/movie/cast/$')({
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

    if (!data) return null; // gider lowk ik lave en loading state

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center py-4">
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

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {data?.credits?.cast?.map((cast) => (
                        <figure
                            key={cast.id}
                            className="group flex flex-col gap-3"
                        >
                            <div className="aspect-[2/3] overflow-hidden rounded-md bg-muted">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`}
                                    alt={cast.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    loading="lazy"
                                />
                            </div>
                            <figcaption className="text-center space-y-1">
                                <h3 className="text-sm font-semibold text-foreground leading-tight">
                                    {cast.name}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-tight">
                                    {cast.character}
                                </p>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </div>
    )
}
