import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect, useContext, useCallback } from 'react';
import { MovieContext } from '../contexts/MovieContext';
import ChooseSeat from '../components/ChooseSeat';
import TicketSummary from '../components/TicketSummary';
import TicketGroup from '../components/TicketGroup';
import { CartContext } from '../contexts/CartContext';

export default function BookingSeatPage() {
  const { fetchOneShowtime } = useContext(MovieContext);
  const { cart, setCart } = useContext(CartContext);
  const [showTime, setShowTime] = useState(null);
  const [selected, setSelected] = useState([]);
  const [booked, setBooked] = useState([]);
  const [error, setError] = useState(null);

  let init = {
    adult: { price: showTime?.movie.price, quantity: 0 },
    senior: { price: showTime?.movie.price * 0.8, quantity: 0 },
    junior: { price: showTime?.movie.price * 0.7, quantity: 0 },
  };
  const [tickets, setTickets] = useState({});
  console.log(tickets);
  const { id } = useParams();
  const history = useHistory();

  const fetchShow = useCallback(
    async (id) => {
      console.log(id);
      const show = await fetchOneShowtime(id);
      console.log(show);
      setShowTime(show);
      setBooked(show.booked);
    },
    [fetchOneShowtime]
  );

  const handleQuantity = (type, minus) => {
    setSelected([]);
    if (minus) {
      if (tickets[type].quantity === 0) return;

      setTickets({
        ...tickets,
        [type]: { ...tickets[type], quantity: tickets[type].quantity - 1 },
      });
    } else {
      setTickets({
        ...tickets,
        [type]: { ...tickets[type], quantity: tickets[type].quantity + 1 },
      });
    }
  };

  const getTotalPrice = () => {
    const ticketArray = Object.values(tickets);
    const sum = ticketArray.reduce((a, b) => {
      return a + b.price * b.quantity;
    }, 0);
    return sum;
  };

  useEffect(() => {
    console.log(id);
    fetchShow(id);
  }, [id, fetchShow]);

  useEffect(() => {
    setTickets(init);
  }, [showTime]);

  console.log(showTime);

  const submitBooking = async () => {
    let numOfTickets = Object.values(tickets).reduce(
      (a, b) => a + b.quantity,
      0
    );
    if (selected.length < numOfTickets) {
      setError('Please select a seat for all tickets');
      return;
    }
    if (numOfTickets === 0) {
      setError('Please choose your tickets');
      return;
    }

    const booking = await fetch('http://localhost:3001/api/bookShowtime', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        showTime: showTime._id,
        seats: selected,
        tickets: Object.entries(tickets).map(([key, value]) => ({
          [key]: value,
        })),
      }),
    });
    const bookingJson = await booking.json();
    setCart([...cart, bookingJson._id]);
    fetchShow(id);
    setSelected([]);
    history.push("/checkout")
  };

  return (
    <div className='container-fluid'>
      <div className='booking_header'>
        <div className=' arrow_back' onClick={() => history.goBack()}>
          <div className='arrow'></div>
          <p className='back_btn'>Back</p>
        </div>
        <div className=' showtime_info--text'>
          <div className='showtime_info_group'>
            <span>Saloon</span>
            <span>{showTime?.saloon.name}</span>
          </div>
          <div className='showtime_info_group'>
            <span>Time</span>
            <span>{showTime?.time}</span>
          </div>
          <div className='showtime_info_group'>
            <span>Date</span>
            <span>{showTime?.date}</span>
          </div>
        </div>

        <div className='showtime_poster'>
          <img src={showTime?.movie.poster} alt='' />
        </div>

        <div className='showtime_title'>
          <h1>{showTime?.movie.title}</h1>
        </div>
        <div className='showtime_tickets'>
          <h4>Tickets</h4>
          <TicketGroup
            tickets={tickets}
            type={'adult'}
            handleQuantity={handleQuantity}
          />
          <TicketGroup
            tickets={tickets}
            type={'senior'}
            handleQuantity={handleQuantity}
          />
          <TicketGroup
            tickets={tickets}
            type={'junior'}
            handleQuantity={handleQuantity}
          />
        </div>
        <div className='showtime_ticket--summary d-none d-lg-flex'>
          <TicketSummary
            tickets={tickets}
            selected={selected}
            getTotalPrice={getTotalPrice}
            submitBooking={submitBooking}
            error={error}
          />
        </div>
      </div>
      <div className='row choose_seat'>
        <div className='col-12 text-center '>
          <h2>Choose your seats</h2>
        </div>
        <ChooseSeat
          seats={showTime?.saloon.seatRows}
          tickets={tickets}
          selected={selected}
          setSelected={setSelected}
          booked={booked}
          setError={setError}
        />
      </div>

      <div className='showtime_ticket--summary d-lg-none'>
        <TicketSummary
          tickets={tickets}
          selected={selected}
          getTotalPrice={getTotalPrice}
          setError={setError}
          submitBooking={submitBooking}
          error={error}
        />
      </div>
    </div>
  );
}
