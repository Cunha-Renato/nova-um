import { SignedIn, SignedOut, SignInButton, UserButton } from "clerk-solidjs";
import type { JSX } from "solid-js";

export default function Login(props: { children: JSX.Element }) {
	return (
		<div>
			<SignedOut>
				<SignInButton />
			</SignedOut>
			<SignedIn>
				<UserButton />
				{props.children}
			</SignedIn>
		</div>
	);
}
