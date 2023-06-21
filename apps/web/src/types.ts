import type {IconDefinition} from '@fortawesome/fontawesome-svg-core';

export const themes = ['dark', 'light'] as const;
export type Theme = (typeof themes)[number];

export type NavLink = {
	target: {
		href: string;
		newTab?: boolean;
	};
	content: {
		text?: string;
		icon?: IconDefinition;
	};
};


export type APIResponse = {
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: object[];
};


export type Shard = {
	created: string;
	id: string;
	name: string;
	quantity: number;
	updated: string;
};
