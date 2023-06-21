<script lang="ts">
	import BackdropContainer from '$lib/components/containers/BackdropContainer.svelte';
	import type {APIResponse, Shard} from "$types";
	import ShardComp from "$components/ShardComp.svelte";
	import {apiUrl} from "$lib/constants";

	let allShards: Shard[] = [];
	let filteredShards: Shard[] = [];

	const promise = fetch(`${apiUrl}?perPage=10000&sort=-quantity`)
		.then(res => res.json())
		.then((data: APIResponse) => {
			allShards = data.items as Shard[];
			filteredShards = allShards;
		})
		.catch(err => console.error(err));

	let searchQuery: string = "";
	let createQuery: string = "";

	function doSearch() {
		filteredShards = allShards.filter(shard => shard.name.toLowerCase().includes(searchQuery.toLowerCase()));
	}

	async function doCreate() {
		const data = {
			name: createQuery,
			quantity: 1,
		};
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};
		const res = await fetch(apiUrl, options);
		if (res.ok) {
			const newShard = await res.json();
			allShards.push(newShard);
			doSearch();
			createQuery = "";
		} else {
			console.error(res);
		}
	}

	async function doDelete(event: CustomEvent<Shard>) {
		// @ts-ignore
		const shard = event.detail.shard;
		const options = {
			method: "DELETE",
		};

		const res = await fetch(`${apiUrl}/${shard.id}`, options);
		if (res.status === 204) {
			allShards = allShards.filter(sh => sh.id !== shard.id);
			doSearch();
		} else {
			console.error(res);
		}
	}
</script>

<div class="form-control flex-1 items-center justify-center">
	<BackdropContainer>
		{#await promise then _}
			<div contenteditable="true"
			     class="input input-bordered input-primary w-full text-3xl text-left"
			     on:keyup={doSearch}
			     bind:innerHTML={searchQuery}>
				SEARCH
			</div>
			<div class="overflow-x-auto">
				<table class="table table-xs min-w-[80vw]">
					<thead>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Quantity</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredShards as shard}
							<ShardComp {shard} on:deleteShard={doDelete}/>
						{/each}
					</tbody>
					<tfoot>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Quantity</th>
						</tr>
					</tfoot>
				</table>
			</div>
			<div contenteditable="true"
			     class="input input-bordered input-primary w-full text-3xl text-left form-control"
			     on:focusout={doCreate}
			     on:submit={doCreate}
			     bind:innerHTML={createQuery}>
				ADD
			</div>
		{/await}
	</BackdropContainer>
</div>
