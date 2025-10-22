import { useAuth } from '@/api/authContext';
import { createMessage, getMessagesBetweenUsers } from '@/api/messageAPI';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

function formatTimestamp(date: string): string {
    if (date==="") {
        return ""
    }
    const ndate = new Date(date)     
    return ndate.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour12: false, // Use true for 12-hour format
    });
  }

const Message = () => {
  const { user } = useAuth();
  document.title = "Give Us Feedback"
  
  const userId = user?.id || '';
  let syntonyteamid = "170e5bba-e003-4bbb-96b4-41278469b238";
  const [messages, setMessages] = useState([
    { sender_id: '170e5bba-e003-4bbb-96b4-41278469b238', id:"0", timestamp:"", content: 'Hello, and welcome to the beta of Syntony’s ReSearch! We’re thrilled to have you on board and can’t wait for you to explore the platform. ' },
    { sender_id: '170e5bba-e003-4bbb-96b4-41278469b238', id:"0", timestamp:"", content: 'If you have any feedback, suggestions, or ideas along the way, please feel free to share them here. Your insights are invaluable in helping us shape ReSearch to best meet your needs. Thank you for being a part of this journey with us!' },
  ]);
  const handleLoad = async () => {
    // Clear the messages by setting it to an empty array
    setMessages([]);
  
    // Get new messages
    const new_ms = await getMessagesBetweenUsers(user.id, syntonyteamid);
  
    // Create the new messages array with your static messages
    const updatedMessages = [
      { sender_id: '170e5bba-e003-4bbb-96b4-41278469b238', id:"0", timestamp:"", content: 'Hello, and welcome to the beta of Syntony’s ReSearch! We’re thrilled to have you on board and can’t wait for you to explore the platform.' },
      { sender_id: '170e5bba-e003-4bbb-96b4-41278469b238', id:"0", timestamp:"", content: 'If you have any feedback, suggestions, or ideas along the way, please feel free to share them here. Your insights are invaluable in helping us shape ReSearch to best meet your needs. Thank you for being a part of this journey with us!' },
      ...new_ms // Spread the new messages into the updatedMessages array
    ];
  
    // Update the messages state with the new array
    setMessages(updatedMessages);
  }
  
  useEffect(() => {
    handleLoad(); // Initial load

    const interval = setInterval(() => {
      handleLoad(); // Call handleLoad at regular intervals
    }, 400000); // 5000 ms = 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [user?.id]); // Add user.id as a dependency to reload messages if the user changes

  const [input, setInput] = useState('');

  const  handleSend = async () => {
    if (input.trim()) {
        const msg = await createMessage({sender_id:user.id, receiver_id:syntonyteamid, content:input}) /* {
            sender_id: string;
            receiver_id: string;
            content: string;
            }*/
        const formattedTimestamp = formatTimestamp(msg.timestamp)
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender_id: user.id, id:msg.message_id, timestamp:formattedTimestamp, content: input },
        ]);
        setInput('');
      
    }
  };

  // Handle key press to send message on Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

 
  return (
    <div className="flex flex-col h-[860px] p-4 mx-48">
      {/* Header */}
      <div className="mb-4 text-5xl mt-10 font-light w-full text-center">Chat with Syntony's Team</div>

      <div className=''>
      {/* Message Display Area */}
      <ScrollArea className='w-full h-[600px]' style={{ scrollBehavior: 'smooth' }}>
      <div className="flex-1 overflow-y-auto p-4 rounded-lg w-full ">
        <div id="messages_list">
       
          {messages.length === 0 ? (
            <div className="text-center text-gray-500"></div>
          ) : (
            messages.map((msg) => (
                <div className='flex flex-row justify-between group items-center'>
                    
                    {userId && msg.sender_id === userId ? (
                        <div className='hidden group-hover:flex text-base text-stone-800 p-2 px-4 items-center'>
                            <div className='w-48'>{formatTimestamp(msg.timestamp)}</div>
                        </div>
                    ) : null}
                    <div
                        className={`w-full flex group flex-row ${(userId && msg.sender_id === userId) ? ' items-end justify-end align-bottom' : 'items-start'}`}
                    >
                        <div className={`p-3 px-4 text-lg max-w-screen-sm rounded-3xl ${
                            (userId && msg.sender_id === userId) ? 'bg-gray-50 mb-2 border-gray-200 border' : 'my-0 py-1 '
                        }`}>
                            <div>{msg.content}</div>
                        </div>
                    </div>
                    {userId && msg.sender_id != userId ? (
                        <div className='hidden group-hover:flex p-2'>
                            <div  className='w-24'>{formatTimestamp(msg.timestamp)}</div>
                        </div>
                    ) : null}
                </div>
            ))
          )}
        </div>
        
      </div>
      </ScrollArea>
      
      {/* Message Input Area */}
      <div className='w-full justify-center flex flex-row'>
      <div className="flex m-4 w-[800px]">
        <div className='flex flex-1 justify-between p-2 border align-middle items-center border-gray-200 bg-gray-50 rounded-full focus:outline-none'>
        <input
          type="text"
          className="flex-1 p-2 bg-gray-50 focus:outline-none text-lg px-4"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress} // Send message on Enter
        />
        <a
          onClick={handleSend}
          className="pl-4"
        >
          <ArrowUp className='w-8 h-8 text-stone-800 rounded-full cursor-pointer mx-2'/>
        </a>

        </div>
      </div>
      </div>
      
      </div>
      
    </div>
  );
};

export default Message;
