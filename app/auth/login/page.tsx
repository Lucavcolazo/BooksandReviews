import LoginForm from '@/app/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
