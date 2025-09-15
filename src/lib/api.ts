import type { MoviesResponse } from '@/types/api'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export const fetchNowPlayingMovies = async (): Promise<MoviesResponse> => {
    const response = await fetch(
        `${BASE_URL}/movie/now_playing`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        }
    )
    
    if (!response.ok) {
        throw new Error('Failed to fetch now playing movies')
    }
    
    return response.json()
}

export const fetchPopularMovies = async (): Promise<MoviesResponse> => {
    const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    )
    
    if (!response.ok) {
        throw new Error('Failed to fetch popular movies')
    }
    
    return response.json()
}

export const getImageUrl = (path: string, size: string = 'w500'): string => {
    return `https://image.tmdb.org/t/p/${size}${path}`
}
