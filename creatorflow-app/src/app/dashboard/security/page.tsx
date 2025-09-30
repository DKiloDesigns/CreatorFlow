import { redirect } from 'next/navigation';

export default function SecurityRootRedirect() {
  redirect('/dashboard/security/account');
  return null;
}