import type { Movie, MoviesResponse } from '@/types/api'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export function getPlaying(): Promise<MoviesResponse> {
    return fetch(`${BASE_URL}/movie/now_playing`, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`
        }
    })
    .then(response => response.json())
    .catch(error => {
        console.error('error fetching playing movies', error)
        throw error
    })
}

export function getPopular(): Promise<MoviesResponse> {
    return fetch(`${BASE_URL}/movie/popular`, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`
        }
    })
    .then(response => response.json())
    .catch(error => {
        console.error('error fetching popular movies', error)
        throw error
    })
}

export function getMovie(id: number): Promise<Movie> {
    return fetch(`${BASE_URL}/movie/${id}`, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`
        }
    })
    .then(response => response.json())
    .catch(error => {
        console.error('error fetching movie', error)
        throw error
    })
}