import { createServerFn } from '@tanstack/react-start'
import { Movie, DetailsResponse } from './api'

const BASE_URL = 'https://api.themoviedb.org/3'

export const getPlaying = createServerFn({ method: 'GET' })
    .handler(async () => {
        const response = await fetch(`${BASE_URL}/movie/now_playing`, {
            headers: {
                'Authorization': `Bearer ${process.env.VITE_TMDB_API_KEY}`
            }
        })
        const data = await response.json()
        return { data }
    })

export const getPopular = createServerFn({ method: 'GET' })
    .handler(async () => {
        const response = await fetch(`${BASE_URL}/movie/popular`, {
            headers: {
                'Authorization': `Bearer ${process.env.VITE_TMDB_API_KEY}`
            }
        })
        const data = await response.json()
        return { data }
    })

export const getMovieData = createServerFn({ method: 'GET' })
    .handler(async () => {
        // fetch both endpoints concurrently
        const [nowPlayingResponse, popularResponse] = await Promise.all([
            fetch(`${BASE_URL}/movie/now_playing`, {
                headers: {
                    'Authorization': `Bearer ${process.env.VITE_TMDB_API_KEY}`
                }
            }),
            fetch(`${BASE_URL}/movie/popular`, {
                headers: {
                    'Authorization': `Bearer ${process.env.VITE_TMDB_API_KEY}`
                }
            })
        ])

        const [nowPlaying, popular] = await Promise.all([
            nowPlayingResponse.json(),
            popularResponse.json()
        ])

        // for popular movies, fetch all details
        const popularMovies = popular.results as Movie[]
        const popularMoviesWithDetails = await Promise.all(
            popularMovies.slice(0, 8).map(async (movie: Movie) => {
                const detailsResponse = await fetch(`${BASE_URL}/movie/${movie.id}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.VITE_TMDB_API_KEY}`
                    }
                })
                const details = await detailsResponse.json() as DetailsResponse

                return {
                    ...movie,
                    ...details
                } as DetailsResponse
            })
        )

        return {
            nowPlaying: nowPlaying.results as Movie[],
            popular: popularMoviesWithDetails
        }
    })

export const getMovieDetails = createServerFn({ method: 'GET' })
    .validator((input: { movieId: string }) => input)
    .handler(async ({ data: { movieId } }) => {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}?append_to_response=credits,images,videos`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.VITE_TMDB_API_KEY}`
                }
            }
        )
        const data = await response.json()
        return data as DetailsResponse
    })

export const getNowPlayingPaginated = createServerFn({ method: 'GET' })
    .validator((input: { page: number }) => input)
    .handler(async ({ data: { page } }) => {
        const response = await fetch(
            `${BASE_URL}/movie/now_playing?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.VITE_TMDB_API_KEY}`
                }
            }
        )
        const data = await response.json()
        return data
    })

export const getPopularPaginated = createServerFn({ method: 'GET' })
    .validator((input: { page: number }) => input)
    .handler(async ({ data: { page } }) => {
        const response = await fetch(
            `${BASE_URL}/movie/popular?page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.VITE_TMDB_API_KEY}`
                }
            }
        )
        const data = await response.json()
        return data
    })