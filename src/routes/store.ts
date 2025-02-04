import { browser } from '$app/environment';
import { toBase64 } from '$lib/utils';
import { writable, type Writable } from 'svelte/store';

export const generatedImageID = writable<string>(
  (browser &&
    (() => {
      const storedID = localStorage.generatedImageID;
      const timestamp = localStorage.generatedImageIDTimestamp;
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

      if (storedID && timestamp && parseInt(timestamp) > fiveMinutesAgo) {
        return storedID;
      }
      return '';
    })()) ||
    ''
);

generatedImageID.subscribe((value: string) => {
  if (browser) {
    localStorage.generatedImageID = value;
    if (value) {
      localStorage.generatedImageIDTimestamp = Date.now().toString();
    }
  }
});

// https://replicate.delivery/pbxt/i7kFyUHuAnYIN9FUnvcdC3clAazucE5fBgOtueOfkk4XDZvkA/out_0.png
// https://replicate.delivery/pbxt/Fy3CXofV62UXe0ZfYduDqRFYYlSKWEd8vXN53YJkKA6KIZvkA/out_0.png

export const generationLoading = writable(false);
export const blobImage = writable<Blob | null>(null);
export const imageLoaded = writable(false);
export const highlightLogin = writable(false);
export const highlightStyles = writable(false);
export const highlightPhotoUpload = writable(false);

function hanleToggleStore(store: Writable<boolean>) {
  let storeTimeout: NodeJS.Timeout | null = null;
  store.subscribe((value) => {
    if (value) {
      storeTimeout = setTimeout(() => {
        store.set(false);
      }, 3_000);
    } else {
      if (storeTimeout) {
        clearTimeout(storeTimeout);
        storeTimeout = null;
      }
    }
  });
}
hanleToggleStore(highlightLogin);
hanleToggleStore(highlightStyles);
hanleToggleStore(highlightPhotoUpload);

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
  fetch(localStorage.blob)
    .then((r) => r.blob())
    .then((blob) => {
      blobImage.set(blob);
    })
    .catch((e) => {
      console.error(e);
    });
}
