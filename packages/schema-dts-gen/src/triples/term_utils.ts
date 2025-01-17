/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { NamedNode, Term } from "n3";

const https_start_re = /^https:/;
export function nameFromContext(
	term: NamedNode,
	context: string
): string | null {
	if (term.id.startsWith(context)) {
		return cleanName(term.id.replace(new RegExp(`^${context}`), ""));
	}

	if (context.startsWith("https:")) {
		return nameFromContext(term, context.replace(https_start_re, "http:"));
	}

	return null;
}

const non_hash_slash_start_re = /^[#/]/;
function cleanName(n: string | null): string | null {
	if (!n) return n;
	return n.replace(non_hash_slash_start_re, "");
}

const hash_start_re = /^#/;
export function namedPortionOrEmpty(term: NamedNode): string {
	const url = new URL(term.id);
	if (url.hash.startsWith("#")) return url.hash.replace(hash_start_re, "");
	const path = url.pathname.split("/");
	return path[path.length - 1];
}

export function namedPortion(term: NamedNode): string {
	const name = namedPortionOrEmpty(term);

	if (!name) {
		throw new Error(
			`Expected ${term.id} to have a short name (final path or hash), but found none.`
		);
	}
	return name;
}

export function shortStr(term: Term) {
	if (term.termType === "NamedNode") {
		return namedPortionOrEmpty(term) || term.value;
	}
	return term.value;
}
