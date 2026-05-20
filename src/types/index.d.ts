export interface Article {
    id: number;
    title: string;
    subtitle?: string;
    content: string;
    author: string;
    image_url?: string;
    is_published: boolean;
    views: number;
    created_at: string;
    updated_at: string;
}
export interface Report {
    id: number;
    title: string;
    description?: string;
    file_url: string;
    file_size: number;
    download_count: number;
    is_active: boolean;
    created_at: string;
}
export interface ContactFormData {
    name: string;
    email: string;
    message: string;
}
export interface VentingMessage {
    message: string;
    user_id?: string;
}
