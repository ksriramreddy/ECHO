import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEcho, setSelectedUser } from '../store/chat.store';

const Echoai = () => {
    const dispatch = useDispatch()
    const {ECHO} = useSelector(state => state.chat)
    const activateECHOAI = (e) => {
        e.preventDefault()
        dispatch(setEcho(true))
        dispatch(setSelectedUser(null))
    }
    return (
        <div>
            <button onClick={activateECHOAI}  className={`flex  flex-row items-center  gap-2 cursor-pointer min-w-[40px]   p-0 hover:bg-base-300 w-full ${ECHO? "bg-base-300 ": ""} rounded-lg sm:p-2`}>
                <div className='relative  min-w-fit'>
                    <img src={"https://res.cloudinary.com/dqnmzdsoy/image/upload/v1746648127/heutoqaftja7g0fvtycw.png"} alt="" className='w-10 h-10 rounded-full' />
                    <div className={`absolute w-3 h-3 right-0 bottom-[1px]  rounded-full  border bg-green-400  `}></div>
                </div>
                <div className='sm:flex flex-col hidden'>
                    <span className='text-md  text-left font-semibold'>ECHO - AI</span>
                    <span className='text-sm  text-left '>{"Personal Assistance"}</span>
                </div>
            </button>
        </div>
    );
}

export default Echoai;
