import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { createEffect, JSX, Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";
import { ConvexProvider, setupConvex } from "convex-solidjs";
import { ClerkProvider, useAuth } from "clerk-solidjs";
import Login from "./components/login";

const client = setupConvex(import.meta.env.VITE_CONVEX_URL);

function ConvexAuth(props: { children: JSX.Element }) {
	const { getToken, isSignedIn } = useAuth();

	createEffect(() => {
		if (isSignedIn()) {
			client.setAuth(
				async ({ forceRefreshToken }) => {
					return await getToken({
						// template: "convex",
						skipCache: forceRefreshToken,
					});
				},
				() => isSignedIn() ?? false,
			);
		}
	});

	return <>{props.children}</>;
}

function ClerkConvexProvider(props: { children: JSX.Element }) {
	return (
		<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
			<ConvexProvider client={client}>
				<ConvexAuth>{props.children}</ConvexAuth>
			</ConvexProvider>
		</ClerkProvider>
	);
}

export default function App() {
	return (
		<ClerkConvexProvider>
			<Router
				root={(props) => (
					<>
						<Login>
							<Nav />
							<Suspense>{props.children}</Suspense>
						</Login>
					</>
				)}
			>
				<FileRoutes />
			</Router>
		</ClerkConvexProvider>
	);
}
