import Link from "next/link";
import { AppLogo } from "../Logo";
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@/convex/_generated/api";
import { UserMenu } from "../UserMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await fetchQuery(
    api.users.viewer,
    {},
    { token: convexAuthNextjsToken() },
  );
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <header className="bg-white border-b">
        <div className="container mx-auto flex items-center justify-between py-2">
          <Link href="/dashboard" className="flex flex-shrink-0 items-center">
            <AppLogo gradientSize="size-8" iconSize="size-5" />
            <span className="ml-2 text-xl font-bold text-gray-900">DocGen</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button> */}
            <UserMenu email={viewer?.email || ""}>
              <img
                src={`https://api.dicebear.com/9.x/glass/svg?seed=${viewer?._id || ""}`}
                className="rounded-full size-8"
              />
            </UserMenu>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-6">
        {children}

        {/* <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search projects" className="pl-8 bg-white" />
            </div>
            <Button>Create Project</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {["docgen", "Project A", "Project B"].map((project) => (
            <Card key={project} className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{project}</CardTitle>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
            </Card>
          ))}
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">API Keys</h2>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <span className="font-mono text-sm break-all">sk_test_1234567890abcdef</span>
                </div>
                <Button variant="outline">Revoke</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200" />
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div> */}
      </main>
    </div>
  );
}
