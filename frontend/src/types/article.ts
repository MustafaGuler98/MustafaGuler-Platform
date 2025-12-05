export interface Article {
    id: string;
    title: string;
    content: string;
    CategoryId: string;
    LanguageCode: string;
    slug: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
    summary?: string;

}