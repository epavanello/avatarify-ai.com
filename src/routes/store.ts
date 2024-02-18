import { browser } from '$app/environment';
import { toBase64 } from '$lib/utils';
import { writable } from 'svelte/store';

export const generatedImageID = writable((browser && localStorage.generatedImageID) || '');

generatedImageID.subscribe(async (value) => {
  if (browser) {
    console.log('new value');
    localStorage.generatedImageID = value;
  }
});

// https://replicate.delivery/pbxt/i7kFyUHuAnYIN9FUnvcdC3clAazucE5fBgOtueOfkk4XDZvkA/out_0.png
// https://replicate.delivery/pbxt/Fy3CXofV62UXe0ZfYduDqRFYYlSKWEd8vXN53YJkKA6KIZvkA/out_0.png

export const generationLoading = writable(false);
export const blobImage = writable<Blob | null>(null);

let skip = true;

blobImage.subscribe(async (value) => {
  if (skip) {
    skip = false;
    return;
  }
  if (browser) {
    if (value) {
      localStorage.blob = await toBase64(value);
    } else {
      localStorage.blob = '';
    }
  }
});

if (browser && localStorage.blob) {
  try {
    blobImage.set(await fetch(localStorage.blob).then((r) => r.blob()));
  } catch (error) {
    console.error(error);
  }
}
