<script lang="ts">
	import type {Shard} from "$types";
	import {apiUrl} from "$lib/constants";
	import {createEventDispatcher} from "svelte";

	const dispatch = createEventDispatcher();

	export let shard: Shard;

	let shardQuantity = shard.quantity;
	async function updateQuantity() {
		console.log(shardQuantity);
		shardQuantity = Number(shardQuantity);
		if (isNaN(shardQuantity)) {
			shardQuantity = shard.quantity;
			return;

		}
		const url = `${apiUrl}/${shard.id}`;
		const data = {
			name: shard.name,
			quantity: shardQuantity,
		};
		const options = {
			method: "PATCH",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		};
		const res = await fetch(url, options);
		if (res.ok) {
			shard.quantity = shardQuantity;
		} else {
			shardQuantity = shard.quantity;
		}


	}

	function deleteShard() {
		dispatch('deleteShard', {
			shard: shard
		});
	}
</script>

<template>
	<tr class="select-none" class:text-sky-500={shardQuantity > 10}>
		<th on:dblclick={deleteShard} class="hover:cursor-pointer hover:bg-pink-500">{shard.id}</th>
		<td>{shard.name}</td>
		<td bind:innerHTML={shardQuantity} contenteditable="true" on:focusout={updateQuantity}></td>
	</tr>
</template>
