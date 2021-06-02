import React, { useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import TicketCard from "../components/TicketCard";
import { useHistory } from "react-router-dom";

const PreviousBookings = () => {
  const { userBookings, loggedInUser, getUserBookings } =
    useContext(UserContext);

  useEffect(() => {
    getUserBookings();
  }, []);
  const history = useHistory();

  //This function checks if each bookings showtime date property has passed todays date
  const countDate = (booking) => {
    //Get todays date
    let todaysDate = new Date();
    //Get showtimes date value
    let showtimeDate = new Date(booking.showtime.date);
    //Subtract the two and return true of false if the showtime has passed or not
    return showtimeDate > todaysDate;
  };

  //Function that checks if bookings exists so page dosen't crash
  const bookingsStored = () => {
    if (userBookings && userBookings.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="bookingsWrapper">
      <h1>Previous bookings</h1>
      {loggedInUser && bookingsStored() ? (
        userBookings.map((booking, index) => {
          return countDate(booking) ? (
            <>
              <h2>{booking.showtime.movie.title}</h2>
              <TicketCard key={index} booking={booking} />
            </>
          ) : null;
        })
      ) : (
        <>
          <h3>You have no previous bookings...</h3>
          <button onClick={() => history.push("/")}>Go to home</button>
        </>
      )}
    </div>
  );
};

export default PreviousBookings;
