import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { axiosInstance } from '../api/apiConfig';

const BALANCE_DIVISOR = 1e18;

export default function Home() {
    const { user, error: authError, isAuthenticated } = useAuth();
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user && user.ethereum_wallet_address) {
            fetchBalance(user.ethereum_wallet_address);
        }
    }, [user.ethereum_wallet_address, isAuthenticated]);

    const fetchBalance = async (walletAddress) => {
        if (!walletAddress || typeof walletAddress !== 'string') return;
        setLoading(true);
        try {
            const response = await axiosInstance.get('auth/balance', {
                params: { wallet_address: walletAddress },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            console.log(user.token); // Log the token
            if (response.status === 200 && response.data) {
                setBalance(response.data.balance);
                setError('');
            } else if (response.status === 401) {
                setError('Unauthorized. Please login again.');
            } else {
                setError('Failed to fetch balance. Please check the wallet address.');
            }
        } catch (error) {
            if (axiosInstance.isAxiosError(error)) {
                setError('Failed to fetch balance. Please check the wallet address.');
            } else {
                setError('An unexpected error occurred.');
            }
            console.error('Error fetching balance:', error);
        } finally {
            setLoading(false);
        }
    };
    const formatBalance = (balance) => {
        if (!balance) return '0';
        return (balance / BALANCE_DIVISOR).toFixed(4) + ' ETH';
    };

    return (
        <div className='container mt-3'>
            <h2>Ethereum Wallet Balance</h2>
            <div className='row'>
                <div className="mb-12">
                    {authError ? (
                        <p className="text-danger">{authError}</p>
                    ) : isAuthenticated ? (
                        <>
                            <p>Ethereum Wallet Address: {user.ethereum_wallet_address}</p>
                            {loading ? (
                                <p>Loading balance...</p>
                            ) : error ? (
                                <p className="text-danger">{error}</p>
                            ) : balance !== null ? (
                                <p>Your Ethereum Wallet Balance: {formatBalance(balance)}</p>
                            ) : (
                                <p>Balance not available</p>
                            )}
                        </>
                    ) : (
                        'Please login first'
                    )}
                </div>
            </div>
        </div>
    );
}