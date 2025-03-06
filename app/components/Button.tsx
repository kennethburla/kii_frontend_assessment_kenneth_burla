import React, { ButtonHTMLAttributes } from 'react'

export default function Button(props: ButtonHTMLAttributes<unknown>) {
    return (
        <button
            {...props}
            className={`h-[30px] w-full bg-black rounded-lg flex flex-row items-center justify-center text-white font-bold text-sm border-1 cursor-pointer px-4 border-accent-1 ${props.className}`}
        />
    )
}
