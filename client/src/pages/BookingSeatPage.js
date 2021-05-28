import { useParams } from "react-router-dom";
import { useState, useEffect, useContext, useCallback } from "react";
import { MovieContext } from "../contexts/MovieContext";
import ChooseSeat from "../components/ChooseSeat";

export default function BookingSeatPage() {
  const { fetchOneShowtime } = useContext(MovieContext);
  const [showTime, setShowTime] = useState(null);
  const { id } = useParams();

  const fetchShow = useCallback(
    async (id) => {
      console.log(id);
      const show = await fetchOneShowtime(id);
      console.log(show);
      setShowTime(show);
    },
    [id, fetchOneShowtime]
  );

  const prices = [
    { standardPrice: showTime?.movie.price },
    { seniorPrice: showTime?.movie.price * 0.8 },
    { juniorPrice: showTime?.movie.price * 0.7 },
  ];

  useEffect(() => {
    console.log(id);
    fetchShow(id);
  }, [id, fetchShow]);

  console.log(showTime);

  return (
    <div className="container-fluid">
      <div className="booking_header">
        <div className="row justify-content-between showtime_info">
          <div className="col-3">
            <p>Back</p>
          </div>
        </div>
        <div className="row ">
          <div className="col-4 text-end">
            <img src={showTime?.movie.poster} alt="" />
          </div>
          <div className="col-8">
            <div className="row">
              <h1>{showTime?.movie.title}</h1>
              <div className="col-3 showtime_info--text">
                <span className="showtime_info--title">Saloon</span>
                <span>{showTime?.saloon.name}</span>
                <span className="showtime_info--title">Time</span>
                <span>{showTime?.time}</span>
                <span className="showtime_info--title">Date</span>
                <span>{showTime?.date}</span>
              </div>
            </div>
            <div className="row ticket_quantity">
              <div className="ticket_group">
                <span>Adult Price: {standardPrice}</span>
                <div className="ticket_minus" onClick={addStandardPrice}>
                  -
                </div>
                <span>{standardQuantity}</span>
                <div className="ticket_plus">+</div>
              </div>

              <div className="ticket_group">
                <span>Senior Price: {seniorPrice}</span>
                <div className="ticket_minus">-</div>
                <span></span>
                <div className="ticket_plus">+</div>
              </div>
              <div className="ticket_group">
                <span>Junior Price: {juniorPrice}</span>
                <div className="ticket_minus">-</div>
                <span></span>
                <div className="ticket_plus">+</div>
                <p> Totalprice: {totalStandardPrice}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 text-center ">
            <h2>Choose your seats</h2>
          </div>
          <ChooseSeat seats={showTime?.saloon.seatRows} />
        </div>
      </div>
    </div>
  );
}
