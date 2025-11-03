"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    Key,
    Plus,
    Copy,
    Trash2,
    Shield,
    AlertCircle,
    CheckCircle,
    ExternalLink,
    Eye,
    EyeOff,
} from "lucide-react";

// TypeScript interfaces for API responses
interface ApiKey {
    id: string;
    name: string;
    keyPrefix: string;
    lastFourChars: string;
    createdAt: string;
    expiresAt?: string | null;
    fullKey?: string; // Only included during creation
}

interface CreateApiResponse {
    success: boolean;
    data: ApiKey & {
        fullKey: string;
        message: string;
    };
}

interface ListApiResponse {
    success: boolean;
    data: ApiKey[];
}

interface DeleteApiResponse {
    success: boolean;
    message: string;
}

export function ApiKeyManager() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
    const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

    // Fetch API keys on component mount
    useEffect(() => {
        fetchApiKeys();
    }, []);

    const fetchApiKeys = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/keys");
            const data: ListApiResponse = await response.json();

            if (data.success) {
                setApiKeys(data.data);
            } else {
                toast.error("Failed to load API keys");
            }
        } catch (error) {
            console.error("Error fetching API keys:", error);
            toast.error("Error loading API keys");
        } finally {
            setIsLoading(false);
        }
    };

    const createApiKey = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newKeyName.trim()) {
            toast.error("Please enter a name for the API key");
            return;
        }

        try {
            setIsCreating(true);
            const response = await fetch("/api/keys", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newKeyName.trim() }),
            });

            const data: CreateApiResponse = await response.json();

            if (data.success && data.data.fullKey) {
                // Store the newly created key for display
                setNewlyCreatedKey(data.data);
                setShowCreateDialog(false);
                setNewKeyName("");

                // Refresh the keys list
                await fetchApiKeys();

                toast.success(data.data.message || "API key created successfully");
            } else {
                toast.error(data.data?.error || "Failed to create API key");
            }
        } catch (error) {
            console.error("Error creating API key:", error);
            toast.error("Error creating API key");
        } finally {
            setIsCreating(false);
        }
    };

    const deleteApiKey = async (keyId: string) => {
        try {
            const response = await fetch(`/api/keys?id=${keyId}`, {
                method: "DELETE",
            });

            const data: DeleteApiResponse = await response.json();

            if (data.success) {
                setApiKeys(apiKeys.filter(key => key.id !== keyId));
                toast.success("API key deleted successfully");
            } else {
                toast.error(data.error || "Failed to delete API key");
            }
        } catch (error) {
            console.error("Error deleting API key:", error);
            toast.error("Error deleting API key");
        }
    };

    const copyToClipboard = async (text: string, keyId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKeyId(keyId);
            toast.success("API key copied to clipboard");

            // Reset the copied state after 2 seconds
            setTimeout(() => setCopiedKeyId(null), 2000);
        } catch (error) {
            toast.error("Failed to copy to clipboard");
        }
    };

    const maskApiKey = (key: ApiKey) => {
        return `${key.keyPrefix}••••••••${key.lastFourChars}`;
    };

    const isExpired = (key: ApiKey) => {
        if (!key.expiresAt) return false;
        return new Date(key.expiresAt) < new Date();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">API Keys</h2>
                    <p className="text-muted-foreground">
                        Manage your API keys for accessing the application programmatically
                    </p>
                </div>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Key
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New API Key</DialogTitle>
                            <DialogDescription>
                                Create a new API key to access the application. The key will only be shown once.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={createApiKey}>
                            <div className="space-y-4 py-4">
                                <div>
                                    <label htmlFor="key-name" className="text-sm font-medium">
                                        Key Name
                                    </label>
                                    <Input
                                        id="key-name"
                                        placeholder="e.g., Production API Key, Development Key"
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                        className="mt-1"
                                        disabled={isCreating}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Give your API key a descriptive name to help you identify it later.
                                    </p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCreateDialog(false)}
                                    disabled={isCreating}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating ? "Creating..." : "Create API Key"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Newly Created Key Display */}
            {newlyCreatedKey && newlyCreatedKey.fullKey && (
                <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                            <CheckCircle className="h-5 w-5" />
                            API Key Created Successfully
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Name:</span>
                                <span className="text-sm">{newlyCreatedKey.name}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium">API Key:</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <code className="flex-1 p-2 bg-white dark:bg-gray-800 rounded border text-xs font-mono break-all">
                                        {newlyCreatedKey.fullKey}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyToClipboard(newlyCreatedKey.fullKey!, newlyCreatedKey.id)}
                                        className="flex-shrink-0"
                                    >
                                        {copiedKeyId === newlyCreatedKey.id ? (
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        <div className="text-sm text-orange-800 dark:text-orange-200">
                            <strong>Important:</strong> Save this API key securely now. It will not be shown again for security reasons.
                            Store it in a secure password manager or key vault.
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setNewlyCreatedKey(null)}
                            className="w-full"
                        >
                            I've saved the API key
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* API Keys List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Your API Keys
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-sm text-muted-foreground">Loading API keys...</div>
                        </div>
                    ) : apiKeys.length === 0 ? (
                        <div className="text-center py-8">
                            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No API keys found</h3>
                            <p className="text-muted-foreground mb-4">
                                Create your first API key to start using the application programmatically.
                            </p>
                            <Button onClick={() => setShowCreateDialog(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Your First API Key
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {apiKeys.map((key) => (
                                <div
                                    key={key.id}
                                    className={`flex items-center justify-between p-4 border rounded-lg ${
                                        isExpired(key)
                                            ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                                            : "border-gray-200 dark:border-gray-700"
                                    }`}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-medium">{key.name}</h3>
                                            {isExpired(key) ? (
                                                <Badge variant="destructive">Expired</Badge>
                                            ) : key.expiresAt ? (
                                                <Badge variant="secondary">Expires {format(new Date(key.expiresAt), "MMM dd, yyyy")}</Badge>
                                            ) : (
                                                <Badge variant="outline">Active</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <code className="font-mono">{maskApiKey(key)}</code>
                                            <span>Created {format(new Date(key.createdAt), "MMM dd, yyyy")}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete the API key "{key.name}"? This action cannot be undone.
                                                        Any applications using this key will lose access.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => deleteApiKey(key.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete Key
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Security Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security Best Practices
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <strong>Keep keys secure:</strong> Never share your API keys or expose them in client-side code.
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <strong>Use environment variables:</strong> Store API keys in environment variables or secure key vaults.
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <strong>Rotate regularly:</strong> Create new keys periodically and revoke old ones for enhanced security.
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <strong>Monitor usage:</strong> Keep track of which applications have access to your keys.
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}