import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20">
      <main className="flex items-center justify-center flex-1">
        {children}
      </main>
      <footer className="text-center text-sm text-muted-foreground py-4">
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign In
        </Link>{" "}
        <Link
          href="/register"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign Up
        </Link>{" "}
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-primary"
        >
          Get API Key
        </Link>
      </footer>
    </div>
  );
}