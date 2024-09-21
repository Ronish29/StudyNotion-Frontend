import React from 'react'

const Stats = [
    {
        count: "5K", 
        label: "Active Students"
    },
    {   
        count: "10+", 
        label: "Mentors"
    },
    {
        count: "200+",
        label: "Courses",
    },
    {
        count: "50+",
        label: "Awards"
    }
];

const StatsComponent = () => {
  return (
    <section>
        <div className='w-full mx-auto'>
            <div className='flex gap-x-5 text-center'>
                {
                    Stats.map( (data, index) => (
                        <div key={index} className='flex flex-col'>
                            <h1>{data.count}</h1>
                            <h2>{data.label}</h2>
                        </div>
                    ))
                }
            </div>
        </div>
    </section>
  )
}

export default StatsComponent