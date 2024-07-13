import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketProvider";
import { Form, Row, Col, Button, Input } from 'antd'
import './Home.css';


const HomePage = () => {
    const [email, setEmail] = useState('');
    const [room, setRoom] = useState('');
    const [profileId, setProfileId] = useState('');

    const socket = useSocket();
    const navigate = useNavigate();

    const handleSubmitForm = useCallback(
        () => {
            socket.emit("room:join", { email, room, profileId });
        },
        [email, room,profileId, socket]
    );

    const handleJoinRoom = useCallback(
        (data) => {
            const {  room, profileId } = data;
            if (room && profileId) {
                navigate(profileId === '1' ? `/room/${room}` : `/listenerRoom/${room}`);
            }
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
        <div className="container">
            <h1>Welcome to My Translation Web Page</h1>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}

                initialValues={{
                    remember: true,
                }}
                onFinish={handleSubmitForm}
                autoComplete="off"
            >
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Email ID"
                                name="email"
                                rules={[{ required: true, message: 'Please Enter Email ID' },
                                ]}
                            >
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Room Number"
                                name="room"
                                rules={[{ required: true, message: 'Please Enter Room Number' },
                                ]}
                            >
                                <Input
                                    type="number"
                                    id="room"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Profile ID"
                                name="profile"
                                rules={[{ required: true, message: 'Please Enter Profile ID' },
                                ]}
                            >
                                <Input
                                    type="number"
                                    id="profile"
                                    value={profileId}
                                    onChange={(e) => setProfileId(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Join
                                </Button>
                            </Form.Item>
                        </Col>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default HomePage;