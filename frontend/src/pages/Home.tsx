import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:2722/api/v1/status/getStatus"; // Change this to your WebSocket server URL

const Home: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log("Connected to WebSocket");
            ws.send("fetchAllStatus"); // Request status data
        };

        ws.onmessage = (event: MessageEvent) => {
            let response = JSON.parse(event.data);
            console.log("Received:", response);
            if (response && response["event"] === "INITIAL_LOAD") {
                setMessages(response.data??[]);
            } else if(response && response["event"] === "STATUS_UPDATED") {
                setMessages(prevMessages => {
                    return prevMessages.map((message: any) => {
                        if (message._id === response.id) {
                            message.status = response.newStatus;
                        }
                        return message;
                    })
                });
            } else if(response && response["event"] === "SERVICE_CREATED") {
                setMessages(prevMessages => [...prevMessages, response.data]);
            } else if(response && response["event"] === "SERVICE_DELETED") {
                setMessages(prevMessages => {
                    return prevMessages.filter((message: any) => {
                        return message._id !== response.id
                    })
                });
            }
            // setMessages((prevMessages) => [...prevMessages, ...data]);
        };

        ws.onerror = (error: Event) => {
            console.error("WebSocket Error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket Disconnected");
        };

        return () => {
            ws.close(); // Cleanup WebSocket connection
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">WebSocket Data</h1>
            <ul className="mt-2">
                {messages.map((msg, index) => (
                    <li key={index} className="p-2 border-b">{JSON.stringify(msg)}</li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
