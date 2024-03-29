import React, { useEffect, useState } from "react";
import { CreateChatRoom } from "./CreateChatRoom";
import { useSelector } from "react-redux";
import { FiRefreshCcw } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";

export const ChatDashBoard = ({ refresh, setRefresh }) => {
  const [groupData, setGroupData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  // let [refresh, setRefresh] = useState(false);

  const NAVIGATE = useNavigate();

  const getGroupDataHandler = async () => {
    try {
      let res = await fetch(`/api/user/groupdata/${currentUser._id}`);
      const data = await res.json();
      console.log(data);
      setGroupData(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getGroupDataHandler();
  }, [refresh]);

  return (
    <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
      <div className="flex flex-row items-center justify-center h-12 w-full">
        <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            ></path>
          </svg>
        </div>
        <div className="ml-2 font-bold text-2xl">QuickChat</div>
      </div>
      <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
        <div className="h-20 w-20 rounded-full border overflow-hidden">
          <img
            src="https://avatars3.githubusercontent.com/u/2763884?s=128"
            alt="Avatar"
            className="h-full w-full"
          />
        </div>
        <div className="text-sm font-semibold mt-2">Aminos Co.</div>
        <div className="text-xs text-gray-500">Lead UI/UX Designer</div>
        <div className="flex flex-row items-center mt-3">
          <div className="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full">
            <div className="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
          </div>
          <div className="leading-none ml-1 text-xs">Active</div>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <div className="flex flex-row items-center justify-between text-xs">
          <span className="font-bold text-red-800">
            {groupData.length === 0
              ? "Create or join group to chat"
              : "Active Conversations"}
          </span>
          <Button variant='filled' className="bg-red-700" onClick={()=>{
            NAVIGATE('/search')
          }}>
            <AiOutlinePlus />
          </Button>
          {/* <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
            4
          </span> */}
        </div>

        <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
          {groupData.map((group) => (
            <button
              key={group._id}
              className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
              onClick={() => {
                setRefresh((state) => !state);
                NAVIGATE(`/chat/${group._id}`);
              }}
            >
              <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                <img src={group.avatar} />
              </div>
              <div className="ml-2 text-sm font-semibold">
                {group.groupName}
              </div>
            </button>
          ))}
          {/* <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
            <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
              H
            </div>
            <div className="ml-2 text-sm font-semibold">Henry Boyd</div>
          </button>
          <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
            <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
              M
            </div>
            <div className="ml-2 text-sm font-semibold">Marta Curtis</div>
            <div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none">
              2
            </div>
          </button>
          <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
            <div className="flex items-center justify-center h-8 w-8 bg-orange-200 rounded-full">
              P
            </div>
            <div className="ml-2 text-sm font-semibold">Philip Tucker</div>
          </button>
          <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
            <div className="flex items-center justify-center h-8 w-8 bg-pink-200 rounded-full">
              C
            </div>
            <div className="ml-2 text-sm font-semibold">Christine Reid</div>
          </button>
          <button className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
            <div className="flex items-center justify-center h-8 w-8 bg-purple-200 rounded-full">
              J
            </div>
            <div className="ml-2 text-sm font-semibold">Jerry Guzman</div>
          </button> */}
        </div>

        <CreateChatRoom refresh={refresh} setRefresh={setRefresh} />
      </div>
    </div>
  );
};
