import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketProvider";
import { Row, Col } from 'antd'
import './Home.css';

const HomePage = () => {
    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");

    const socket = useSocket();
    const navigate = useNavigate();

    const handleSubmitForm = useCallback(
        (e) => {
            e.preventDefault();
            socket.emit("room:join", { email, room });
        },
        [email, room, socket]
    );

    const handleJoinRoom = useCallback(
        (data) => {
            const { email, room } = data;
            navigate(`/room/${room}`);
        },
        [navigate]
    );

    useEffect(() => {
        socket.on("room:join", handleJoinRoom);
        return () => {
            socket.off("room:join", handleJoinRoom);
        };
    }, [socket, handleJoinRoom]);

    return (
        <div>
            <div className="heading">
                <h2>Welcome to My Translation Web Page</h2>
            </div>
            <form onSubmit={handleSubmitForm}>
                <Row className="heading">
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Row className='bottumPadd6'  gutter={8}>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <label htmlFor="email">Email ID</label>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className='bottumPadd6'  gutter={8}>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <label htmlFor="room">Room Number</label>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <input
                                    type="text"
                                    id="room"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row >
                            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="leftPadd">
                                <button style={{ width: "20%" }}>Join</button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </form>
        </div>
    );
};

export default HomePage;