import PasswordGenerator from "@/components/password-generator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center font-dmsans bg-gradient-to-br from-green-200 to-white p-24">
      <h1 className="text-6xl font-bold mb-8">Password Generator</h1>
      <PasswordGenerator />
    </main>
  )
}

