import RegisterForm from '@/app/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
