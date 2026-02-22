import AuthForm from '@/components/auth/AuthForm'

export default function AuthPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="relative w-full flex justify-center">
                <AuthForm />
            </div>
        </div>
    )
}
