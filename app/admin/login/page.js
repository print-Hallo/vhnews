import LoginForm from "./LoginForm"

export const metadata = {
  title: "Admin Login - News Site",
  description: "Admin authentication",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif">News Site</h1>
          <p className="text-muted-foreground mt-2">Admin Login</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
