import { SignUp } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth/auth-shell";
import {
  AFTER_AUTH_URL,
  getPathFromUrl,
  SIGN_IN_URL,
  SIGN_UP_URL,
} from "@/lib/auth-routes";

const signUpPath = getPathFromUrl(SIGN_UP_URL);

export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUp
        routing="path"
        path={signUpPath}
        signInUrl={SIGN_IN_URL}
        fallbackRedirectUrl={AFTER_AUTH_URL}
      />
    </AuthShell>
  );
}
