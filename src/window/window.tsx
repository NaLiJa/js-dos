import { useSelector } from "react-redux";
import { State } from "../store";
import { DosWindow } from "./dos/dos-window";
import { EditorWindow } from "./editor/editor-window";
import { ErrorWindow } from "./error-window";
import { LoadingWindow } from "./loading-window";
import { PreRunWindow } from "./prerun-window";
import { UploadWindow } from "./upload-window";

export function Window(props: {}) {
    const frameOpened = useSelector((state: State) => state.ui.frame) !== "none";
    const window = useSelector((state: State) => state.ui.window);
    let windowComponent = null;
    switch (window) {
        case "error": {
            windowComponent = <ErrorWindow />;
        } break;
        case "loading": {
            windowComponent = <LoadingWindow />;
        } break;
        case "prerun": {
            windowComponent = <PreRunWindow />;
        } break;
        case "run": {
            windowComponent = <DosWindow />;
        } break;
        case "upload": {
            windowComponent = <UploadWindow />;
        } break;
        case "editor": {
            windowComponent = <EditorWindow />;
        }
        default: ;
    };
    return <div class="absolute w-full h-full flex flex-row">
        <div class={ (frameOpened ? "w-96" : "w-12") + " flex-shrink-0" }></div>
        {windowComponent}
    </div>;
}