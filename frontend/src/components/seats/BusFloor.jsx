import Seat from "./Seat";
import steeringWheel from "../../assets/volang.png";

import "./BusFloor.css";

export default function BusFloor({
    floorNumber,
    seats,
    selectedSeats,
    onToggleSeat,
}) {
    const title = floorNumber === 1 ? "Tầng dưới"
        : floorNumber === 2 ? "Tầng trên" : `Tầng ${floorNumber}`;

    return (
        <section className="bus-floor" aria-label={title}>
            <h3 className="floor-title">{title}</h3>

            <div className="bus-floor__body">
                <div className="bus-floor__front">
                    <img
                        src={steeringWheel}
                        alt={floorNumber === 1 ? "Vô lăng" : ""}
                        aria-hidden={floorNumber !== 1}
                        className={`bus-floor__wheel${floorNumber !== 1 ? " bus-floor__wheel--placeholder" : ""}`}
                    />
                </div>

                <div className="bus-layout">
                    {seats.map((seat) => {
                        const isSelected = selectedSeats.includes(seat.id);

                        return (
                            <div
                                key={seat.id}
                                className="seat-position"
                                style={{
                                    gridRow: seat.rowNumber,
                                    gridColumn: seat.columnNumber,
                                }}
                            >
                                <Seat seat={seat} selected={isSelected} onToggleSeat={onToggleSeat} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
