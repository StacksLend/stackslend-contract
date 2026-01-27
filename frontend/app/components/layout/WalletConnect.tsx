'use client';

import { useEffect, useState } from 'react';
import { showConnect, UserSession, AppConfig } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function WalletConnect() {
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const connect = () => {
    showConnect({
      appDetails: {
        name: 'StacksLend',
        icon: window.location.origin + '/favicon.ico',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  const disconnect = () => {
    userSession.signUserOut();
    window.location.reload();
  };

  if (!mounted) return null;

  if (userData) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-mono text-white/80">
          {userData.profile.stxAddress.mainnet.slice(0, 6)}...
          {userData.profile.stxAddress.mainnet.slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors shadow-lg shadow-orange-500/20"
    >
      Connect Wallet
    </button>
  );
}
