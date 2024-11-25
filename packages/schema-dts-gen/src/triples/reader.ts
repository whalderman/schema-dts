/**
 * Copyright 2023 Google LLC, 2024 Warren Halderman
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
import fs from 'fs/promises';

import { Parser, Store } from 'n3';
import type { Quad } from 'n3';

function asQuads(data: string): Quad[] {
  return new Parser({}).parse(data);
}

/**
 * Loads schema all Triples from a given Schema file and version.
 */
export async function load(url: string): Promise<Store> {
  const quads = await handleUrl(url);
  return process(quads);
}

/**
 * does the same as load(), but for a local file
 */
export async function loadFile(path: string): Promise<Store> {
  const quads = await handleFile(path);
  return process(quads);
}

async function handleFile(path: string): Promise<Quad[]> {
  const fileStr = await fs.readFile(path, { encoding: 'utf8' });
  return asQuads(fileStr);
}

async function handleUrl(url: string): Promise<Quad[]> {
  const res = await fetch(url);
  const text = await res.text();
  return asQuads(text);
}

export function process(quads: Quad[]): Store {
  // Inexplicably, local files end up in the public schema for
  // certain layer overlays. (?)
  const filtered = quads.filter((quad) => !(
    quad.subject.termType === 'NamedNode' &&
    quad.subject.value.includes('file:///')
  ));
  return new Store(filtered);
}
