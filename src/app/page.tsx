import { PropertyForm } from '@/components/property-form';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-background to-secondary/30 py-8 px-4">
      <div className="w-full">
        <PropertyForm />
      </div>
    </main>
  );
}
