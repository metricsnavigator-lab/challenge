import React, { useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import useUser from '../hooks/useUser';

export default function Home() {
    const { user } = useAuth();
    const getUser = useUser()

    useEffect(() => {
        getUser()
    }, [])

    return (
        <div className='container mt-3'>
            <h2>
                <div className='row'>
                    <div className="mb-12 col-6">
                        {user?.email !== undefined ? 'List user Ethereum balance' : 'Please login first'}
                    </div>
                    {user?.email !== undefined && (
                        <div className="mb-12 col-6">
                            {user.balance}
                        </div>
                    )}
                </div>
            </h2>
        </div>
    )
}
