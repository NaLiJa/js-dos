import { useDispatch, useSelector } from "react-redux";
import { appSlice } from "../app";
import { State } from "../store";

export function AccountButton(props: {
    class?: string,
}) {
    const loggedIn = useSelector((state: State) => state.auth.account) !== null;
    const dispatch = useDispatch();

    function onClick() {
        if (loggedIn) {
            //
        } else {
            dispatch(appSlice.actions.modalLogin());
        }
    }

    return <div class={"sidebar-button " +
        props.class} onClick={onClick}>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-full h-full">
            <path stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963
                    0m11.963 0A8.966 8.966 0 0112 21a8.966
                    8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>

        {loggedIn === false && <div class="sidebar-badge" />}
    </div>;
}
