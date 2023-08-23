import { useDispatch, useSelector } from "react-redux";
import { useT } from "../i18n";
import { State } from "../store";
import { dosSlice } from "../store/dos";
import { uiSlice } from "../store/ui";
import { Checkbox } from "./checkbox";

export function Editor() {
    const t = useT();
    const dispatch = useDispatch();
    const editor = useSelector((state: State) => state.ui.editor);
    return <Checkbox
        class="mt-4"
        label={t("editor")}
        checked={editor}
        onChange={(e) => dispatch(uiSlice.actions.setEditor(e))}
    />;
}

export function MouseCapture() {
    const t = useT();
    const dispatch = useDispatch();
    const lock = useSelector((state: State) => state.dos.mouseCapture);
    return <Checkbox
        class="mt-4"
        label={t("mouse_lock")}
        checked={lock}
        onChange={(l) => dispatch(dosSlice.actions.mouseCapture(l))}
    />;
}

export function PauseCheckbox() {
    const t = useT();
    const dispatch = useDispatch();
    const paused = useSelector((state: State) => state.dos.paused);
    const disabled = useSelector((state: State) => state.ui.window) !== "run";
    return <Checkbox
        class="mt-4"
        label={t("pause")}
        checked={paused}
        disabled={disabled}
        onChange={(p) => dispatch(dosSlice.actions.paused(p))}
    />;
}

export function WorkerCheckbox() {
    const t = useT();
    const dispatch = useDispatch();
    const worker = useSelector((state: State) => state.dos.worker);
    const disabled = useSelector((state: State) => state.ui.window) === "run";
    return <Checkbox
        class="mt-4"
        label={t("worker")}
        checked={worker}
        disabled={disabled}
        onChange={(w) => dispatch(dosSlice.actions.dosWorker(w))}
    />;
}