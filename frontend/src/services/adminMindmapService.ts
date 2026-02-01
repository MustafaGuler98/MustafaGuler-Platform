import { BaseAdminService } from './admin/baseAdminService';

export interface MindmapItemDto {
    id: string;
    text: string;
    isActive: boolean;
}

export interface MindmapItemAddDto {
    text: string;
}

export interface MindmapItemUpdateDto {
    id: string;
    text: string;
    isActive: boolean;
}

class MindmapAdminService extends BaseAdminService<MindmapItemDto> {
    constructor() {
        super('mindmap');
    }
}

export const adminMindmapService = new MindmapAdminService();
