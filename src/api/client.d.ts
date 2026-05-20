declare const apiClient: import("axios").AxiosInstance;
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
}
export interface Report {
    id: number;
    title: string;
    description?: string;
    file_url: string;
    file_size: number;
    download_count: number;
    created_at: string;
}
export declare const publicAPI: {
    getArticles: (skip?: number, limit?: number) => Promise<import("axios").AxiosResponse<Article[], any, {}>>;
    getArticle: (id: number) => Promise<import("axios").AxiosResponse<Article, any, {}>>;
    getReports: () => Promise<import("axios").AxiosResponse<Report[], any, {}>>;
    downloadReport: (id: number) => Promise<import("axios").AxiosResponse<{
        download_url: string;
        download_count: number;
    }, any, {}>>;
    submitContact: (data: {
        name: string;
        email: string;
        message: string;
    }) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    saveVentingMessage: (data: {
        message: string;
        user_id?: string;
    }) => Promise<import("axios").AxiosResponse<any, any, {}>>;
};
export default apiClient;
