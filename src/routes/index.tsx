import NowShowing from '@/components/now-showing'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { theme, setTheme } = useTheme()
    const [isDarkMode, setIsDarkMode] = useState(false)
    
    const handleThemeChange = (checked: boolean) => {
        setTheme(checked ? 'dark' : 'light')
        setIsDarkMode(checked)
    }

    return (
        <div className='md:max-w-5xl md:mx-auto'>
            <header className='flex justify-between items-center p-4' role='banner'>
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
                <section className='flex items-center' aria-label='Theme controls'>
                    <label htmlFor='dark-mode-toggle' className='sr-only'>
                        toggle dark mode
                    </label>
                    <Switch
                        id='dark-mode-toggle'
                        checked={isDarkMode}
                        onCheckedChange={handleThemeChange}
                        className='data-[state=unchecked]:bg-[#AAA9B1]'
                        aria-label={`toggle dark mode`}
                        role='switch'
                        aria-checked={isDarkMode}
                    />
                </section>
            </header>
            <main className='space-y-5 px-4 pt-4'>
                <section>
                    <header className='flex justify-between items-center'>
                        <h2
                            className='text-base font-semibold text-black dark:text-white h-8'
                            role='heading'
                            aria-level={2}
                        >
                            Now Showing
                        </h2>
                        <Button
                            type='button'
                            variant='outline'
                            aria-label='view all now showing movies'
                            tabIndex={0}
                            className='rounded-full py-0 px-3 text-xs text-[#AAA9B1] border-[#AAA9B1] h-8'
                        >
                            See more
                        </Button>
                    </header>

                    {/* horizontal scroll with showing movies cards */}
                    <NowShowing />
                </section>
            </main>
        </div>
    )
}