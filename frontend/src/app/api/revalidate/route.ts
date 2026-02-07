import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const secret = request.headers.get('x-revalidate-secret');

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({
            isSuccess: false,
            message: 'Unauthorized',
            statusCode: 401,
            data: null,
            errors: ['Invalid secret key']
        }, { status: 401 });
    }

    try {
        const { tags } = await request.json();

        if (!Array.isArray(tags) || tags.length === 0) {
            return NextResponse.json({
                isSuccess: false,
                message: 'Invalid tags array',
                statusCode: 400,
                data: null,
                errors: ['Tags must be a non-empty array']
            }, { status: 400 });
        }

        for (const tag of tags) {
            revalidateTag(tag, 'default');
        }

        return NextResponse.json({
            isSuccess: true,
            message: 'Revalidation successful',
            statusCode: 200,
            data: { revalidated: tags, timestamp: Date.now() },
            errors: null
        }, { status: 200 });
    } catch {
        return NextResponse.json({
            isSuccess: false,
            message: 'Invalid request body',
            statusCode: 400,
            data: null,
            errors: ['The request body could not be parsed']
        }, { status: 400 });
    }
}
