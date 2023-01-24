import { render } from "preact";
import "./index.css";

import { Provider } from "react-redux";
import { Ui } from "./ui";
import { dosSlice } from "./store/dos";
import { authenticate } from "./auth/auth";
import { store } from "./store";
import { initEmulators } from "./store/dos";
import { loadBundleFromUrl } from "./load";
import { uiSlice } from "./store/ui";

render(
    <Provider store={store}>
        {<Ui /> as any}
    </Provider>,
    document.getElementById("app") as HTMLElement,
);

let pollStep = "none";

function pollEvents() {
    const state = store.getState();
    const step = state.dos.step;

    if (step === pollStep) {
        return;
    }
    pollStep = step;

    switch (state.dos.step) {
        case "emu-ready": {
            // TODO:
            // / enter url screen
            // / parse params

            store.dispatch(uiSlice.actions.windowUpload());

            // const url = "https://cdn.dos.zone/original/2X/6/6a2bfa87c031c2a11ab212758a5d914f7c112eeb.jsdos";
            // const url = "https://cdn.dos.zone/custom/dos/doom.jsdos";
            // const url = "https://cdn.dos.zone/original/2X/7/744842062905f72648a4d492ccc2526d039b3702.jsdos"; // sim-city
            // loadBundleFromUrl(url, store.dispatch)
                // .catch((e) => store.dispatch(dosSlice.actions.bndError(e.message)));
        } break;
    };
}

store.subscribe(pollEvents);

authenticate(store);
initEmulators(store);
