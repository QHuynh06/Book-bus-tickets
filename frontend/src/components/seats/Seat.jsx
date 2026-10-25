import "./Seat.css";
import {unavailable, selectedBox, armchair} from "../../assets";
import { isSeatSelectable } from "./seatClickHandler";

export default function Seat({ seat, selected, onToggleSeat }) {
    const isUnavailable = !isSeatSelectable(seat);

    let image = armchair;

    if (isUnavailable) {
        image = unavailable;
    } else if (selected) {
        image = selectedBox;
    }

    const handleClick = () => {
        if (isUnavailable) return;
        onToggleSeat(seat.id);
    };

    return (
        <button
            type="button"
            className={`seat ${isUnavailable ? "seat--unavailable" : ""}`}
            onClick={handleClick}
            disabled={isUnavailable}
            aria-label={isUnavailable ? "Ghế không khả dụng" : selected ? "Ghế đang chọn" : "Ghế còn trống"}
            aria-pressed={!isUnavailable && selected}
        >
            <img src={image} alt="" className="seat__icon" />
        </button>
    );
}
