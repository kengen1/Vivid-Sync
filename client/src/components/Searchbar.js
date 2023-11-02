/*
    PURPOSE OF COMPONENT:
    - component is not currently in use
    - intended use case was to search the S3 bucket for existing images in the gallery component
    - can be implemented in later iterations
*/

import React, { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { words } from '../placeholder/data'
import Card from './Card'

const Searchbar = () => {
    const [activeSearch, setActiveSearch] = useState([])

    const handleSearch = (e) => {
        if (e.target.value === '') {
            setActiveSearch([])
            return false
        }
        setActiveSearch(words.filter(w => w.includes(e.target.value)).slice(0, 8))
    }

    return (
        <Card>
            <form className='w-[500px] relative mx-auto'>
                <div className="relative">
                    <input
                        type="search"
                        placeholder='Type Here . . .'
                        className='w-full p-4 rounded-full bg-slate-800'
                        onChange={(e) => handleSearch(e)}
                    />
                    <button className='absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-slate-600 rounded-full'>
                        <AiOutlineSearch />
                    </button>
                </div>

                {activeSearch.length > 0 && (
                    <div className="absolute top-20 p-4 bg-slate-800 text-white w-full rounded-xl left-1/2 -translate-x-1/2 transform">
                        {activeSearch.map((s, index) => (
                            <span key={index}>{s}</span>
                        ))}
                    </div>
                )}
            </form>
        </Card>
    )
}

export default Searchbar
