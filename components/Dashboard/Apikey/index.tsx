"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast, useToast } from "@/components/ui/use-toast";
import { Copy, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function APiKeyComponent() {
  const [newKeyName, setNewKeyName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const data = useQuery(api.apikey.list);
  const mutateCreate = useMutation(api.apikey.create);
  const muateDelete = useMutation(api.apikey.deleteApiKey);

  const handleCopyKey = useCallback(
    (key: string) => {
      navigator.clipboard.writeText(key);
      toast({
        title: "API Key Copied",
        description: "The API key has been copied to your clipboard.",
      });
    },
    [toast],
  );
  const handleCreateKey = useCallback(async () => {
    await mutateCreate({
      name: newKeyName,
    });
    setNewKeyName("");
    setIsDialogOpen(false);
    toast({
      title: "API Key Created",
      description: "Your new API key has been created successfully.",
    });
  }, [newKeyName, toast]);

  const handleDeleteKey = useCallback(
    async (id: string) => {
      await muateDelete({
        id: id as any,
      });
      toast({
        title: "API Key Deleted",
        description: "The API key has been deleted successfully.",
      });
    },
    [toast],
  );

  const renderSkeletonRows = () => {
    return Array(3).fill(null).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
        <TableCell className="flex gap-2 items-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full ml-2" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="container mx-auto py-10">
     <div className="flex justify-between items-center">
     <h1 className="text-2xl font-bold mb-5">API Keys</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-5">Create New API Key</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter key name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
            <Button onClick={handleCreateKey}>Create Key</Button>
          </div>
        </DialogContent>
      </Dialog>
     </div>
      {data && data.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No API keys found. Create a new one to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data ? (
              data.map((apiKey) => (
                <TableRow key={apiKey._id}>
                  <TableCell>{apiKey.name}</TableCell>
                  <TableCell>{apiKey.key.substring(0, 10)}...</TableCell>
                  <TableCell>
                    {new Date(apiKey._creationTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyKey(apiKey.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteKey(apiKey._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              renderSkeletonRows()
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
