### Error 1 
In the evals.json the particular block of code :

    {
      "id": 5,
      "prompt": "i'm updating user metadata to add a 'plan' field but it keeps deleting the existing 'role' field. what am i doing wrong?",
      "expected_output": "Metadata updates overwrite not merge. Read existing metadata first, spread it, then write back.",
      "scaffold": "nextjs-basic-auth",
      "expectations": [
        "Explains that updateUser publicMetadata replaces all existing metadata, not merges",
        "Shows reading the existing user first with getUser(userId)",
        "Spreads existing metadata before adding new fields ({ ...user.publicMetadata, plan: 'pro' })",
        "Calls updateUser with the merged metadata object",
        "Warns that this applies to publicMetadata, privateMetadata, and unsafeMetadata equally"
      ]
    },

has this error showing up :

Missing files property in eval 5.

Eval 5 is missing the files array that other evaluations include. While this may be intentional, it creates an inconsistent schema across the evaluation entries.

     {
       "id": 5,
       "prompt": "i'm updating user metadata to add a 'plan' field but it keeps deleting the existing 'role' field. what am i doing wrong?",
       "expected_output": "Metadata updates overwrite not merge. Read existing metadata first, spread it, then write back.",
       "scaffold": "nextjs-basic-auth",
+      "files": [],
       "expectations": [


### Error 2
In the file extract-endpoint-detail.sh, after reading the entire file the code reviewer threw this error :

CRLF line endings will break the here-document parsing.

The static analysis error indicates the file contains Windows-style CRLF (\r\n) line endings. The shell interpreter sees the heredoc delimiter as 'SCRIPT'\r instead of 'SCRIPT', causing a parse failure. This script will not execute correctly on Unix systems.

Convert the file to Unix line endings (LF only):

# Fix with sed or dos2unix
sed -i 's/\r$//' .agents/skills/clerk-backend-api/scripts/extract-endpoint-detail.sh
# Or: dos2unix .agents/skills/clerk-backend-api/scripts/extract-endpoint-detail.sh


### Error 3
In the file extract-tag-endpoints.sh, after reviewing by the code reviewer, it threw this error :

Fix CRLF line endings in the heredoc.

Static analysis (Shellcheck SC1044) indicates the heredoc delimiter SCRIPT has Windows-style CRLF line endings (\r\n), which prevents the shell from finding the end token. This will cause the script to fail.

Convert the file to Unix line endings (LF only):

# Fix with dos2unix or sed
dos2unix .agents/skills/clerk-backend-api/scripts/extract-tag-endpoints.sh
# OR
sed -i 's/\r$//' .agents/skills/clerk-backend-api/scripts/extract-tag-endpoints.sh


### Error 4
In the file custom-sign-in.md, in the code block :

  const handleSubmit = async (formData: FormData) => {
    const emailAddress = formData.get('email') as string
    const password = formData.get('password') as string

    await signIn.password({
      emailAddress,
      password,
    })


The code reviwer threw this error :

Fix parameter name in documented API example: use emailAddress instead of identifier for signIn.password().

The documented example at lines 24-27 uses identifier, but the complete example at lines 194-201 correctly uses emailAddress with the same signIn.password() method. The newer Clerk custom flows API expects emailAddress for the password authentication step, not identifier. Update the documentation snippet to match:

const { error } = await signIn.password({
  emailAddress: 'user@example.com',
  password: 'securePassword123',
})


### Error 5
In the file custom-sign-up.md, the particular code block :

    // For email OTP: change create({ phoneNumber }) to create({ emailAddress })
    const error = await signUp.create({ phoneNumber })

The code reviewer threw this error:

Replace legacy Core 2 API with Core 3 step method.

Line 170 uses signUp.create({ phoneNumber }), which is the deprecated Core 2 API. This method is not in the documented Core 3 API because it has been superseded. In Core 3, use the step methods (e.g., signUp.phoneCode()) instead of create(). For the phone OTP sign-up flow, update the example to call the appropriate Core 3 method.


### Error 6
In the file SKILL.md, the block of code :

| Auth not working on API routes | Missing matcher | Add `'/(api\\|trpc)(.*)'` to `proxy.ts` (Next.js <=15: `middleware.ts`) |


The error thrown by the code review is :

Fix table formatting - escape the pipe character.

The | character in '/(api\\|trpc)(.*)' is being interpreted as a column separator, causing the table to have 4 columns instead of 3. Escape the pipe with a backslash or wrap in inline code with HTML entities.

-| Auth not working on API routes | Missing matcher | Add `'/(api\\|trpc)(.*)'` to `proxy.ts` (Next.js <=15: `middleware.ts`) |
+| Auth not working on API routes | Missing matcher | Add `'/(api\|trpc)(.*)'` to `proxy.ts` (Next.js <=15: `middleware.ts`) |
Or use HTML entity &#124; for the pipe inside the backticks if the single backslash still causes issues.

### Error 7
In the file api-routes.md, the particular code block :

```typescript
export async function GET(req: Request, { params }: { params: { orgId: string } }) {
  const { userId, orgId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (orgId !== params.orgId) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const orgData = await db.orgs.findUnique({ where: { id: orgId } });
  return Response.json(orgData);
}
```


The code reviewer threw this error :

Update code example to Next.js 15+ async params pattern.

Route handler params became a Promise in Next.js 15. The example at lines 39-48 uses the pre-v15 synchronous pattern and should be updated:

export async function GET(req: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const { userId, orgId: requestOrgId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (requestOrgId !== orgId) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const orgData = await db.orgs.findUnique({ where: { id: orgId } });
  return Response.json(orgData);
}
Failing to await params will cause runtime errors in Next.js 15+.


### Error 8

In the file server-actions.md, the code block :

  const result = await db.projects.deleteMany({
    where: { id: projectId, organizationId: orgId },
  });
  if (result.count === 0) throw new Error('Project not found');
  }
}

The error given by the code reviewer is :

CodeRabbit
Fix syntax error: extra closing brace.

The RBAC example has an extra closing brace on line 56, resulting in invalid TypeScript syntax.

   const result = await db.projects.deleteMany({
     where: { id: projectId, organizationId: orgId },
   });
   if (result.count === 0) throw new Error('Project not found');
-  }
 }


### Error 9

Read the file SKILL.md and for the parrticular block of code :

| Level | Issue | Solution |
|-------|-------|----------|
| CRITICAL | Missing `await` on `auth()` | In Next.js 15+, `auth()` is async: `const { userId } = await auth()` |
| CRITICAL | Exposing `CLERK_SECRET_KEY` | Never use secret key in client code; only `NEXT_PUBLIC_*` keys are safe |
| HIGH | Missing middleware matcher | Include API routes: `matcher: ['/((?!.*\\..*\\|_next).*)', '/']` |
| HIGH | ClerkProvider placement | Must be inside `<body>` in root layout (Core 2: could wrap `<html>`) |
| HIGH | Auth routes not public | Allow `/sign-in`, `/sign-up` in middleware config |
| HIGH | Landing page requires auth | To keep "/" public, exclude it: `matcher: ['/((?!.*\\..*\\|_next\\|^/$).*)', '/api/(.*)']` |
| MEDIUM | Wrong import path | Server code uses `@clerk/nextjs/server`, client uses `@clerk/nextjs` |
| MEDIUM | Wrong package name | Use `@clerk/react` not `@clerk/clerk-react` (Core 2 naming) |

The error shown by the code reviewer is :


Table rows with regex patterns break markdown rendering.

Lines 236 and 239 contain pipe characters (|) within regex patterns that are interpreted as table column delimiters, causing malformed table output. Escape the pipes or use inline code blocks for the regex.

-| HIGH | Missing middleware matcher | Include API routes: `matcher: ['/((?!.*\\..*\\|_next).*)', '/']` |
-| HIGH | Auth routes not public | Allow `/sign-in`, `/sign-up` in middleware config |
-| HIGH | Landing page requires auth | To keep "/" public, exclude it: `matcher: ['/((?!.*\\..*\\|_next\\|^/$).*)', '/api/(.*)']` |
+| HIGH | Missing middleware matcher | Include API routes: `matcher: ['/((?!.*\\..*\|_next).*)', '/']` |
+| HIGH | Auth routes not public | Allow `/sign-in`, `/sign-up` in middleware config |
+| HIGH | Landing page requires auth | To keep "/" public, exclude it: `matcher: ['/((?!.*\\..*\|_next\|^/$).*)', '/api/(.*)']` |
Note: Escape pipes using \| or place entire regex in backticks that markdown won't parse as delimiters. Alternatively, restructure the table.


### Error 10

Read evals.json file and for the block of code :

        "Shows SignIn/SignUp components or redirect-based auth flow",
        "Sets up NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY or VITE_CLERK_PUBLISHABLE_KEY env var"
      ]

The error thrown by the code review is :

Env var prefix inconsistency for Vite SPA.

The expectation mentions NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, but this is a Next.js-specific prefix. For a Vite SPA (eval 4's scenario), only VITE_CLERK_PUBLISHABLE_KEY should be expected.

-        "Sets up NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY or VITE_CLERK_PUBLISHABLE_KEY env var"
+        "Sets up VITE_CLERK_PUBLISHABLE_KEY env var"


### Error 11
Read the file layout.tsx and for the code block :

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";

The code review is throwing an error :

Correct the Clerk theme import path.

The import import { dark } from "@clerk/ui/themes" is incorrect. The dark theme must be imported from @clerk/themes:

import { dark } from "@clerk/themes";
The current path @clerk/ui/themes is not a valid export and will cause a module not found error at runtime.

### Error 12
Read the file textarea.tsx and for the particular block of code :

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )

The code review throws this error :

Update border-radius to match UI context guidelines and address field-sizing-content browser support.

Two issues need resolution:

Border radius: The component uses rounded-lg, but per context/ui-context.md, inline/small UI elements should use rounded-xl. Update both the className to use rounded-xl and verify the Input component has the same issue.

field-sizing-content browser support: As of May 2026, this CSS property is not yet supported in Firefox (expected in Firefox 152). This affects a significant portion of users. Either remove field-sizing-content and use traditional sizing (e.g., min-h-16), or add a feature detection fallback and document the limitation.


### Error 13

Read the file package.json and for the block of

    "shadcn": "^4.6.0",

The code reviewer is throwing this error :

Move shadcn from dependencies to devDependencies.

shadcn is a CLI tool used only during development to scaffold components (e.g., npx shadcn@latest add). It's not imported at runtime and should not be in dependencies. Move it to devDependencies or remove it entirely and use npx shadcn@latest as needed.

### What to do?
    I want you to analyse these errors very minutely and send me back the detailed analysis and a fix and I will let you know if you have the green light or not, create no new errors.
