import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SeatMap from "../../../components/seats/SeatMap";
import { isSeatSelectable, toggleSeatSelection } from "../../../components/seats/seatClickHandler";
import { useTripSeats, useTrip } from "../../../hooks";
import "./SeatsPage.css";

const currencyFormatter = new Intl.NumberFormat("vi-VN");

// Booking nó chỉ nhận id; nếu cần chi tiết ghế phải query lại trips
function normalizeSeat(seat) {
    const normalizePosition = (value) =>
        value == null ? null : Number(value);

    return {
        ...seat,
        id: Number(seat.id ?? seat.seatId ?? seat.seat_id),
        seatNumber: seat.seatNumber ?? seat.seat_number,
        floorNumber: normalizePosition(
            seat.floorNumber ?? seat.floor_number,
        ),
        rowNumber: normalizePosition(
            seat.rowNumber ?? seat.row_number,
        ),
        columnNumber: normalizePosition(
            seat.columnNumber ?? seat.column_number,
        ),
        status: seat.status === "ACTIVE" ? "AVAILABLE" : seat.status,
    };
}

export default function SeatSelectPage() {
    const { tripId } = useParams();
    return <TripSeatSelection key={tripId} tripId={tripId} />;
}

function TripSeatSelection({ tripId }) {
    const navigate = useNavigate();
    const tripQuery = useTrip(tripId);
    const seatsQuery = useTripSeats(tripId, {
        refetchInterval: 5_000,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: "always",
        refetchOnReconnect: "always",
    });
    const [selectedSeatIds, setSelectedSeats] = useState([]);
    const seats = useMemo(
        () => (seatsQuery.data ?? []).map(normalizeSeat),
        [seatsQuery.data],
    );
    const hasInvalidSeats = seats.some((seat) =>
        [seat.id, seat.floorNumber, seat.rowNumber, seat.columnNumber]
            .some((value) => !Number.isSafeInteger(value) || value < 1),
    ) || new Set(seats.map((seat) => seat.id)).size !== seats.length
        || new Set(seats.map((seat) =>
            `${seat.floorNumber}:${seat.rowNumber}:${seat.columnNumber}`,
        )).size !== seats.length;
    // Danh sách ghế available tính lại theo dữ liệu API mới nhất.
    const availableSeatIds = new Set(seats.filter(isSeatSelectable).map((seat) => seat.id));
    // Lọc lại những ghế user đã chọn theo điều kiện status: available
    const selectedSeats = selectedSeatIds.filter((id) => availableSeatIds.has(id));
    // so sánh ghế user chọn và số ghế available trong đó có khớp k
    const hasUnavailableSelection = selectedSeats.length !== selectedSeatIds.length;
    const total = selectedSeats.length * (Number(tripQuery.data?.price) || 0);
    const canContinue = selectedSeats.length > 0 && !hasUnavailableSelection && !seatsQuery.isError;

    const onToggleSeat = (seatId) => {
        if (!availableSeatIds.has(seatId)) return;
        setSelectedSeats((current) => toggleSeatSelection(
            current.filter((id) => availableSeatIds.has(id)),
            seatId,
        ));
    };

    if (!tripId) {
        return (
            <main className="seats-page">
                <p role="alert">Không tìm thấy mã chuyến xe.</p>
                <Link to="/">Quay lại</Link>
            </main>
        );
    }

    if (tripQuery.isPending || seatsQuery.isPending) {
        return <main className="seats-page" role="status">Đang tải sơ đồ ghế...</main>;
    }

    if ((tripQuery.isError && !tripQuery.data) || (seatsQuery.isError && !seatsQuery.data)) {
        const error = tripQuery.error ?? seatsQuery.error;
        return (
            <main className="seats-page">
                <p role="alert">Không thể tải sơ đồ ghế: {error.message}</p>
                <button type="button" onClick={() => {
                    tripQuery.refetch();
                    seatsQuery.refetch();
                }}>Thử lại</button>
            </main>
        );
    }

    if (hasInvalidSeats) {
        return (
            <main className="seats-page">
                <p role="alert">Dữ liệu vị trí ghế không hợp lệ. Vui lòng thử tải lại.</p>
                <button type="button" onClick={() => seatsQuery.refetch()}>Thử lại</button>
            </main>
        );
    }

    const handleContinue = () => {
        if (!canContinue) return;
        navigate("/booking", {
            state: {
                tripId: Number(tripId),
                selectedSeatIds: selectedSeats,
            },
        });
    };

    return (
        <main className="seats-page">
            <header className="seats-page__header">
                <h1>Chọn ghế cho chuyến #{tripId}</h1>
                <p>
                    {tripQuery.data.route?.departureCity} → {tripQuery.data.route?.destinationCity}
                    {" · "}
                    {Number(tripQuery.data.price).toLocaleString("vi-VN")}đ / ghế
                </p>
            </header>

            {seatsQuery.isError && (
                <p role="alert">Chưa cập nhật được trạng thái ghế. Vui lòng chờ hoặc thử lại.</p>
            )}
            {hasUnavailableSelection && (
                <div
                    className="notice-overlay"
                    onClick={(e) => {
                        e.currentTarget.style.display = "none";
                    }}
                >
                    <div
                        className="notice-wrapper"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p>⚠️ Có ghế đã được người khác đặt, vui lòng chọn lại.</p>
                    </div>
                </div>
            )}

            <div className="seats-page__wrapper">
                {seats.length === 0 ? (
                    <p role="status">Chuyến xe chưa có sơ đồ ghế.</p>
                ) : (
                    <SeatMap seats={seats} selectedSeats={selectedSeats} onToggleSeat={onToggleSeat} />
                )}

                <hr />

                <div className="seats-page__total">
                    <div aria-live="polite" aria-atomic="true">
                        Đã chọn {selectedSeats.length} ghế · Tổng cộng:{" "}
                        <strong>{currencyFormatter.format(total)}đ</strong>
                    </div>
                    <button
                        type="button"
                        disabled={!canContinue}
                        onClick={handleContinue}
                    >
                        Tiếp tục
                    </button>
                </div>
            </div>
        </main>
    );
}
