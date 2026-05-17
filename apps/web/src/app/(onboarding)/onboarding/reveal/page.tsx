'use client';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '@ember/lib';

export default function RevealPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-secondary text-white">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <div className="text-5xl">✨</div>
          <h1 className="font-display text-3xl font-bold">Your personalised experience</h1>
          <p className="text-white/70">Based on your identity, {APP_NAME} has unlocked:</p>
        </div>
        <div className="space-y-3 text-left">
          {[
            { icon: '💬', title: 'Prompts just for you', body: 'Questions shaped to your relationship style and identity' },
            { icon: '🎯', title: 'Relevant categories', body: 'Content filtered to what matters to your connection' },
            { icon: '🔒', title: 'Consent-first design', body: 'Every tier upgrade requires your individual consent' },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 rounded-xl bg-white/10 p-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-sm">{item.title}</div>
                <div className="text-white/70 text-xs mt-0.5">{item.body}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => router.push('/onboarding/paywall')}
          className="w-full rounded-lg bg-accent text-secondary px-4 py-3 text-sm font-bold hover:opacity-90">
          See your plan options →
        </button>
      </div>
    </div>
  );
}
