// Frontend messages (Backend messages in Messages.cs)

export const GENERAL_MESSAGES = {
    LOADING: "Loading...",
    ERROR: "An error occurred.",
} as const;

export const ARTICLE_MESSAGES = {
    NO_CONTENT: "No content available for this article.",
    CONTENT_LOADING_ERROR: "Failed to load article content.",
} as const;
