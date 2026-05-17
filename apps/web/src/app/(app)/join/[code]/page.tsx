import { redirect } from 'next/navigation';

interface Props {
  params: { code: string };
}

export default function JoinPage({ params }: Props) {
  // Deep link handler — auto-fills invite code and redirects to onboarding/invite
  redirect(`/onboarding/invite?code=${params.code}`);
}
