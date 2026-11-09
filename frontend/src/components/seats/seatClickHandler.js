export function isSeatSelectable(seat) {
    return seat.status === "AVAILABLE";
}

export function toggleSeatSelection(selectedSeatIds, seatId) {
    return selectedSeatIds.includes(seatId)
        ? selectedSeatIds.filter((id) => id !== seatId)
        : [...selectedSeatIds, seatId];
}
