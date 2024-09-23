import RightIcon from "@/assets/icons/right";
import { FormEvent, useEffect, useRef } from "react";

type GreetingProps = {
    onSubmit: (name: string) => void
}

export default function Greeting({ onSubmit }: GreetingProps) {

    const name = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (typeof window != 'undefined' && window.localStorage) {
        const username = localStorage.getItem('username');
        if (username) {
          onSubmit(username);
        }
      }
    }, [])

    function onSubmitPrevent(e: FormEvent) {
        e.preventDefault();
        if(name.current){
            onSubmit(name.current.value);
        }
    }


    return (
        <section className="w-full h-full flex justify-center items-center">
            <form onSubmit={onSubmitPrevent} className="flex flex-col items-center gap-4 w-full">
                <label className="flex flex-col items-center text-center w-full">
                    <span className="text-[1.2em] font-[500]">Your Name</span>
                    <input maxLength={30} ref={name} className="text-[3em] bg-inherit text-inherit font-[400] width-[10em] max-w-[90%] text-center outline-none border-b-2 border-foreground" type="text" placeholder="Pick a Name"/>
                </label>
                <button className="flex font-[500]">Continue to Chat <RightIcon/> </button>
            </form>
        </section>
    )
}
