import RegisterForm from '@/app/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
