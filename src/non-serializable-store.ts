import { CommandInterface, InitFs } from "emulators";
import { Cache, CacheNoop } from "./host/lcache";
import { DosOptions } from "./public/types";

export interface LoadedBundle {
    bundleUrl: string | null,
    bundleChangesUrl: string | null,
    bundle: InitFs | null,
    bundleChanges: Uint8Array | null,
}

export const nonSerializableStore: {
    root: HTMLDivElement,
    loadedBundle: LoadedBundle | null,
    ci: CommandInterface | null,
    cache: Cache,
    options: Partial<DosOptions>,
} = {
    root: null as any,
    loadedBundle: null,
    ci: null,
    cache: new CacheNoop(),
    options: {},
};

export const postJsDosEvent: DosOptions["onEvent"] = (event, ci) => {
    if (nonSerializableStore.options.onEvent) {
        setTimeout(() => {
            nonSerializableStore.options.onEvent?.(event, ci);
        }, 4);
    }
};
