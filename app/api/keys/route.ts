import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db, apiKey } from '@/db';
import { eq, and } from 'drizzle-orm';
import { randomBytes, createHash } from 'crypto';

// Schema for creating a new API key
const createApiKeySchema = z.object({
    name: z.string().min(1).max(100).describe('User-defined key name for identification'),
});

// Schema for updating an API key (if needed in future)
const updateApiKeySchema = z.object({
    name: z.string().min(1).max(100).optional(),
    expiresAt: z.string().datetime().optional(),
});

// Helper function to generate a secure API key
function generateApiKey(): string {
    // Generate 32 random bytes and convert to hex string
    const bytes = randomBytes(32);
    const key = bytes.toString('hex');
    return `sk_${key}`;
}

// Helper function to hash an API key with salt
function hashApiKey(key: string): string {
    // Using SHA-256 for hashing (in production, consider using bcrypt or scrypt for better security)
    return createHash('sha256').update(key).digest('hex');
}

// Helper function to extract key parts
function extractKeyParts(key: string) {
    // Remove the 'sk_' prefix for processing
    const cleanKey = key.replace('sk_', '');

    // First 8 characters after prefix for identification
    const keyPrefix = `sk_${cleanKey.substring(0, 8)}`;

    // Last 4 characters for user identification
    const lastFourChars = cleanKey.substring(cleanKey.length - 4);

    return { keyPrefix, lastFourChars };
}

// GET: Retrieve all API keys for the authenticated user
export async function GET(req: NextRequest) {
    try {
        // Verify authentication
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Retrieve all keys for the user, excluding sensitive data
        const userKeys = await db
            .select({
                id: apiKey.id,
                name: apiKey.name,
                keyPrefix: apiKey.keyPrefix,
                lastFourChars: apiKey.lastFourChars,
                createdAt: apiKey.createdAt,
                expiresAt: apiKey.expiresAt,
            })
            .from(apiKey)
            .where(eq(apiKey.userId, userId))
            .orderBy(apiKey.createdAt);

        return NextResponse.json({
            success: true,
            data: userKeys,
        });

    } catch (error) {
        console.error('API Keys GET error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// POST: Create a new API key
export async function POST(req: NextRequest) {
    try {
        // Verify authentication
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Parse and validate request body
        const body = await req.json();
        const { name } = createApiKeySchema.parse(body);

        // Generate the API key
        const fullKey = generateApiKey();
        const { keyPrefix, lastFourChars } = extractKeyParts(fullKey);
        const hashedKey = hashApiKey(fullKey);

        // Generate a unique ID for the key
        const keyId = `key_${randomBytes(16).toString('hex')}`;

        // Store the hashed version in the database
        const [newKey] = await db
            .insert(apiKey)
            .values({
                id: keyId,
                userId,
                name,
                hashedKey,
                keyPrefix,
                lastFourChars,
                createdAt: new Date(),
                expiresAt: null, // Can be extended in future to support expiration
            })
            .returning({
                id: apiKey.id,
                name: apiKey.name,
                keyPrefix: apiKey.keyPrefix,
                lastFourChars: apiKey.lastFourChars,
                createdAt: apiKey.createdAt,
                expiresAt: apiKey.expiresAt,
            });

        // Return the full unhashed key to the client (only once)
        return NextResponse.json({
            success: true,
            data: {
                ...newKey,
                fullKey, // This is only shown once during creation
                message: 'API key created successfully. Save this key securely as it will not be shown again.',
            },
        });

    } catch (error) {
        console.error('API Keys POST error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request body', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// DELETE: Delete an API key
export async function DELETE(req: NextRequest) {
    try {
        // Verify authentication
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const { searchParams } = new URL(req.url);
        const keyId = searchParams.get('id');

        if (!keyId) {
            return NextResponse.json(
                { error: 'Key ID is required' },
                { status: 400 }
            );
        }

        // Delete the key if it belongs to the user
        const deletedKey = await db
            .delete(apiKey)
            .where(
                and(
                    eq(apiKey.id, keyId),
                    eq(apiKey.userId, userId)
                )
            )
            .returning({ id: apiKey.id });

        if (deletedKey.length === 0) {
            return NextResponse.json(
                { error: 'API key not found or you do not have permission to delete it' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'API key deleted successfully',
        });

    } catch (error) {
        console.error('API Keys DELETE error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}