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

import type {Store} from 'n3';
import {GetTypes, IsType, type TypedTopic} from './wellKnown.js';

export function asTopicArray(store: Store): TypedTopic[] {
  return Array.from(store.getSubjects(null,null,null), (subject) => {
    const topic = {
      subject,
      quads: store.getQuads(subject, null, null, null),
    };
    return {
      subject: topic.subject,
      quads: topic.quads.filter(value => !IsType(value.predicate)),
      types: GetTypes(topic.quads),
    };
  })
}
