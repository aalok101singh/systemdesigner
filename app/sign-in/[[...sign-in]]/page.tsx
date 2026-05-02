import { SignIn } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth/auth-shell";
import {
  AFTER_AUTH_URL,
  getPathFromUrl,
  SIGN_IN_URL,
  SIGN_UP_URL,
} from "@/lib/auth-routes";

const signInPath = getPathFromUrl(SIGN_IN_URL);

export default function SignInPage() {
  return (
    <AuthShell>
      <SignIn
        routing="path"
        path={signInPath}
        signUpUrl={SIGN_UP_URL}
        fallbackRedirectUrl={AFTER_AUTH_URL}
      />
    </AuthShell>
  );
}
