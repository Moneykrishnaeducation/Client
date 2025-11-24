import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import {
  RefreshCw,
  DollarSign,
  Network,
  TrendingUp,
  Lock,
  User,
  Users,
  Star
} from 'lucide-react';

const Ibrequest = () => {
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Fetch initial IB request status on component mount
  useEffect(() => {
    const fetchIBStatus = async () => {
      try {
        const data = await apiCall('ib-request/');
        if (data.status === 'pending') {
          setIsPending(true);
        }
      } catch (error) {
        console.error('Failed to fetch IB status:', error);
        // If no request exists, status remains false
      }
    };

    fetchIBStatus();
  }, []);

  const handleJoinClick = async () => {
    setIsLoading(true);


    try {
      const response = await apiCall('ib-request/', {
        method: 'POST'
      });

      if (response.status === 'pending') {
        setIsPending(true);
        setShowModal(true);
      } else {
        setAlertMessage('IB request updated successfully!');
      }
    } catch (error) {
      console.error('Failed to submit IB request:', error);
      setAlertMessage('Failed to submit IB request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* INLINE HOVER EFFECTS */}
      <style>{`
        .hover-gold-shadow:hover {
          box-shadow: 0 0 18px #facc15 !important; /* yellow-400 glow */
        }
        .hover-zoom-out {
          transition: transform 0.25s ease-in-out;
        }
        .hover-zoom-out:hover {
          transform: scale(0.97);
        }
      `}</style>

      <div className="min-h-screen flex justify-center items-center p-8 bg-black text-yellow-400">

        <div className="max-w-4xl w-full p-8 rounded-lg text-center bg-black shadow-xl">

          {/* Heading */}
          <h1 className="text-3xl font-bold mb-4 text-yellow-400">
            <RefreshCw className="inline mr-2 text-yellow-400" size={32} />
            Become an Introducing Broker (IB)
          </h1>

          <p className="mb-8 text-lg text-yellow-400">
            Unlock financial freedom and earn commissions by referring clients.
            Build a powerful multi-level earning network with unlimited potential.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

            <div className="p-6 rounded-lg border border-yellow-300 bg-black text-yellow-400 shadow-md hover-gold-shadow hover:text-yellow-400 hover-zoom-out cursor-pointer">
              <DollarSign size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lucrative Commissions</h3>
              <p>Earn commissions for every client you onboard.</p>
            </div>

            <div className="p-6 rounded-lg border border-yellow-300 bg-black text-yellow-400 shadow-md hover-gold-shadow hover:text-yellow-400 hover-zoom-out cursor-pointer">
              <Network size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expand Your Network</h3>
              <p>Grow your connections and your earnings.</p>
            </div>

            <div className="p-6 rounded-lg border border-yellow-300 bg-black text-yellow-400 shadow-md hover-gold-shadow hover:text-yellow-400 hover-zoom-out cursor-pointer">
              <TrendingUp size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Limitless Potential</h3>
              <p>Earn across multiple levels of referrals.</p>
            </div>

            <div className="p-6 rounded-lg border border-yellow-300 bg-black text-yellow-400 shadow-md hover-gold-shadow hover:text-yellow-400 hover-zoom-out cursor-pointer">
              <Lock size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Partnership</h3>
              <p>Partner with a trusted and reliable platform.</p>
            </div>

          </div>

          {/* Client Tree */}
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">
            <TrendingUp className="inline mr-2 text-yellow-400" size={28} />
            Amplify Your Earnings with Our Client Tree
          </h2>

          <p className="mb-8 text-lg text-yellow-400">
            Build a powerful three-level referral network and earn continuously as your network grows.
          </p>

          {/* Levels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="p-6 rounded-lg border border-yellow-300 bg-black text-yellow-400 shadow-md hover-gold-shadow hover:text-yellow-400 hover-zoom-out cursor-pointer">
              <User size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Level 1</h3>
              <p>Your direct referrals. Highest earnings.</p>
            </div>

            <div className="p-6 rounded-lg border border-yellow-300 bg-black text-yellow-400 shadow-md hover-gold-shadow hover:text-yellow-400 hover-zoom-out cursor-pointer">
              <Users size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Level 2</h3>
              <p>Clients referred by your Level 1.</p>
            </div>

            <div className="p-6 rounded-lg border border-yellow-300 bg-black text-yellow-400 shadow-md hover-gold-shadow hover:text-yellow-400 hover-zoom-out cursor-pointer">
              <Users size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Level 3</h3>
              <p>Indirect referrals from Level 2.</p>
            </div>

          </div>

          {/* Button */}
          <div className="mt-8">
            <button
              onClick={handleJoinClick}
              disabled={isPending || isLoading}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all hover-zoom-out
                ${isPending || isLoading
                  ? 'bg-gray-600 cursor-not-allowed text-yellow-400'
                  : 'bg-yellow-400 text-black hover:shadow-[0_0_20px_#facc15] hover:text-black'
                }
              `}
            >
              {isLoading
                ? 'Sending...'
                : isPending
                ? 'Waiting for Approval'
                : (
                  <>
                    <Star className="inline mr-2" size={20} /> Become an IB Partner
                  </>
                )}
            </button>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-black border border-yellow-400 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Success!</h3>
                <p className="text-yellow-400 mb-6">IB request submitted successfully! Waiting for approval.</p>
                <button
                  onClick={closeModal}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Ibrequest;
