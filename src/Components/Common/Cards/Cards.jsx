import React from 'react';
import { MapPin, Star, Clock, ArrowRight } from 'lucide-react';
import './Card.scss';

const Card = ({ doctor, onBookNow }) => {

    const data = doctor 

    const handleBookNow = () => {
        if (onBookNow) {
            onBookNow(doctor);
        }
    };

    return (
        <div className="custom-card">
            <div className="card-image">
                <img src={`https://asar-alo.onrender.com${data.image}` || "https://via.placeholder.com/300x200"} alt={data.name} />
                <div className="badge">Available</div>
            </div>

            <div className="card-body">
                <span className="category">{data.specialization}</span>
                <h3>{data.name}</h3>

                <div className="info-row">
                    <MapPin size={14} />
                    <span>{data.location || "Natore Sadar Hospital"}</span>
                </div>

                <div className="info-row">
                    <Clock size={14} />
                    <span>{data.experience || "10 Years Exp."}</span>
                </div>

                <div className="info-row" style={{ color: '#f59e0b' }}>
                    <Star size={14} fill="#f59e0b" />
                    <span style={{ fontWeight: '600' }}>{data.rating || "4.9"} (120 Reviews)</span>
                </div>

                <div className="card-footer">
                    <div className="price">{data.fee ? `${data.fee} BDT` : "500 BDT"}</div>
                    <button className="book-btn" onClick={handleBookNow}>
                        Book Now <ArrowRight size={14} style={{ marginLeft: '5px' }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;