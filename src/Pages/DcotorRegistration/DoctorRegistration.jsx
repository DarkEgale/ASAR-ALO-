

import { useState } from "react";

export default function DoctorRegistration(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [phone, setPhone] = useState('');
    const [availableTime, setAvailableTime] = useState('');

    const handleSubmit=(e)=>{
        e.preventDefault();
        const doctorData={
            name,
            email,
            password,
            specialization,
            phone,
            availableTime,
        }
        
        console.log(doctorData);
        const fecth=async()=>{
        const api= await fetch('http://localhost:5001/api/auth/doctors/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(doctorData)
        
    });
 }
 fecth();
    }




    return(
        <>
        
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} /><br />
            <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
            <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
            <input type="text" placeholder="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} /> <br />
            <input type="text" placeholder="phone" value={phone} onChange={(e) => setPhone(e.target.value)} /> <br />
            <input type="text" placeholder="available time" value={availableTime} onChange={(e) => setAvailableTime(e.target.value)} /> <br />
            <button type="submit">Register</button>
        </form>
        
        </>
    )
}