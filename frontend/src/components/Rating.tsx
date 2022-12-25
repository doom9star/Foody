import React, { useCallback, useMemo, useState } from "react";
import { CAxios } from "../constants";

export function RenderRating({ ratings }: { ratings: number[] }) {
  const reviews = useMemo(() => {
    return ratings.reduce((p, c) => p + c, 0);
  }, [ratings]);

  const rating = useMemo(() => {
    return reviews === 0
      ? 0
      : parseFloat(
          (
            ratings.reduce((p, c, idx) => p + c * (idx + 1), 0) / reviews
          ).toFixed(1)
        );
  }, [ratings, reviews]);

  return (
    <div style={{ display: "flex" }}>
      {Array(Math.ceil(rating))
        .fill(0)
        .map(() => (
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#f7b00a",
              borderRadius: "50%",
              margin: "0.5rem",
            }}
          />
        ))}
      {Array(5 - Math.ceil(rating))
        .fill(0)
        .map(() => (
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#bdb7a8",
              borderRadius: "50%",
              margin: "0.5rem",
            }}
          />
        ))}
      <span>({reviews})</span>
    </div>
  );
}

type AskRatingProps = {
  restaurantId: number;
  onRated?: (rating: number) => void;
};

export function AskRating({ restaurantId, onRated }: AskRatingProps) {
  const [floatingRate, setFloatingRate] = useState(0);
  const [rate, setRate] = useState(0);

  const onSubmit = useCallback(() => {
    CAxios.post("/misc/rating", { rating: rate, restaurantId }).then(() => {
      setFloatingRate(0);
      setRate(0);
      onRated && onRated(rate);
    });
  }, [rate, restaurantId, onRated]);

  return (
    <div>
      <h3>Rate this restaurant</h3>
      <div style={{ display: "flex" }} onMouseLeave={() => setFloatingRate(0)}>
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              onClick={() => rate === 0 && setRate(idx + 1)}
              onMouseEnter={() => {
                if (rate === 0) setFloatingRate(idx + 1);
              }}
              style={{
                width: "10px",
                height: "10px",
                backgroundColor:
                  idx + 1 <= floatingRate || idx + 1 <= rate
                    ? "#f7b00a"
                    : "#bdb7a8",
                borderRadius: "50%",
                margin: "0.5rem",
              }}
            />
          ))}
      </div>
      {rate > 0 && <button onClick={onSubmit}>submit</button>}
    </div>
  );
}
