import {SafeHtml} from "@angular/platform-browser";

export default interface IChatMessage {
    type: string,
    payload: string,
    displayHtml?: SafeHtml
}
