import BusFloor from "./BusFloor";
import SeatNote from "./SeatNote";

import "./SeatMap.css";

export default function SeatMap({
    seats,
    selectedSeats,
    onToggleSeat,
}) {
    const floors = new Map();
    for (const seat of seats) {
        if (!floors.has(seat.floorNumber)) floors.set(seat.floorNumber, []);
        floors.get(seat.floorNumber).push(seat);
    }

    return (
        <div className="seat-section">
            <SeatNote />
            <div className="seat-map">
                {[...floors].sort(([a], [b]) => a - b).map(([floorNumber, floorSeats]) => (
                    <BusFloor
                        key={floorNumber}
                        floorNumber={floorNumber}
                        seats={floorSeats}
                        selectedSeats={selectedSeats}
                        onToggleSeat={onToggleSeat}
                    />
                ))}
            </div>
        </div>
    );
}
