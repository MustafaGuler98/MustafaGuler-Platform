import { BaseAdminService } from './baseAdminService';
import { apiClient } from '@/lib/api-client';
import { ServiceResponse } from '@/types/admin';
import {
    Movie, Book, Quote, ArchivesStats,
    CreateMovie, CreateBook, CreateQuote,
    UpdateMovie, UpdateBook, UpdateQuote,
    TvSeries, CreateTvSeries, UpdateTvSeries,
    Anime, CreateAnime, UpdateAnime,
    Game, CreateGame, UpdateGame,
    Music, CreateMusic, UpdateMusic,
    TTRPG, CreateTTRPG, UpdateTTRPG
} from '@/types/archives';

// Movie Service
class MovieAdminServiceClass extends BaseAdminService<Movie> {
    constructor() { super('archives/movies'); }
    async createMovie(data: CreateMovie) { return apiClient.post<Movie>('/archives/movies', data); }
    async updateMovie(id: string, data: UpdateMovie) { return apiClient.put<Movie>(`/archives/movies/${id}`, data); }
}

// Book Service
class BookAdminServiceClass extends BaseAdminService<Book> {
    constructor() { super('archives/books'); }
    async createBook(data: CreateBook) { return apiClient.post<Book>('/archives/books', data); }
    async updateBook(id: string, data: UpdateBook) { return apiClient.put<Book>(`/archives/books/${id}`, data); }
}

// Quote Service
class QuoteAdminServiceClass extends BaseAdminService<Quote> {
    constructor() { super('archives/quotes'); }
    async createQuote(data: CreateQuote) { return apiClient.post<Quote>('/archives/quotes', data); }
    async updateQuote(id: string, data: UpdateQuote) { return apiClient.put<Quote>(`/archives/quotes/${id}`, data); }
    async getRandom() { return apiClient.get<Quote>('/archives/quotes/random'); }
}

// TvSeries Service
class TvSeriesAdminServiceClass extends BaseAdminService<TvSeries> {
    constructor() { super('archives/tvseries'); }
    async createTvSeries(data: CreateTvSeries) { return apiClient.post<TvSeries>('/archives/tvseries', data); }
    async updateTvSeries(id: string, data: UpdateTvSeries) { return apiClient.put<TvSeries>(`/archives/tvseries/${id}`, data); }
}

// Anime Service
class AnimeAdminServiceClass extends BaseAdminService<Anime> {
    constructor() { super('archives/anime'); }
    async createAnime(data: CreateAnime) { return apiClient.post<Anime>('/archives/anime', data); }
    async updateAnime(id: string, data: UpdateAnime) { return apiClient.put<Anime>(`/archives/anime/${id}`, data); }
}

// Game Service
class GameAdminServiceClass extends BaseAdminService<Game> {
    constructor() { super('archives/games'); }
    async createGame(data: CreateGame) { return apiClient.post<Game>('/archives/games', data); }
    async updateGame(id: string, data: UpdateGame) { return apiClient.put<Game>(`/archives/games/${id}`, data); }
}

// Music Service
class MusicAdminServiceClass extends BaseAdminService<Music> {
    constructor() { super('archives/music'); }
    async createMusic(data: CreateMusic) { return apiClient.post<Music>('/archives/music', data); }
    async updateMusic(id: string, data: UpdateMusic) { return apiClient.put<Music>(`/archives/music/${id}`, data); }
}

// TTRPG Service
class TTRPGAdminServiceClass extends BaseAdminService<TTRPG> {
    constructor() { super('archives/ttrpg'); }
    async createTTRPG(data: CreateTTRPG) { return apiClient.post<TTRPG>('/archives/ttrpg', data); }
    async updateTTRPG(id: string, data: UpdateTTRPG) { return apiClient.put<TTRPG>(`/archives/ttrpg/${id}`, data); }
}

// Stats Service
class ArchivesStatsServiceClass {
    async getStats(): Promise<ServiceResponse<ArchivesStats>> {
        return apiClient.get<ArchivesStats>('/archives/stats');
    }
}

export const movieAdminService = new MovieAdminServiceClass();
export const bookAdminService = new BookAdminServiceClass();
export const quoteAdminService = new QuoteAdminServiceClass();
export const tvSeriesAdminService = new TvSeriesAdminServiceClass();
export const animeAdminService = new AnimeAdminServiceClass();
export const gameAdminService = new GameAdminServiceClass();
export const musicAdminService = new MusicAdminServiceClass();
export const ttrpgAdminService = new TTRPGAdminServiceClass();
export const archivesStatsService = new ArchivesStatsServiceClass();

