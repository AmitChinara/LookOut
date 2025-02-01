import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const WS_URL = "ws://localhost:2722/api/v1/status/getStatus";
const API_BASE_URL = "http://localhost:2722/api/v1/status";

const Home: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { user } = useUser();

    let isAdmin = `${user?.organizationMemberships?.[0]?.role}` === "org:admin" || false;

    useEffect(() => {
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log("Connected to WebSocket");
            ws.send("fetchAllStatus");
        };

        ws.onmessage = (event: MessageEvent) => {
            let response = JSON.parse(event.data);
            console.log("Received:", response);
            if (response?.event === "INITIAL_LOAD") {
                setMessages(response.data ?? []);
            } else if (response?.event === "STATUS_UPDATED") {
                setMessages(prevMessages =>
                    prevMessages.map(message =>
                        message._id === response.id ? { ...message, status: response.newStatus } : message
                    )
                );
            } else if (response?.event === "SERVICE_CREATED") {
                setMessages(prevMessages => [...prevMessages, response.data]);
            } else if (response?.event === "SERVICE_DELETED") {
                setMessages(prevMessages => prevMessages.filter(message => message._id !== response.id));
            }
        };

        ws.onerror = (error: Event) => {
            console.error("WebSocket Error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket Disconnected");
        };

        return () => {
            ws.close();
        };
    }, []);

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
        const newStatus = e.target.value;

        try {
            const response = await fetch(`${API_BASE_URL}/updateStatus?id=${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            console.log(`Status for ${id} changed to ${newStatus}`);
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleCreateStatus = async (name: string, createdBy: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/createStatus`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, createdBy }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            console.log(`Status "${name}" created by ${createdBy}`);
        } catch (error) {
            console.error("Failed to create status:", error);
        }
    };

    const handleDeleteStatus = async () => {
        if (!selectedId) return;

        try {
            const response = await fetch(`${API_BASE_URL}/deleteStatus?id=${selectedId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            console.log(`Status with ID ${selectedId} deleted`);
            setSelectedId(null);
        } catch (error) {
            console.error("Failed to delete status:", error);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Status Management</h2>

            {/* Admin-only Create Status Form */}
            {isAdmin && (
                <div className="p-6 bg-white shadow-md rounded-lg mb-6">
                    <h3 className="text-xl font-semibold mb-4">Create New Status</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            handleCreateStatus(formData.get("name") as string, formData.get("createdBy") as string);
                            (e.target as HTMLFormElement).reset();
                        }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Service Name: </label>
                            <input
                                name="name"
                                id="name"
                                type="text"
                                required
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter service name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700">Created By: </label>
                            <input
                                name="createdBy"
                                id="createdBy"
                                type="text"
                                required
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your name"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md shadow-md hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
                        >
                            Create Status
                        </button>
                    </form>
                </div>
            )}

            {/* Status Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Select</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">ID</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Name</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {messages.map((msg) => (
                        <tr key={msg._id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">
                                <input
                                    type="radio"
                                    name="deleteStatus"
                                    onChange={() => setSelectedId(msg._id)}
                                />
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">{msg._id}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{msg.name}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">
                                <select
                                    value={msg.status}
                                    onChange={(e) => handleStatusChange(e, msg._id)}
                                    className="p-2 border border-gray-300 rounded-md"
                                    disabled={!isAdmin}
                                >
                                    <option value="Operational">Operational</option>
                                    <option value="Degraded Performance">Degraded Performance</option>
                                    <option value="Partial Outage">Partial Outage</option>
                                    <option value="Major Outage">Major Outage</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Button */}
            {isAdmin && selectedId && (
                <div className="mt-6">
                    <button
                        onClick={handleDeleteStatus}
                        className="w-full bg-red-500 text-white py-3 px-4 rounded-md shadow-md hover:bg-red-600 focus:ring-4 focus:ring-red-300"
                    >
                        Delete Selected Status
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
