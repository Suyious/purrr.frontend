import RightIcon from "@/assets/icons/right";
import { FormEvent, useRef } from "react";

type GreetingProps = {
    onSubmit: (name: string, gender: string) => void
}

export default function Greeting({ onSubmit }: GreetingProps) {

    const name = useRef<HTMLInputElement>(null);
    const gender = useRef<HTMLSelectElement>(null);

    function onSubmitPrevent(e: FormEvent) {
        e.preventDefault();
        if(name.current && gender.current && gender.current.value){
            onSubmit(name.current.value, gender.current.value);
        }
    }


    return (
        <section className="w-full h-full flex justify-center items-center">
            <form onSubmit={onSubmitPrevent} className="flex flex-col items-center gap-4 w-full">
                <label className="flex flex-col items-center text-center w-full mb-7">
                    <span className="text-[1.2em] font-[500]">Your Name</span>
                    <input ref={name} className="text-[3em] bg-inherit text-inherit font-[400] width-[10em] max-w-[90%] text-center outline-none border-b-2 border-foreground" type="text" placeholder="Pick a Name"/>
                </label>
                <label className="flex flex-col items-center text-center w-full">
                    <span className="text-[1.2em] font-[500]">Your Gender</span>
                    <select ref={gender} className="text-[3em] bg-inherit text-inherit font-[400] width-[10em] max-w-[90%] text-center outline-none border-b-2 border-foreground">
                      <option value="" selected disabled>Select</option>
                      <option value="m">Male</option>
                      <option value="f">Female</option>
                      <option value="o">I don&apos;t want to tell</option>
                    </select>
                </label>
                <button className="flex font-[500]">Continue to Chat <RightIcon/> </button>
            </form>
        </section>
    )
}
