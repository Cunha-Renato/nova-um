import { api } from "../../convex/_generated/api";
import { useQuery, useMutation } from "convex-solidjs";
import { createSignal, For, Show } from "solid-js";

export default function Convex() {
	const [val, setVal] = createSignal(0);

	const values = useQuery(api.test.query.list, {});
	const add_value = useMutation(api.test.mutation.create);

	const handleAdd = async () => {
		await add_value.mutateAsync({ value: val() });
		setVal(0);
	};

	return (
		<div>
			<h1>VALUES</h1>
			<div>
				<input
					type="number"
					oninput={(e) => setVal(Number(e.currentTarget.value))}
					onkeydown={(e) => e.key === "Enter" && handleAdd()}
					placeholder="Write a number"
				/>
				<button
					type="button"
					onclick={handleAdd}
					disabled={add_value.isLoading()}
				>
					{add_value.isLoading() ? "Adding..." : "Add"}
				</button>
			</div>

			<Show when={!values.isLoading()} fallback={<p>Loading...</p>}>
				<Show when={values.error()}>
					<p>Error: {values.error()?.message}</p>
				</Show>
			</Show>

			<For each={values.data()} fallback={<p>No values yet!</p>}>
				{(value) => <div>{value.value}</div>}
			</For>
		</div>
	);
}
