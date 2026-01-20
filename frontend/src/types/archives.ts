// Archives module types

export enum ReadingStatus {
    Reading = 1,
    Finished = 2,
    OnHold = 3,
    Dropped = 4,
    PlanToRead = 5
}

export enum WatchStatus {
    Watching = 1,
    Completed = 2,
    OnHold = 3,
    Dropped = 4,
    PlanToWatch = 5
}

export enum GameStatus {
    Playing = 1,
    Finished = 2,
    Completed100 = 3,
    Dropped = 4,
    Backlog = 5
}

export enum TTRPGRole {
    Player = 1,
    GameMaster = 2
}

export enum CampaignStatus {
    Active = 1,
    Completed = 2,
    OnHiatus = 3,
    Abandoned = 4
}

export interface Movie {
    id: string;
    title: string;
    director: string;
    releaseYear?: number;
    durationMinutes?: number;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
    status: WatchStatus;
    createdDate: string;
}

export interface CreateMovie {
    title: string;
    director: string;
    releaseYear?: number;
    durationMinutes?: number;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
    status: WatchStatus;
    externalId?: string;
}

export interface UpdateMovie extends CreateMovie { }

export interface Book {
    id: string;
    title: string;
    author: string;
    pageCount?: number;
    currentPage?: number;
    publishYear?: number;
    readingStatus: ReadingStatus;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
    createdDate: string;
}

export interface CreateBook {
    title: string;
    author: string;
    pageCount?: number;
    currentPage?: number;
    publishYear?: number;
    readingStatus: ReadingStatus;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
    externalId?: string;
}

export interface UpdateBook extends CreateBook { }

export interface Quote {
    id: string;
    content: string;
    author: string;
    source?: string;
    createdDate: string;
}

export interface CreateQuote {
    content: string;
    author: string;
    source?: string;
}

export interface UpdateQuote extends CreateQuote { }

// TvSeries
export interface TvSeries {
    id: string;
    title: string;
    startYear?: number;
    endYear?: number;
    totalSeasons?: number;
    totalEpisodes?: number;
    currentEpisode?: number;
    status: WatchStatus;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
    createdDate: string;
}

export interface CreateTvSeries {
    title: string;
    startYear?: number;
    endYear?: number;
    totalSeasons?: number;
    totalEpisodes?: number;
    currentEpisode?: number;
    status: WatchStatus;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
}

export interface UpdateTvSeries extends CreateTvSeries { }

// Anime
export interface Anime {
    id: string;
    title: string;
    episodes?: number;
    currentEpisode?: number;
    releaseYear?: number;
    studio?: string;
    status: WatchStatus;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
    createdDate: string;
}

export interface CreateAnime {
    title: string;
    episodes?: number;
    currentEpisode?: number;
    releaseYear?: number;
    studio?: string;
    status: WatchStatus;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
}

export interface UpdateAnime extends CreateAnime { }

// Game
export interface Game {
    id: string;
    title: string;
    platform?: string;
    developer?: string;
    releaseYear?: number;
    playtimeHours?: number;
    status: GameStatus;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
    createdDate: string;
}

export interface CreateGame {
    title: string;
    platform?: string;
    developer?: string;
    releaseYear?: number;
    playtimeHours?: number;
    status: GameStatus;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
}

export interface UpdateGame extends CreateGame { }

// Music
export interface Music {
    id: string;
    title: string;
    artist: string;
    album?: string;
    releaseYear?: number;
    genre?: string;
    spotifyId?: string;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
    createdDate: string;
}

export interface CreateMusic {
    title: string;
    artist: string;
    album?: string;
    releaseYear?: number;
    genre?: string;
    spotifyId?: string;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
}

export interface UpdateMusic extends CreateMusic { }

// TTRPG
export interface TTRPG {
    id: string;
    title: string;
    system?: string;
    campaignName?: string;
    role: TTRPGRole;
    campaignStatus: CampaignStatus;
    sessionCount?: number;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
    createdDate: string;
}

export interface CreateTTRPG {
    title: string;
    system?: string;
    campaignName?: string;
    role: TTRPGRole;
    campaignStatus: CampaignStatus;
    sessionCount?: number;
    coverImageUrl?: string;
    description?: string;
    myReview?: string;
    myRating?: number;
    consumedYear?: number;
}

export interface UpdateTTRPG extends CreateTTRPG { }

export interface ArchivesStats {
    movieCount: number;
    bookCount: number;
    quoteCount: number;
    tvSeriesCount: number;
    animeCount: number;
    gameCount: number;
    musicCount: number;
    ttrpgCount: number;
}

// Status label helpers
export const readingStatusLabels: Record<ReadingStatus, string> = {
    [ReadingStatus.Reading]: 'Reading',
    [ReadingStatus.Finished]: 'Finished',
    [ReadingStatus.OnHold]: 'On Hold',
    [ReadingStatus.Dropped]: 'Dropped',
    [ReadingStatus.PlanToRead]: 'Plan to Read'
};

export const watchStatusLabels: Record<WatchStatus, string> = {
    [WatchStatus.Watching]: 'Watching',
    [WatchStatus.Completed]: 'Completed',
    [WatchStatus.OnHold]: 'On Hold',
    [WatchStatus.Dropped]: 'Dropped',
    [WatchStatus.PlanToWatch]: 'Plan to Watch'
};

export const gameStatusLabels: Record<GameStatus, string> = {
    [GameStatus.Playing]: 'Playing',
    [GameStatus.Finished]: 'Finished',
    [GameStatus.Completed100]: '100% Completed',
    [GameStatus.Dropped]: 'Dropped',
    [GameStatus.Backlog]: 'Backlog'
};

export const ttrpgRoleLabels: Record<TTRPGRole, string> = {
    [TTRPGRole.Player]: 'Player',
    [TTRPGRole.GameMaster]: 'Game Master'
};

export const campaignStatusLabels: Record<CampaignStatus, string> = {
    [CampaignStatus.Active]: 'Active',
    [CampaignStatus.Completed]: 'Completed',
    [CampaignStatus.OnHiatus]: 'On Hiatus',
    [CampaignStatus.Abandoned]: 'Abandoned'
};

// Featured Items for About page
export interface PublicActivity {
    type: string;
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
}

export interface PublicActivities {
    book?: PublicActivity;
    movie?: PublicActivity;
    tvSeries?: PublicActivity;
    music?: PublicActivity;
    anime?: PublicActivity;
    game?: PublicActivity;
    ttrpg?: PublicActivity;
}

export interface Activity {
    activityType: string;
    selectedItemId: string | null;
    selectedItemTitle: string | null;
    selectedItemImageUrl: string | null;
    displayOrder: number;
}

export interface ActivityOption {
    id: string;
    title: string;
    imageUrl: string | null;
    createdDate?: string;
    subtitle?: string;
}
export interface UpdateActivity {
    activityType: string;
    selectedItemId: string | null;
}
