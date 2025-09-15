import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    return (
        <header className='flex justify-between items-center p-4'>
            <nav>
                <Button type='button' variant='ghost' aria-label='Open menu' className='p-1'>
                    <img src='/assets/Menu.svg' alt='' className='w-6 h-6 brightness-0 dark:invert' />
                </Button>
            </nav>
            <h1 className='text-base font-semibold text-black dark:text-white'>MyMovies</h1>
            <div className='flex items-center'>
                <label htmlFor='dark-mode' className='sr-only'>Toggle dark mode</label>
                <Switch
                    id='dark-mode'
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
                    className='data-[state=unchecked]:bg-[#AAA9B1]'
                    aria-label='Toggle dark mode'
                />
            </div>
        </header>
    )
}