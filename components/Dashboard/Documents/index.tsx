"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardDocuments = () => {
  const data = useQuery(api.document.list);
  
  if (data === undefined) {
    return (
      <div className="flex flex-col space-y-6">
        <div className="flex justify-end items-center">
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="bg-white shadow">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-end items-center">
          <Link
            href="/dashboard/new"
            className="bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium"
          >
            New Document
          </Link>
        </div>
        
        {data.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">
              No documents found. Create a new one to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((doc) => (
              <Link key={doc._id} href={`/dashboard/doc/${doc._id}`}>
                <Card
                  key={doc._id}
                  className="bg-white shadow hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold truncate">
                      {doc.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-xs">
                        {doc.doc_type}
                      </Badge>
                      <Badge variant="outline" className="text-xs font-medium">
                        {`v${doc.active_version}`}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
