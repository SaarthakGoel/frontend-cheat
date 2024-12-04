import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import socket from "../../socket/socket";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messageArr, setMessageArr] = useState([]);

  const chatEndRef = useRef(null);

  const roomData = useSelector((state) => state.room);

  useEffect(() => {
    // Listen for chat messages from the server
    socket.on("chatSended", ({ name, message }) => {
      setMessageArr((prevMessages) => [...prevMessages, { name, message }]);
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("chatSended");
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom when a new message is added
    if(chatEndRef){
      const divHeight = chatEndRef.current.clientHeight; // Visible height of the div
      const scrollHeight = chatEndRef.current.scrollHeight; // Total scrollable height of the div

      const scrollByAmount = scrollHeight - divHeight;

      // Scroll the div
      chatEndRef.current.scrollBy({
        top: scrollByAmount, // Adjust scroll position
        behavior: "smooth", // Smooth scrolling animation
      });
    }
  }, [messageArr]);

  function handleChatSend() {
    socket.emit("chatSend", {
      name: roomData.name,
      currRoom: roomData.roomId,
      message,
    });
    setMessage("");
  }

  return (
    <div
      className="col-span-3 row-span-5 bg-emerald-100 rounded-md flex flex-col shadow-lg"
      style={{ gridColumnStart: 10, gridRowStart: 5 }}
    >
      {/* Header */}
      <div className="w-full bg-emerald-200 text-emerald-900 font-bold text-lg py-3 px-4 rounded-t-md">
        Chat
      </div>

      {/* Chat Display Area */}
      <div ref={chatEndRef} className="flex-1 w-full overflow-y-auto max-h-[38vh] p-4 bg-white border border-emerald-300 rounded-md shadow-inner">
        <ul className="flex flex-col space-y-4" >
          {messageArr.map((mes, index) => (
            <li
              key={index}
              className={`p-3 rounded-lg shadow-sm w-fit max-w-[70%] ${
                mes.name === roomData.name
                  ? "self-end bg-emerald-200 text-emerald-900"
                  : "self-start bg-emerald-50 text-emerald-900"
              }`}
            >
              <strong>{mes.name}:</strong> {mes.message}
            </li>
          ))}
        </ul>
      </div>

      {/* Input Box */}
      <div className="flex items-center w-full px-4 py-2 bg-emerald-200 rounded-b-md">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-2 border border-emerald-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
        />
        <button
          disabled={!message}
          onClick={handleChatSend}
          className="ml-3 px-6 py-2 bg-emerald-600 text-white rounded-md shadow-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
