import React from 'react'
import {Link} from 'react-router-dom'

const BookCard = ({ data }) => {
    //console.log(data)
    return (
        <>
        <Link to={`/view-book-details/${data._id}`} className='no-underline text-white'>
            <div className='bg-zinc-800 rounded p-4 flex flex-col '>
                <div className='bg-zinc-900 rounded flex items-center justify-center'>
                    <img src={data.url} alt='/' className='h-[25vh]' />
                </div>
                <h2 className='mt-4 text-2xl text-white font-semibold'>{data.title}</h2>
                <p className='mt-2 text-xl text-zinc-400 font-semibold'>by {data.author}</p>
                <p className='text-white font-semibold'>{data.genre}</p>
            </div>
        </Link>
        </>
        
    )
}

export default BookCard
